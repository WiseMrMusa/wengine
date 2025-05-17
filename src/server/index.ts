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
    
}
