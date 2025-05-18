import type { KeyPairs } from "@prisma/client";
import { prisma } from "../client.js";


export const listKeyPairs = async (): Promise<KeyPairs[]> => {
    return prisma.keyPairs.findMany();
}