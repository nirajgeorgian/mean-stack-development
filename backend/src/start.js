import express from "express";
import "express-async-errors";
import logger from "loglevel";
import bodePraser from "body-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnection from "./models";
import { getRoutes } from "./routes";

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error);
  } else {
    logger.error(error);
    res.status(500);
    res.json({
      message: error.message,

      // we only add stack property in production for error tracing
      ...(process.env.NODE_ENV === "production"
        ? null
        : { stack: error.stack }),
    });
  }
}

function setupCloseOnExit(server) {
  async function exitHandler(options = {}) {
    await server
      .close()
      .then(() => {
        logger.info("server successfully closed");
      })
      .catch((e) => {
        logger.warn("something went wrong in closing");
      });

    if (process.exit) {
      process.exit();
    }
  }

  // when app is closing
  process.on("exit", exitHandler);

  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catched "kill pid"
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

function startServer({ port = process.env.PORT } = {}) {
  const app = express();

  /**
   * all third party middleware's
   */
  app.use(bodePraser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  dbConnection();

  app.use("/api", getRoutes());

  app.use(errorMiddleware);

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`);
      const originalClose = server.close.bind(server);

      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

export { startServer };
