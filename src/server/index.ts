import * as fs from "node:fs";
import * as path from "node:path";
import { env } from "../shared/utils/env";
import { logger } from "../shared/utils/logger";

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
        message: "Trust proxy enabled",
    })
   }
}
