import { Decimal } from '../class/Decimal'
import { Rational } from '../class/Rational'

export function toNumber(n: number | bigint | Decimal | Rational): number {
	switch (typeof n) {
		case 'number':
			return n
		case 'bigint':
			return Number(n)
		case 'object':
			if (n instanceof Decimal) {
				return n.toNumber()
			} else if (n instanceof Rational) {
				return n.toNumber(20)
			}
		default:
			throw new Error(`[rh8aib] Could not convert ${typeof n} to number.`)
	}
}
