import { Substrate } from "../../substrate/src"
import { ThresholdServer } from "../../threshold-server/src"
import { Crypto } from "../../crypto/src"


export default class Entropy {
	crypto: Crypto
	substrate: Substrate
	thresholdServer: ThresholdServer

	constructor(crypto: Crypto, substrate: Substrate, thresoldServer: ThresholdServer) {
		this.crypto = crypto
		this.substrate = substrate
		this.thresholdServer = thresoldServer
	}

	static async setup(url: String, seed: string, endpoint?: string): Promise<Entropy> {
		const crypto = new Crypto()
		const substrate = await Substrate.setup(seed, endpoint)
		const thresholdServer = new ThresholdServer(url)

		return new Entropy(crypto, substrate, thresholdServer)
	}
}