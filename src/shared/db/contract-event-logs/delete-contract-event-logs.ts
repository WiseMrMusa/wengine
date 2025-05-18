import { prisma } from "../client.js"

interface DeleteContractLogsParams {
    chainId: number;
    contractAddress: string;
}

export const deleteContractLogs = async ({
    chainId, 
    contractAddress
}: DeleteContractLogsParams) => {
    return await prisma.contractEventLogs.deleteMany({
        where: {
            chainId: chainId.toString(),
            contractAddress
        }
    })
}