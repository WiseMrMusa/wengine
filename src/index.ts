import { initServer } from "./server/index.js";
import { env } from "./shared/utils/env.js";
import { logger } from "./shared/utils/logger.js";
import "./tracer.js";

const main = async () => {
    if (env.ENGINE_MODE == 'server_only'){
        initServer();
    } else if (env.ENGINE_MODE == 'worker_only'){
        // TODO: init worker
    } else {
        initServer();
        // TODO: init worker
    }
}

main();


process.on("uncaughtException", (err) => {
    logger({
        message: "Uncaught Exception",
        service: "server",
        level: "error",
        error: err,
    })
})

process.on("unhandledRejection", (reason) => {
    logger({
        message: "Unhandled Rejection",
        service: "server",
        level: "error",
        error: reason,
    })
})


process.on("SIGINT", () => {
    gracefulShutdown("SIGINT")
})
process.on("SIGTERM", ()=> { gracefulShutdown("SIGTERM")})


const gracefulShutdown = async (signal: NodeJS.Signals) => {
    logger({
        level: "info",
        service: "server",
        message: `Received ${signal}, closing server...`,
    })
    process.exit(0);
}
    