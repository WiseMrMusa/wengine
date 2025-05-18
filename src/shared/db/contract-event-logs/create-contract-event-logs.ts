import type { ContractEventLogs, Prisma } from "@prisma/client"
import type { PrismaTransaction } from "../../schemas/prisma.js"
import { getPrismaWithPostgresTx } from "../client.js"

export interface BulkInsertContractLogsParams {
    pgtx?: PrismaTransaction;
    logs: Prisma.ContractEventLogsCreateManyInput[];
}

export const bulkInsertContractLogs = async ({
    pgtx,
    logs
}: BulkInsertContractLogsParams): Promise<ContractEventLogs[]> => {
    const prisma = getPrismaWithPostgresTx(pgtx);
    return await prisma.contractEventLogs.createManyAndReturn({
        data: logs,
        skipDuplicates: true,
    })
}