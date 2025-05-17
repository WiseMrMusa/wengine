import * as fs from "node:fs";
import * as path from "node:path";
import { env } from '../shared/utils/env.js';
import { logger } from '../shared/utils/logger.js';
import fastify, {type FastifyInstance} from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// The server connection timeout in milliseconds
const SERVER_CONNECTION_TIMEOUT = 60_000;

const __dirname = new URL(".", import.meta.url).pathname;

interface HttpsObject {
    https: {
        key: Buffer;
        cert: Buffer;
        passphrase?: string;
    }
}

export const initServer = async () => {
    // Enable the server to run on https://localhost:PORT, if ENABLE_HTTPS is provided
   let httpsObject: HttpsObject | undefined = undefined;
   if (env.ENABLE_HTTPS){
    httpsObject = {
        https: {
            key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")),
            passphrase: env.HTTPS_PASSPHRASE,
        }
    }
   } 

   const trustProxy = env.TRUST_PROXY || !!env.ENGINE_TIER;
   if (trustProxy) {
    logger({
        service: "server",
        level: "info",
        message: "Server is enabled with trustProxy",
    })
    const server: FastifyInstance = fastify({
        maxParamLength: 200,
        connectionTimeout: SERVER_CONNECTION_TIMEOUT,
        disableRequestLogging: true,
        trustProxy,
        ...(env.ENABLE_HTTPS ? httpsObject : {}),
    }).withTypeProvider<TypeBoxTypeProvider>();

    // Configure middleware

    // Register routes

    await server.ready();

   server.listen(
    {
        host: env.HOST,
        port: env.PORT,
    }, 
    (err) => {
        if (err) {
            logger({
                service: "server",
                level: "fatal",
                message: "Failed to start server",
                error: err,
            })
            process.exit(1);
        }
        logger({
            service: "server",
            level: "info",
            message: `Server listening on http://${env.HOST}:${env.PORT}`,
        })
    }
   ) 

   const url = `${env.ENABLE_HTTPS ? "https" : "http"}://${env.HOST}:${env.PORT}`;
   logger({
    service: "server",
    level: "info",
    message: `Server started at ${url}`,
   })
    }
}
