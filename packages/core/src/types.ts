

/**
 * Format of the signing request that gets sent to the server during a signature request.
 * @date 11/17/2022 - 12:01:31 AM
 *
 * @export
 * @typedef {SigningRequest}
 * @template T - The type of the transaction request (eg. EvmTransactionRequest, BtcTransactionRequest, etc.)
 */
export type SigningRequest<T> = {
    architecture: Architecture,
    request: T,
};

export interface Architecture {
    transactionRequest: string,
}

export type EVM = {
    architecture: 'EVM',
    transactionRequest: {
        from: string,
        to: string,
        value: string,
        data: string,
        gasLimit: string,
        gasPrice: string,
        nonce: string,
        chainId: string,
    },
}