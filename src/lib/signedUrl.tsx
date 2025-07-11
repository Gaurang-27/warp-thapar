import crypto from "crypto";

const SECRET = process.env.SIGNED_URL_SECRET!;

// Generate a token using the user's email and an expiry time
export function generateToken(email: string, expiresInSec: number) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSec;
  const expiresStr = String(expires);
  const base = `${email}:${expiresStr}`;
  const token = crypto.createHmac("sha256", SECRET).update(base).digest("hex");
  return { token, expires: expiresStr };
}

// Validate a token using the provided email and expiry
export function isValidToken(token: string, expires: string, email: string): string | null {
  const now = Math.floor(Date.now() / 1000);
  if (now > Number(expires)) return null;

  const base = `${email}:${expires}`;
  const expected = crypto.createHmac("sha256", SECRET).update(base).digest("hex");
  
  return expected === token ? email : null;
}
