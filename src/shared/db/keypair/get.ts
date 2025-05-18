import type { KeyPairs } from "@prisma/client";
import { createHash } from "crypto";
import { prisma } from "../client.js";


export const getKeyPairByHash = async (hash: string): Promise<KeyPairs | null> => {
    return prisma.keyPairs.findUnique({
        where: {
            hash,
        }
    })
}

export const getKeyPairByPublicKey = async (publicKey: string): Promise<KeyPairs | null> => {
    const hash = createHash("sha256").update(publicKey).digest("hex");
    return getKeyPairByHash(hash);
}