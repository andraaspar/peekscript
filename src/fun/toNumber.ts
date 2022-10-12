import JSBI from 'jsbi'
import { Rational } from '../class/RationalBigInt'
import type { Rational as RationalJsbi } from '../class/RationalJsbi'
import { TNumber } from '../model/TNumber'

export function toNumber(n: TNumber | RationalJsbi): number {
	switch (typeof n) {
		case 'number':
			return n
		case 'bigint':
			return Number(n)
		case 'object':
			if (n instanceof Rational) {
				return n.toNumber(20)
			} else if (n instanceof JSBI) {
				return JSBI.toNumber(n)
			}
		default:
			throw new Error(`[rh8aib] Could not convert ${typeof n} to number.`)
	}
}
