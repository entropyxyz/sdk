import { Substrate } from "./substrate/substrate"
import { Signer } from "../types/substrate";

export class Extrinsic {
  substrate: Substrate;
  signer: Signer;

  constructor ({ substrate, signer }) {
    this.substrate = substrate
    this.signer = signer
  }
}