// This associates an architecture with a transaction request
export enum Arch {
    Evm = 'evm',
    // not supported yet
    Btc = 'btc',
}

// ITransactionRequest is what the `/user/tx` endpoint expects to receive
export interface ITransactionRequest {
    arch: Arch,
    transaction_request: string
}