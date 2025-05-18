import type { KeyPairs } from "@prisma/client";
import { prisma } from "../client.js";


export const deleteKeyPair = async ({
    hash
}: {
    hash: string;
}): Promise<KeyPairs> => {
    return prisma.keyPairs.delete({
        where: {
            hash,
        }
    })
}