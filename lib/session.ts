import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "session";
export const MAX_AGE = 7 * 24 * 60 * 60; // seconds

const key = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export const signSession = () =>
  new SignJWT({ admin: true }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());

export async function verifySession(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
