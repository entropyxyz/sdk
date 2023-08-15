export type base64string = string
export type hexString = string

export interface KeyPair {
  public: base64string;
  private: hexString;
}

export interface Account {
  keyShare: string;
  sigRrequestKeyPair;
}


/// Information about a threshold server
export interface ServerInfo {
  tss_account: Uint8Array;
  x25519_public_key: Uint8Array;
  endpoint: string;
}

export interface UserTransactionRequest {
    /// 'eth', etc.
    arch: string,
    /// ETH: RLP encoded transaction request
    transaction_request: string,
    validator_ips: Uint8Array[],
    message: Message,
}

export interface ValidatorInfo {
    x25519_public_key: Uint8Array;
    ip_address: Uint8Array;
    tss_account: Uint8Array;
}

/// The message sent from pallets::propagation::post() to the signing-client.
export interface Message {
    sig_request: string;
    // the users public substrate signing key
    account: Uint8Array;
    validators_info: ValidatorInfo;
}
/*

return type for isRegistering
{
        is_registering: bool,
        constraint_account: string,
        is_swapping: bool,
        pub confirmations: []strings,
        pub constraints?: any,
    }
    */