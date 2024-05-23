import { HexString } from '../../keys/types/json'
import { Signer } from '../../keys/types/internal'
import { AUX_DATA } from './types'
import { toHex } from '../../utils'
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

export interface PreSignResult {
  sigRequestHash: HexString
  auxiliaryData: AuxData[]
}

export async function preSign (
  deviceKey: Signer,
  message: unknown
): Promise<PreSignResult> {
  const stringMessage = JSON.stringify(message)
  const signedMessage = deviceKey.pair.sign(stringMessage)
  const sigRequestHash = toHex(stringMessage)

  const convertedSig = btoa(String.fromCharCode.apply(null, signedMessage))
  // Base64 encoded string
  const publicKey = btoa(
    String.fromCharCode.apply(null, deviceKey.pair.publicKey)
  )

  const auxiliaryData: [AuxData] = [
    {
      public_key_type: 'sr25519',
      public_key: publicKey,
      signature: convertedSig,
      // this needs to change before main net and needs to match core ideally it is `'entropy'`
      context: 'substrate',
    },
  ]

  return { sigRequestHash, auxiliaryData }
}

export const type = 'deviceKeyProxy'
// THIS IS THE RETURNED SIG HASH -- PLS look into ED25519 ASK JESSE IF SUPPORTED
export const hash = 'sha3'
