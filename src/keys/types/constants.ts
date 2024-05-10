/**
 * This describes the kinds of accounts that can be passed to the entropy SDK.
 *
 * @enum {string}
 */

export const enum EntropyAccountType {
  /**
  * Describes a kind of account that deploys programs and has either only the mnemonic
  * or the deploy key. This way, we know we can lazily load registration records.
  */
  PROGRAM_DEV_ACCOUNT = 'PROGRAM_DEV_ACCOUNT',

  /**
  * Describes an account type that has a "root key". This means it registered the program set
  * and likely has full control to change the programs. It may still be able to request
  * signatures, so don't lazy-load signing.
  */
  REGISTERING_ACCOUNT = 'REGISTERING_ACCOUNT',

  /**
   * Represents an account type that most likely does not have access to modify programs.
   * It may be able to and long-term lazily load programs, but not now.
   * The device key should be passed to signing and used as the "signatureRequestAccount".
   * It should also be used to encrypt the message.
   */
  CONSUMER_ACCOUNT = 'CONSUMER_ACCOUNT',

  /**
   * Represents an account type that most likely does not have access to modify programs.
   * It may be able to and long-term lazily load programs, but not now.
   * The device key should be passed to signing and used as the "signatureRequestAccount".
   * It should also be used to encrypt the message.
   */
  MIXED_ACCOUNT = 'MIXED_ACCOUNT',
}

export enum ChildKey {
  REGISTRATION = 'registration',
  PROGRAM_DEV = 'programDev',
  DEVICE_KEY = 'deviceKey',
}


export enum ChildKeyBasePaths {
  REGISTRATION = '//entropy//registration///',
  PROGRAM_DEV = '//entropy//program-dev',
  DEVICE_KEY = '//entropy//device-key///',
}
