import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "your_jwt_secret";

const ACCESS_EXPIRY = (process.env.ACCESS_EXPIRY ??
  "1h") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRY = (process.env.REFRESH_EXPIRY ??
  "7d") as jwt.SignOptions["expiresIn"];

/** Define payload structure */
export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
}

/** Generate Access Token */
export const generateAccessToken = (payload: TokenPayload): string => {
  try {
    const options: SignOptions = { expiresIn: ACCESS_EXPIRY };
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    throw new Error(
      `Failed to generate access token: ${(error as Error).message}`
    );
  }
};

/** Generate Refresh Token */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRY };
  return jwt.sign(payload, JWT_SECRET, options);
};

/** Verify any JWT (returns payload or throws error) */
export const verifyToken = (token: string): TokenPayload & JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload & JwtPayload;
};

/** Decode JWT without verifying (⚠️ use only for non-secure inspection) */
export const decodeToken = (token: string): null | TokenPayload | string => {
  return jwt.decode(token) as TokenPayload | null;
};
