import { Router, Request, Response } from "express";

import { getUsers } from "@controllers";
import { RequestHandler } from "express";
import { passport } from "@config";
import { generateAccessToken } from "@/services";
import { globalResponseHandler } from "@/middlewares";
import { createUser } from "@/utils/user.utils";
import logger from "@/logger";
import { splitFullName } from "@/utils";

export const authRoutes = Router();

authRoutes.get("/", getUsers as unknown as RequestHandler);

authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback from Google
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const { firstName, lastName } = splitFullName(user?.displayName ?? "");

      // Step 1: Generate JWT (your own app token)
      const token = generateAccessToken({
        userId: user?.id,
        email: user?.emails[0]?.value,
      });

      await createUser({
        name: user?.displayName,
        email: user?.emails[0]?.value,
        firstName,
        lastName,
        avatarUrl: user?.photos[0]?.value,
        // userId: user?.id,
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.redirect("http://localhost:4000/");
    } catch (error) {
      logger.error("Error in Google callback:", error);
    }
  }
);

authRoutes.get("/success", (req: Request, res: Response) => {
  globalResponseHandler.sendSuccess(
    res,
    req,
    null,
    `✅ Logged in as ${  (req.user as any)?.displayName}`
  );
});

authRoutes.get("/failure", (req: Request, res: Response) => {
  globalResponseHandler.sendSuccess(res, req, null, "❌ Login failed");
});

authRoutes.get("/logout", (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
