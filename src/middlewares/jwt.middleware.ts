import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { globalResponseHandler } from "./globalResponseHandler.middleware";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.log("FATAL ERROR: JWT_SECRET is not defined.");
}

import { RequestHandler } from "express";

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.redirect("/auth/google");

    if (!JWT_SECRET) {
      return globalResponseHandler.sendSuccess(
        res,
        req,
        null,
        "JWT secret is not defined on the server.",
        500
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    if (typeof err === "object" && (err as any).name === "TokenExpiredError") {
      res.clearCookie("auth_token");
      return globalResponseHandler.sendSuccess(
        res,
        req,
        null,
        "Token ExpiredError",
        401
      );
    }
    return globalResponseHandler.sendSuccess(
      res,
      req,
      null,
      "Invalid or expired token",
      401
    );
  }
};
