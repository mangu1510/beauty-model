import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { query, queryOne, pool } from "./lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

const jsonHeaders = new Headers({ "content-type": "application/json; charset=utf-8" });

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), { headers: jsonHeaders, ...init });
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ?? "";

const orderSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  line1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pin: z.string().min(4),
  delivery: z.enum(["standard", "express", "ritual"]),
  payment: z.enum(["upi", "card", "wallet", "cod"]),
  items: z.array(z.object({ productId: z.string(), qty: z.number().min(1), shade: z.string().nullable().optional(), unitPrice: z.number().min(0), name: z.string() })),
  subtotal: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  tax: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

function normalizeProductRow(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    price: Number(row.price),
    compareAt: row.compare_at !== null ? Number(row.compare_at) : undefined,
    category: row.category,
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    shades: row.shades ?? undefined,
    ingredients: row.ingredients ?? undefined,
    badges: row.badges ?? undefined,
    description: row.description,
    details: row.details ?? undefined,
    image: row.image,
    hue: Number(row.hue),
    isNew: Boolean(row.is_new),
    isBestseller: Boolean(row.is_bestseller),
  };
}

async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  async function getUserFromRequest(req: Request) {
    try {
      const cookies = Object.fromEntries((req.headers.get('cookie') || '').split(';').map(c => c.trim().split('=').map(s => s.trim())));
      const token = cookies['bm_sess'];
      if (!token) return null;
      const session = await queryOne<any>(`SELECT user_id, expires_at FROM sessions WHERE token = ?`, [token]);
      if (!session) return null;
      if (new Date(session.expires_at) < new Date()) {
        await query(`DELETE FROM sessions WHERE token = ?`, [token]);
        return null;
      }
      const user = await queryOne<any>(`SELECT id, name, email FROM users WHERE id = ?`, [session.user_id]);
      return user || null;
    } catch (err) {
      console.error('getUserFromRequest error', err);
      return null;
    }
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (pathname === "/api/health" && request.method === "GET") {
    return json({ status: "ok", environment: process.env.NODE_ENV ?? "development" });
  }

  if (pathname === "/api/categories" && request.method === "GET") {
    const categories = await query<{ id: string; name: string; tagline: string; hue: number }>(
      "SELECT id, name, tagline, hue FROM categories ORDER BY name",
    );
    return json(categories);
  }

  if (pathname === "/api/products" && request.method === "GET") {
    const category = url.searchParams.get("category");
    const sort = url.searchParams.get("sort");
    const minRating = Number(url.searchParams.get("minRating") ?? 0);
    const maxPrice = Number(url.searchParams.get("maxPrice") ?? 9999999);
    const conditions: string[] = ["price <= ?"];
    const params: any[] = [maxPrice];
    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (minRating > 0) {
      conditions.push("rating >= ?");
      params.push(minRating);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy =
      sort === "low"
        ? "price ASC"
        : sort === "high"
        ? "price DESC"
        : sort === "rating"
        ? "rating DESC"
        : sort === "new"
        ? "is_new DESC, rating DESC"
        : "is_bestseller DESC, rating DESC";
    const products = await query<any>(
      `SELECT * FROM products ${whereClause} ORDER BY ${orderBy} LIMIT 200`,
      params,
    );
    return json(products.map(normalizeProductRow));
  }

  if (pathname === "/api/auth/google" && request.method === "GET") {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
      return new Response(JSON.stringify({ message: "Google OAuth is not configured." }), { status: 500, headers: jsonHeaders });
    }
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return new Response(null, { status: 302, headers: { location: authUrl.toString() } });
  }

  if (pathname === "/api/auth/google/callback" && request.method === "GET") {
    const code = url.searchParams.get("code");
    if (!code || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      return new Response(JSON.stringify({ message: "Missing Google OAuth configuration or code." }), { status: 400, headers: jsonHeaders });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return new Response(JSON.stringify({ message: "Failed to exchange Google OAuth code." }), { status: 500, headers: jsonHeaders });
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email || !profile.name) {
      return new Response(JSON.stringify({ message: "Failed to fetch Google profile." }), { status: 500, headers: jsonHeaders });
    }

    // Create or find user
    let user = await queryOne<any>(`SELECT id, name, email FROM users WHERE email = ?`, [profile.email]);
    if (!user) {
      try {
        await query(`INSERT INTO users (name, email) VALUES (?, ?)`, [profile.name, profile.email]);
        user = await queryOne<any>(`SELECT id, name, email FROM users WHERE email = ?`, [profile.email]);
      } catch (err) {
        console.error("Failed to create user from Google profile", err);
      }
    }

    // Create session token and set cookie, then redirect to account
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    if (user) {
      await query(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`, [token, user.id, expiresAt]);
    }

    const secure = process.env.NODE_ENV === "production";
    const cookie = `bm_sess=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${secure ? `; Secure` : ""}`;
    const redirectLocation = new URL("/account", url.origin);
    return new Response(null, { status: 302, headers: { location: redirectLocation.toString(), "Set-Cookie": cookie } });
  }

  // --- Auth endpoints ---
  if (pathname === "/api/auth/signup" && request.method === "POST") {
    try {
      const body = await request.json();
      const { name, email, password } = body;
      if (!name || !email || !password || password.length < 6) {
        return new Response(JSON.stringify({ message: "Invalid signup data." }), { status: 400, headers: jsonHeaders });
      }

      const hash = await bcrypt.hash(password, 10);
      try {
        const res = await queryOne<any>(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`, [name, email, hash]);
      } catch (err: any) {
        // duplicate email
        if (err && err.code === "ER_DUP_ENTRY") {
          return new Response(JSON.stringify({ message: "Email already registered." }), { status: 409, headers: jsonHeaders });
        }
        throw err;
      }

      // fetch user id
      const user = await queryOne<any>(`SELECT id, name, email FROM users WHERE email = ?`, [email]);
      if (!user) return new Response(JSON.stringify({ message: "Unable to create user." }), { status: 500, headers: jsonHeaders });

      // create session
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await query(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`, [token, user.id, expiresAt]);

      const secure = process.env.NODE_ENV === "production";
      const cookie = `bm_sess=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${secure ? "; Secure" : ""}`;
      return new Response(JSON.stringify({ id: user.id, name: user.name, email: user.email }), { status: 200, headers: { ...Object.fromEntries(jsonHeaders.entries()), "Set-Cookie": cookie } });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: "Signup failed." }), { status: 500, headers: jsonHeaders });
    }
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    try {
      const body = await request.json();
      const { email, password } = body;
      if (!email || !password) return new Response(JSON.stringify({ message: "Invalid login." }), { status: 400, headers: jsonHeaders });

      const user = await queryOne<any>(`SELECT id, name, email, password_hash FROM users WHERE email = ?`, [email]);
      if (!user) return new Response(JSON.stringify({ message: "Invalid credentials." }), { status: 401, headers: jsonHeaders });

      const ok = await bcrypt.compare(password, user.password_hash || "");
      if (!ok) return new Response(JSON.stringify({ message: "Invalid credentials." }), { status: 401, headers: jsonHeaders });

      // create session
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await query(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`, [token, user.id, expiresAt]);

      const secure = process.env.NODE_ENV === "production";
      const cookie = `bm_sess=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}${secure ? "; Secure" : ""}`;
      return new Response(JSON.stringify({ id: user.id, name: user.name, email: user.email }), { status: 200, headers: { ...Object.fromEntries(jsonHeaders.entries()), "Set-Cookie": cookie } });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: "Login failed." }), { status: 500, headers: jsonHeaders });
    }
  }

  if (pathname === "/api/auth/logout" && request.method === "POST") {
    try {
      const cookies = Object.fromEntries((request.headers.get("cookie") || "").split(';').map(c => c.trim().split('=').map(s => s.trim())));
      const token = cookies['bm_sess'];
      if (token) {
        await query(`DELETE FROM sessions WHERE token = ?`, [token]);
      }
      const cookie = `bm_sess=deleted; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...Object.fromEntries(jsonHeaders.entries()), "Set-Cookie": cookie } });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: "Logout failed." }), { status: 500, headers: jsonHeaders });
    }
  }

  if (pathname === "/api/auth/me" && request.method === "GET") {
    try {
      const cookies = Object.fromEntries((request.headers.get("cookie") || "").split(';').map(c => c.trim().split('=').map(s => s.trim())));
      const token = cookies['bm_sess'];
      if (!token) return new Response(JSON.stringify({ user: null }), { status: 200, headers: jsonHeaders });
      const session = await queryOne<any>(`SELECT user_id, expires_at FROM sessions WHERE token = ?`, [token]);
      if (!session) return new Response(JSON.stringify({ user: null }), { status: 200, headers: jsonHeaders });
      if (new Date(session.expires_at) < new Date()) {
        await query(`DELETE FROM sessions WHERE token = ?`, [token]);
        return new Response(JSON.stringify({ user: null }), { status: 200, headers: jsonHeaders });
      }
      const user = await queryOne<any>(`SELECT id, name, email FROM users WHERE id = ?`, [session.user_id]);
      return new Response(JSON.stringify({ user: user || null }), { status: 200, headers: jsonHeaders });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ user: null }), { status: 200, headers: jsonHeaders });
    }
  }

  if (pathname.startsWith("/api/products/") && request.method === "GET") {
    const slug = decodeURIComponent(pathname.replace("/api/products/", ""));
    const product = await queryOne<any>("SELECT * FROM products WHERE slug = ?", [slug]);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404, headers: jsonHeaders });
    }
    return json(normalizeProductRow(product));
  }

  if (pathname === "/api/orders" && request.method === "POST") {
    const payload = orderSchema.safeParse(await request.json());
    if (!payload.success) {
      return new Response(JSON.stringify({ message: payload.error.message }), { status: 400, headers: jsonHeaders });
    }
    const data = payload.data;

    // Validate items against product prices on server to prevent client tampering
    const ids = Array.from(new Set(data.items.map((i: any) => i.productId)));
    if (ids.length === 0) {
      return new Response(JSON.stringify({ message: "No items in order." }), { status: 400, headers: jsonHeaders });
    }

    // Fetch product prices
    const placeholders = ids.map(() => "?").join(",");
    const productRows = await query<any>(`SELECT id, price FROM products WHERE id IN (${placeholders})`, ids);
    const priceMap = new Map(productRows.map(r => [r.id, Number(r.price)]));

    // Compute expected subtotal from server prices
    let expectedSubtotal = 0;
    for (const item of data.items) {
      const price = priceMap.get(item.productId);
      if (price === undefined) {
        return new Response(JSON.stringify({ message: `Product not found: ${item.productId}` }), { status: 400, headers: jsonHeaders });
      }
      expectedSubtotal += price * item.qty;
    }

    const expectedShipping = expectedSubtotal > 1500 || expectedSubtotal === 0 ? 0 : 99;
    const expectedTax = Math.round(expectedSubtotal * 0.05);
    const expectedTotal = expectedSubtotal + expectedShipping + expectedTax;

    if (expectedSubtotal !== data.subtotal || expectedShipping !== data.shipping || expectedTax !== data.tax || expectedTotal !== data.total) {
      return new Response(JSON.stringify({ message: "Order totals mismatch. Please refresh and try again." }), { status: 400, headers: jsonHeaders });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const orderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

      await conn.execute(
        `INSERT INTO orders (order_id, name, email, phone, line1, city, state, pin, delivery_method, payment_method, subtotal, shipping, tax, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          data.name,
          data.email,
          data.phone,
          data.line1,
          data.city,
          data.state,
          data.pin,
          data.delivery,
          data.payment,
          expectedSubtotal,
          expectedShipping,
          expectedTax,
          expectedTotal,
        ],
      );

      for (const item of data.items) {
        const unitPrice = priceMap.get(item.productId)!;
        await conn.execute(
          `INSERT INTO order_items (order_id, product_id, shade, quantity, unit_price) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.productId, item.shade ?? null, item.qty, unitPrice],
        );
      }

      await conn.commit();
      return json({ orderId });
    } catch (err) {
      try { await conn.rollback(); } catch {}
      console.error(err);
      return new Response(JSON.stringify({ message: "Failed to create order." }), { status: 500, headers: jsonHeaders });
    } finally {
      conn.release();
    }
  }

  if (pathname === "/api/account/orders" && request.method === "GET") {
    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ message: 'Unauthenticated' }), { status: 401, headers: jsonHeaders });

    const orders = await query<any>(`SELECT order_id, name, email, phone, line1, city, state, pin, delivery_method as delivery, payment_method as payment, subtotal, shipping, tax, total, created_at FROM orders WHERE email = ? ORDER BY created_at DESC`, [user.email]);

    // fetch items per order
    const result = [];
    for (const o of orders) {
      const items = await query<any>(`SELECT product_id, shade, quantity as qty, unit_price FROM order_items WHERE order_id = ?`, [o.order_id]);
      result.push({ ...o, items });
    }

    return json({ orders: result });
  }

  return new Response(JSON.stringify({ message: "Not found" }), { status: 404, headers: jsonHeaders });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/")) {
        return await handleApiRequest(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
