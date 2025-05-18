import base64 from 'base-64'
import { z } from 'zod'
import { prisma } from '../client.js'

interface GetContractTransactionReceiptsParams {
    chainId: number;
    contractAddress: string;
    fromBlock?: number;
    toBlock?: number;
}

export const getContractTransactionReceipts = async ({
    chainId,
    contractAddress,
    fromBlock,
    toBlock
}: GetContractTransactionReceiptsParams) => {
    const whereClause = {
        chainId: chainId.toString(),
        contractAddress,
        blockNumber: {
            gte: fromBlock,
            ...(toBlock ? { lte: toBlock } : {})
        }
    }
    return await prisma.contractTransactionReceipts.findMany({
        where: whereClause,
    })
}

interface GetContractTransactionReceiptsByBlockTimestampParams {
    fromBlockTimestamp: number;
    toBlockTimestamp?: number;
    contractAddresses?: string[];
}

export const getContractTransactionReceiptsByBlockTimestamp = async ({
    fromBlockTimestamp,
    toBlockTimestamp,
    contractAddresses
}: GetContractTransactionReceiptsByBlockTimestampParams) => {
    const fromBlockDate = new Date(fromBlockTimestamp);
    const toBlockDate = toBlockTimestamp ? new Date(toBlockTimestamp) : undefined;
    const whereClause = {
        timestamp: {
            gte: fromBlockDate,
            ...(toBlockDate ? { lte: toBlockDate } : {})
        }, 
        ...(contractAddresses  
            ? { contractAddress: { in: contractAddresses } } 
            : {}),
    }
    return await prisma.contractTransactionReceipts.findMany({
        where: whereClause,
    })
}

interface GetContractTransactionReceiptsByCursorParams {
    cursor?: string;
    limit?: number;
    contractAddresses?: string[];
    maxCreatedAt?: Date;
}

const CursorSchema = z.object({
    createdAt: z.number().transform((s) => new Date(s)),
    chainId: z.number(),
    blockNumber: z.number(),
    transactionIndex: z.number(),
})

export const getContractTransactionReceiptsByCursor = async ({
    cursor,
    limit = 100,
    contractAddresses,
    maxCreatedAt
}: GetContractTransactionReceiptsByCursorParams) => {
    let cursorObj: z.infer<typeof CursorSchema> | null = null;
    if (cursor) {
        const decodedCursor = base64.decode(cursor);
        const parsedCursor = decodedCursor.split("-").map((val: string) => Number.parseInt(val));
        const [createdAt, chainId, blockNumber, transactionIndex] = parsedCursor;
        const validationResult = CursorSchema.safeParse({
            createdAt,
            chainId,
            blockNumber,
            transactionIndex,
        });
        if (!validationResult.success) {
            throw new Error("Invalid cursor format");
        }
        cursorObj = validationResult.data;
    }
const whereClause = {
    AND: [
        ...(contractAddresses 
            ? [{ contractAddress: { in: contractAddresses } }] 
            : []),
        ...(cursorObj 
            ? [
                {
                    OR: [
                        { createdAt: { gt: cursorObj.createdAt } },
                        {
                            createdAt: { equals: cursorObj.createdAt },
                            chainId: { gt: cursorObj.chainId.toString() }
                        },
                        {
                            createdAt: { equals: cursorObj.createdAt },
                            chainId: { equals: cursorObj.chainId.toString() },
                            blockNumber: { gt: cursorObj.blockNumber }
                        },
                        {
                            createdAt: { equals: cursorObj.createdAt },
                            chainId: { equals: cursorObj.chainId.toString() },
                            blockNumber: { equals: cursorObj.blockNumber },
                            transactionIndex: { gt: cursorObj.transactionIndex }
                        }
                    ]
                }
            ] 
            : []),
        ...(maxCreatedAt 
            ? [{ createdAt: { lte: maxCreatedAt } }] 
            : [])
    ]
};
    const transactionReceipts = await prisma.contractTransactionReceipts.findMany({
        where: whereClause,
        take: limit,
        orderBy: [
            { createdAt: "asc" },
            { chainId: "asc" },
            { blockNumber: "asc" },
            { transactionIndex: "asc" },
        ]
    });

    let newCursor = cursor;
    if (transactionReceipts.length > 0) {
        const lastReceipt = transactionReceipts[transactionReceipts.length - 1];
        const cursorString = `${lastReceipt.createdAt.getTime()}-${lastReceipt.chainId}-${lastReceipt.blockNumber}-${lastReceipt.transactionIndex}`;
        newCursor = base64.encode(cursorString);
    }
    return {
        cursor: newCursor,
        transactionReceipts,
    }
}
    