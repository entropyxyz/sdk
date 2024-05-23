import * as deviceKeyProxy from './device-key-proxy'
import * as noop from './noop'

export const defaultAdapters = {
  deviceKeyProxy,
  noop,
}

export const defaultOrder = [deviceKeyProxy.type]
