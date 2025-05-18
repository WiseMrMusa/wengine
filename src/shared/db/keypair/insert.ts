import type { KeyPairs } from "@prisma/client";
import { createHash } from "node:crypto";
import type { KeyPairAlgorithm } from "../../schemas/keypair.js";
import { prisma } from "../client.js";

export const insertKeyPair = async ({
    publicKey,
    algorithm,
    label
}: {
    publicKey: string;
    algorithm: KeyPairAlgorithm;
    label?: string; 
}): Promise<KeyPairs> => {
    const hash = createHash("sha256").update(publicKey).digest("hex");
    return prisma.keyPairs.create({
        data: {
            hash,
            publicKey,
            algorithm,
            label,
        }
    })
}