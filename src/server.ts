import {config} from "./config/envConfig";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import compression from "compression";

import cookiesParser from "cookie-parser";
import session from "express-session";
import addFormats from "ajv-formats";
import morgan from "morgan";
import helmet from "helmet";
import YAML from "yamljs";
import cors from "cors";
import Ajv from "ajv";

import {
  globalErrorHandler,
  globalResponseHandler,
  verifyToken,
} from "@middlewares";
import { initTelemetry } from "./telemetry/opentelemetry";
import { authRoutes, userRoutes } from "@routes";
import { customError } from "@utils";
import { passport } from "@config";
import logger from "@logger";

initTelemetry();

const app: Application = express();
const ajv = new Ajv();
addFormats(ajv);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (config.nodeEnv !== "production") {
  app.use(morgan("dev"));
}
// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, try later",
  })
);

// Routes
app.get("/health", (req, res, next) => {
  try {
    globalResponseHandler.sendSuccess(res, req, null, "Service is healthy");
  } catch {
    const error = new customError("Service is unhealthy", 503);
    error.statusCode = 503;
    next(error);
  }
});

// Auth route
app.use("/auth", authRoutes);

// user route
app.use("/api/v1/users", verifyToken, userRoutes);

// common route not found handler
app.use((req, res, next) => {
  const error = new customError("Route not found", 404);
  error.statusCode = 404;
  next(error);
});

// Swagger
const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(globalErrorHandler);

try {
  app.listen(Number(config.port), "0.0.0.0", () => {
    logger.info(`Server running on port ${config.port}`);
  });
} catch (err) {
  logger.error("Fatal error: Server stop", err);
  process.exit(1);
}
