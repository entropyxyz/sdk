export type base64string = string
export type hexString = string

export interface KeyPair {
  public: base64string;
  private: hexString;
}

export interface Account {
  keyShare: string;
  sigRrequestKeyPair
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