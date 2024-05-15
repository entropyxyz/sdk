/**
 * This describes the kinds of accounts that can be passed
 * to the ENTROPY class
 * PROGRAM_DEV_ACCOUNT:
 * Describes a user that deploys programs and has either only the mnemonic
 * or the deploy key so that we can lazily load registration records
 * ADMIN_ACCOUNT:
 * Describes an account type that has a "root key" this means
 * it registered the program set and possibly has full control to change
 * the programs it may still be able to request signatures so dont lazy load signing
 * CONSUMER_ACCOOUNT:
 * repersents an account type that most likely does not have access to modify programs
 * it may be able to and long term lazly load programs but not now
 * the device key should be passed to signing and used as the "signatureRequestAccount"
 * it should also be used to encrypt the message
 */

export const enum EntropyAccountType {
  PROGRAM_DEV_ACCOUNT = 'PROGRAM_DEV_ACCOUNT',
  ADMIN_ACCOUNT = 'ADMIN_ACCOUNT',
  CONSUMER_ACCOUNT = 'CONSUMER_ACCOUNT',
  // an unknown account type. generate keys on the fly :grimacing:
  MIXED_ACCOUNT = 'MIXED_ACCOUNT',
}

/**
 * Enumeration representing the different accounts keys used in Entropy.
 */

export enum ChildKey {
  REGISTRATION = 'registration',
  PROGRAM_DEV = 'programDev',
  DEVICE_KEY = 'deviceKey',
}

/**
 * Enumeration representing the base paths for different accounts keys used in Entropy.
 */

export enum ChildKeyBasePaths {
  registration = '//entropy//registration//',
  programDev = '//entropy//program-dev',
  deviceKey = '//entropy//device-key//',
}
