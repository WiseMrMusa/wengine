import type { WalletCondition } from "./wallet-subscription-conditions.js";

export enum WebhooksEventType {
    QUEUED_TX = 'queued_transaction',
    SENT_TX = 'sent_transaction',
    MINED_TX = 'mined_transaction',
    ERRORED_TX = 'errored_transaction',
    CANCELLED_TX = 'cancelled_transaction',
    ALL_TX = 'all_transaction',
    BACKEND_WALLENT_BALANCE = 'backend_wallet_balance',
    AUTH = 'auth',
    CONTRACT_SUBSCRIPTION = 'contract_subscription',
    WALLET_SUBSCRIPTION = 'wallet_subscription' 
}

export type BackendWalletBalanceWebhookParams = {
    walletAddress: string;
    minimumBalance: string;
    currentBalance: string;
    chainId: number;
    message: string;
}

export interface WalletSubscriptionWebhookParams {
    subscriptionId: string;
    chainId: string;
    walletAddress: string;
    condition: WalletCondition;
    currentValue: string;   
}