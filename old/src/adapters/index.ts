
import * as eth from './eth'
import { Adapter, OptAdapter } from './types'


export class Adapters {
  constructor({ customAdapters }: {customAdapters: Adapter[]; }) {
    this.eth = eth
    const forbidden = ['set', 'update']
    customAdapters.forEach((adapter: Adapter) => {
      this.set(adapter)
    })
  }

  set (adapter: Adapter): void {
    if (forbidden.includes(adapter.type)) throw new Error(`${adapter.type} type name forbidden please choose a different type name`)
    this[adapter.type] = adapter
  }

  update (adapter: OptAdapter): void {
    const updated = { ...this[adapter.type], ...adapter }
    this.set(updated)
  }
}