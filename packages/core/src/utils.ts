import { readFileSync } from "node:fs";


export const readKey = (path: string) =>  {
	const buffer = readFileSync(path);
	const result = new Uint8Array(buffer.byteLength);
	buffer.copy(result);
	buffer.fill(0);
	return result;
  }