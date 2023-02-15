// This associates an architecture with a transaction request
export enum Arch {
    Evm = 'evm',
    // not supported yet
    Btc = 'btc',
}

// TransactionRequest is a serialized transaction request for EVM and BTC
export interface ITransactionRequest {
    arch: Arch,
    transaction_request: string
}