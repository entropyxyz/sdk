import { HexString } from '../../keys/types/json'
import { Signer } from '../../keys/types/internal'
import { u8aToHex } from '@polkadot/util'
import { AUX_DATA, PRESIGN_RESULT } from './types'
export interface UserConfig {
  ecdsaPublicKeys?: HexString[]
  sr25519PublicKeys?: HexString[]
  ed25519PublicKeys?: HexString[]
}

export interface DeviceKeyProxyProgramInterface {
  pointer: HexString
  userConfig: UserConfig
  auxilary_data: AuxData
}

export interface AuxData extends AUX_DATA {
  /// "ecdsa", "ed25519", "sr25519"
  public_key_type: HexString
  /// base64-encoded public key
  public_key: HexString
  /// base64-encoded signature
  signature: HexString
  /// The context for the signature only needed in sr25519 signature type FRANKIE LOOK THIS UP
  // seems to be 'substrate'
  context?: HexString
}

export const DEVICE_KEY_PROXY_PROGRAM_INTERFACE = {
  programPointer:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  programConfig: {
    ecdsaPublicKeys: [],
    sr25519PublicKeys: [],
    ed25519PublicKeys: [],
  },
  auxilary_data: [
    {
      publicKeyType: '',
      publicKey: '',
      signature: '',
      context: 'substrate',
    },
  ],
}

export const ADAPTER_PROGRAMS = [DEVICE_KEY_PROXY_PROGRAM_INTERFACE]

export interface PreSignResult extends PRESIGN_RESULT {
  sigRequestHash: HexString
  auxilary_data: [AuxData]
}

export async function preSign (
  deviceKey: Signer,
  message: unknown
): Promise<PreSignResult> {
  const stringMessage = JSON.stringify(message)
  const signedMessage = deviceKey.pair.sign(stringMessage)

  const sigRequestHash = u8aToHex(signedMessage)
  const publicKey = u8aToHex(deviceKey.pair.publicKey)

  const auxilary_data: [AuxData] = [
    {
      public_key_type: Buffer.from('sr25519').toString('base64'),
      public_key: publicKey,
      signature: sigRequestHash,
      // this needs to change before main net and needs to match core ideally it is `'entropy'`
      context: Buffer.from('substrate').toString('base64'),
    },
  ]

  return { sigRequestHash, auxilary_data }
}

export const type = 'deviceKeyProxy'
// THIS IS THE RETURNED SIG HASH -- PLS look into ED25519 ASK JESSE IF SUPPORTED
export const hash = 'keccak'
