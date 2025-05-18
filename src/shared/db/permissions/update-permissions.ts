import { prisma } from "../client.js";

interface UpdatePermissionsParams {
    walletAddress: string;
    permissions: string;
    label?: string;
}

export const updatePermissions = async ({
    walletAddress,
    permissions,
    label
}: UpdatePermissionsParams) => {
    return prisma.permissions.upsert({
        where: {
            walletAddress: walletAddress.toLowerCase(),
        },
        create: {
            walletAddress: walletAddress.toLowerCase(),
            permissions,
            label,
        },
        update: {
            permissions,
            label,
        }
    });
}