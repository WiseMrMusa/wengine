import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from 'zod';

const path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path });

const boolEnvSchema = (defaultBool: boolean) => 
    z.string()
    .default(defaultBool ? 'true' : 'false')
    .refine((s) => s === 'true' || s === 'false', "must be 'true' or 'false'")
    .transform((value) => value === 'true');

export const UrlSchema = z.string().refine((url) => {
    return url.startsWith('http://') || url.startsWith('https://'); }, { message: "Invalid URL"});

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['production', 'development', 'test', 'local']).default('development'),
        LOG_LEVEL: z.enum(['fatal', 'error', "warn", "info", "debug", "trace"]).default('info'),
        LOG_SERVICES: z
            .string()
            .default('server,worker,cache,websocket')
            .transform((s) => 
                z
                    .array(z.enum(["server", "worker", "cache", "websocket"]))
                    .parse(s.split(","))
            ),
        ENGINE_VERSION: z.string().optional(),
        ENGINE_TIER: z.string().optional(),
        THIRDWEB_API_SECRET_KEY: z.string().min(1),
        ADMIN_WALLET_ADDRESS: z.string().min(1),
        ENCRYPTION_PASSWORD: z.string().min(1),
        POSTGRES_CONNECTION_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable'),
        PORT: z.coerce.number().default(3005),
        HOST: z.string().default("0.0.0.0"),
        ENABLE_HTTPS: boolEnvSchema(false),
        HTTPS_PASSPHRASE: z.string().default("thirdweb-engine"),
        TRUST_PROXY: boolEnvSchema(false),
        CLIENT_ANALYTICS_URL: z.union([UrlSchema, z.literal("")]).default("https://c.thirdweb.com/event"),
        SDK_BATCH_TIME_LIMIT: z.coerce.number().default(10),
        SDK_BATCH_SIZE_LIMIT: z.coerce.number().default(100),
        REDIS_URL: z.string(),
        SEND_TRANSACTION_QUEUE_CONCURRENCY: z.coerce.number().default(200),
        CONFIRM_TRANSACTION_QUEUE_CONCURRENCY: z.coerce.number().default(200),
        ENGINE_MODE: z.enum(['default', 'sandbox', 'server_only', 'worker_only']).default('default'),
        GLOBAL_RATE_LIMIT_PER_MIN: z.coerce.number().default(400 * 60),
        ACCOUNT_CACHE_SIZE: z.coerce.number().default(2048),
        DD_TRACER_ACTIVATER: boolEnvSchema(false),

        METRICS_PORT: z.coerce.number().default(4001),
        METRICS_ENABLED: boolEnvSchema(false),

        /**
         *  Limits
         */
        // Sets the max amount of memory Redis can use.
        // "0" means use all available memory.
        REDIS_MAXMEMORY: z.string().default("0"),
        // Sets the number of recent transactions to store. Older transactions are pruned periodically
        TRANSACTION_HISTORY_COUNT: z.coerce.number().default(100_000),
        QUEUE_COMPLETE_HISTORY_COUNT: z.coerce.number().default(2_000),
        QUEUE_FAIL_HISTORY_COUNT: z.coerce.number().default(10_000),
        NONCE_MAP_COUNT: z.coerce.number().default(10_000),
        CONTRACT_SUBSCRIPTION_CRON_SCHEDULE_OVERRIDE: z.string().optional(),
       
        ENABLE_KEYPAIR_AUTH: boolEnvSchema(false),
        ENABLE_CUSTOM_HMAC_AUTH: boolEnvSchema(false),
        CUSTOM_HMAC_AUTH_CLIENT_ID: z.string().optional(),
        CUSTOM_HMAC_AUTH_CLIENT_SECRET: z.string().optional(),
        
    }, clientPrefix: 'NEVER_USED',
    client: {},
    isServer: true,
    runtimeEnvStrict: {
        NODE_ENV: process.env.NODE_ENV,
        LOG_LEVEL: process.env.LOG_LEVEL,
        LOG_SERVICES: process.env.LOG_SERVICES,
        ENGINE_VERSION: process.env.ENGINE_VERSION,
        ENGINE_TIER: process.env.ENGINE_TIER,
        THIRDWEB_API_SECRET_KEY: process.env.THIRDWEB_API_SECRET_KEY,
        ADMIN_WALLET_ADDRESS: process.env.ADMIN_WALLET_ADDRESS,
        ENCRYPTION_PASSWORD: process.env.ENCRYPTION_PASSWORD,
        POSTGRES_CONNECTION_URL: process.env.POSTGRES_CONNECTION_URL,
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        ENABLE_HTTPS: process.env.ENABLE_HTTPS,
        HTTPS_PASSPHRASE: process.env.HTTPS_PASSPHRASE,
        TRUST_PROXY: process.env.TRUST_PROXY,
        CLIENT_ANALYTICS_URL: process.env.CLIENT_ANALYTICS_URL,
        SDK_BATCH_TIME_LIMIT: process.env.SDK_BATCH_TIME_LIMIT,
        SDK_BATCH_SIZE_LIMIT: process.env.SDK_BATCH_SIZE_LIMIT,
        REDIS_URL: process.env.REDIS_URL,
        SEND_TRANSACTION_QUEUE_CONCURRENCY: process.env.SEND_TRANSACTION_QUEUE_CONCURRENCY,
        CONFIRM_TRANSACTION_QUEUE_CONCURRENCY: process.env.CONFIRM_TRANSACTION_QUEUE_CONCURRENCY,
        ENGINE_MODE: process.env.ENGINE_MODE,
        GLOBAL_RATE_LIMIT_PER_MIN: process.env.GLOBAL_RATE_LIMIT_PER_MIN,
        ACCOUNT_CACHE_SIZE: process.env.ACCOUNT_CACHE_SIZE,
        DD_TRACER_ACTIVATER: process.env.DD_TRACER_ACTIVATER,
        METRICS_PORT: process.env.METRICS_PORT,
        METRICS_ENABLED: process.env.METRICS_ENABLED,
        REDIS_MAXMEMORY: process.env.REDIS_MAXMEMORY,
        TRANSACTION_HISTORY_COUNT: process.env.TRANSACTION_HISTORY_COUNT,
        QUEUE_COMPLETE_HISTORY_COUNT: process.env.QUEUE_COMPLETE_HISTORY_COUNT,
        QUEUE_FAIL_HISTORY_COUNT: process.env.QUEUE_FAIL_HISTORY_COUNT,
        NONCE_MAP_COUNT: process.env.NONCE_MAP_COUNT,
        CONTRACT_SUBSCRIPTION_CRON_SCHEDULE_OVERRIDE: process.env.CONTRACT_SUBSCRIPTION_CRON_SCHEDULE_OVERRIDE,
        ENABLE_KEYPAIR_AUTH: process.env.ENABLE_KEYPAIR_AUTH,
        ENABLE_CUSTOM_HMAC_AUTH: process.env.ENABLE_CUSTOM_HMAC_AUTH,
        CUSTOM_HMAC_AUTH_CLIENT_ID: process.env.CUSTOM_HMAC_AUTH_CLIENT_ID,
        CUSTOM_HMAC_AUTH_CLIENT_SECRET: process.env.CUSTOM_HMAC_AUTH_CLIENT_SECRET,
    },
    onValidationError: (issues: any) => {
        console.error(
            "Invalid environment variables:",
            new z.ZodError(issues as z.ZodIssue[]).flatten()
        );
        throw new Error("Invalid environment variables");
    },
});