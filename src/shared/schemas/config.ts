import type { Configuration } from '@prisma/client';
import type { Chain } from 'thirdweb';
import type { WalletType } from './wallet.js';

export type AwsWalletConfiguration = {
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    defaultAwsRegion: string;
}

export type GcpWalletConfiguration = {
    gcpAplicationCredentialEmail: string;
    gcpAplicationCredentialPrivateKey: string;

    defaultGcpKmsLocationId: string;
    defaultGcpKmsKeyRingId: string;
    defaultGcpApplicationProjectId: string;
}

export type CircleWalletConfiguration = {
    apiKey: string;
}

export interface ParsedConfig 
    extends Omit<
        Configuration, 
        | "awsAccessKeyId"
        | "awsSecretAccessKey"
        | "awsRegion"
        | "gcpApplicationProjectId"
        | "gcpKmsLocationId"
        | "gcpKmsKeyRingId"
        | "gcpAplicationCredentialEmail"
        | "gcpAplicationCredentialPrivateKey"
        | "contractSubscriptionsRetryDelaySeconds"
        | "mtlsCertificateEncrypted"
        | "mtlsPrivateKeyEncrypted"
        | "walletProviderConfigs"
    > {
        walletConfiguration: {
            aws: AwsWalletConfiguration | null;
            gcp: GcpWalletConfiguration | null;
            circle: CircleWalletConfiguration | null;
            legacyWalletType_removeInNextBreakingChange: WalletType;
        };
        contractSubscriptionsRetryDelaySeconds: number;
        chainOverridesParsed: Chain[];
        mtlsCertificate: string | null;
        mtlsPrivateKey: string | null;
}