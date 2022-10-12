import type { Rational as RationalJsbi } from '../class/RationalJsbi'
import { TNumber } from '../model/TNumber'
import { toNumber } from './toNumber'

export function toInt(n: TNumber | RationalJsbi) {
	n = toNumber(n)
	if (n !== Math.trunc(n)) {
		throw new Error(`[rh8az2] Expected integer, got: ${n}`)
	}
	return n
}
