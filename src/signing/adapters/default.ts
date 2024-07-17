import * as deviceKeyProxy from './device-key-proxy.js'
import * as noop from './noop.js'

export const defaultAdapters = {
  deviceKeyProxy,
  noop,
}

export const defaultOrder = [deviceKeyProxy.type]
