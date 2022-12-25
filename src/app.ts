import * as dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import compression from "compression";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./infrastructures/errors/application-error";
import routes from "./routes/routes";
import logger from "./infrastructures/logger";
import { initTelemetry } from "./infrastructures/lib/tracer";

if (process.env.NODE_ENV !== "dev") {
  initTelemetry({
    service: process.env.APP_NAME || "app_name",
    traceExporterUrl: process.env.TRACE_EXPORTER_URL || "http://trace_url",
  });
}

const app = express();

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: "debug",
      message,
      consoleLoggerOptions: { label: "API" },
    });
  });

  next();
}

app.use(logResponseTime);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(
  (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      error: err.message,
    });
  }
);

export default app;
