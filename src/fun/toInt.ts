import { TNumber } from '../model/TNumber'
import { toNumber } from './toNumber'

export function toInt(n: TNumber) {
	n = toNumber(n)
	if (n !== Math.trunc(n)) {
		throw new Error(`[rh8az2] Expected integer, got: ${n}`)
	}
	return n
}
