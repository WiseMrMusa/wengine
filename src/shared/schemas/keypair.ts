import type { KeyPairs } from "@prisma/client";
import { type Static , Type } from "@sinclair/typebox";


const _supportedAlgorithms = [
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512"
] as const;

export type KeyPairAlgorithm = (typeof _supportedAlgorithms)[number];

export const KeyPairAlgorithmSchema = Type.Union(
    _supportedAlgorithms.map((algorithm) => Type.Literal(algorithm))
);

export const KeyPairSchema = Type.Object({
    hash: Type.String({
        description: "A unique identifier for the key pair",
        
    }),
    publicKey: Type.String({
        description: "The public key of the key pair",
        
    }),
    algorithm: Type.String({
        description: "The algorithm used to generate the key pair",
    }),
    label: Type.Optional(Type.String({
        description: "A label for the key pair",
        
    })),
    createdAt: Type.Unsafe<Date>({
        type: "string",
        format: "date",
        description: "The date the key pair was created",
        
    }),
    updatedAt: Type.Unsafe<Date>({
        type: "string",
        format: "date",
        description: "The date the key pair was last updated",
        
    })
});

export const toKeyPairSchema = (
    keyPair: KeyPairs
): Static<typeof KeyPairSchema> => {
    return {
        hash: keyPair.hash,
        publicKey: keyPair.publicKey,
        algorithm: keyPair.algorithm,
        label: keyPair.label ?? undefined,
        createdAt: keyPair.createdAt,
        updatedAt: keyPair.updatedAt
    }
}