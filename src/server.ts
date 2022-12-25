/* eslint-disable import/first */
import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: ".env.default" });
}

import util from "util";
import app from "./app";
import logger from "./infrastructures/logger";

const PORT = process.env.PORT || 3000;

let debugCallback;
if (process.env.NODE_ENV === "development") {
  debugCallback = (
    collectionName: string,
    method: string,
    query: any,
    doc: string
  ): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, {
      colors: true,
      depth: null,
    })})`;
    logger.log({
      level: "verbose",
      message,
      consoleLoggerOptions: { label: "MONGO" },
    });
  };
}

// Any database connection

const serve = () =>
  app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);
  });

serve();

process.on("SIGINT", () => {
  console.log("\n"); /* eslint-disable-line */
  logger.info("Gracefully shutting down");
  logger.info("Closing connection");
  // any connection to close for graceful shutdown. For example, database connection
});
