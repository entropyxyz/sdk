import * as ethModule from './eth'
import { Adapter, OptAdapter } from './types'

export class Adapters {
  private forbidden: string[] = ['set', 'update', 'eth']
  private adapters: { [key: string]: Adapter | typeof ethModule } = {
    eth: ethModule
  }

  constructor({ customAdapters }: {customAdapters: Adapter[] }) {
    customAdapters.forEach((adapter: Adapter) => {
      this.set(adapter)
    })
  }

  getEth(): typeof ethModule {
    return this.adapters.eth as typeof ethModule
  }

  // A getter for retrieving an adapter
  getAdapter(type: string): Adapter | typeof ethModule | undefined {
    return this.adapters[type]
  }

  set(adapter: Adapter): void {
    if (this.forbidden.includes(adapter.type)) {
      throw new Error(`${adapter.type} type name forbidden please choose a different type name`)
    }
    this.adapters[adapter.type] = adapter
  }

  update(adapter: OptAdapter): void {
    const existingAdapter = this.adapters[adapter.type]
    if (!existingAdapter) {
      throw new Error(`Adapter of type ${adapter.type} doesn't exist.`)
    }
    const updated = { ...existingAdapter, ...adapter }
    this.set(updated as Adapter) // casting as Adapter because types might clash here.
  }
}
