import { prisma } from "../client.js";
interface DeleteContractTransactionReceiptsParams {
    chainId: number;
    contractAddress: string;
}

export const deleteContractTransactionReceipts = async ({
    chainId,
    contractAddress
}: DeleteContractTransactionReceiptsParams) => {
    await prisma.contractTransactionReceipts.deleteMany({
        where: {
            chainId: chainId.toString(),
            contractAddress
        }
    });
}