import { PrismaClient } from "@prisma/client";
import pg, { type Knex } from "knex";
import type { PrismaTransaction } from "../schemas/prisma.js"
import { env } from "../utils/env.js";

export const prisma = new PrismaClient({
    log: ['info'],
})

/**
 * Returns a prisma client instance with the given Postgres transaction,
 * or the globally shared client instance if no transaction is provided.
 *
 * This is used to ensure that database operations are executed within
 * the same transaction, when a transaction is provided.
 *
 * @param pgtx The Postgres transaction to use.
 */
export const getPrismaWithPostgresTx = (pgtx?: PrismaTransaction) => {
   return pgtx || prisma 
}

export const knex = pg({
    client: 'pg',
    connection: {
        connectionString: env.POSTGRES_CONNECTION_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
    acquireConnectionTimeout: 30_000,
}) as Knex.Config;

export const isDatabaseReachable = async () => {
    try {
        await prisma.walletDetails.findFirst();
        return true;
    } catch (error) {
        return false;
    }
}