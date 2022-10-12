import JSBI from 'jsbi'
import { Rational } from '../class/RationalBigInt'
import { TAssertType } from '../model/TAssertType'

// export function getType(it: undefined): 'undefined'
// export function getType(it: boolean): 'boolean'
// export function getType(it: string): 'string'
// export function getType(it: bigint): 'bigint'
// export function getType(it: number): 'number'
// export function getType(it: symbol): 'symbol'
// export function getType(it: object): 'object'
// export function getType(it: Function): 'function'
// export function getType(it: Rational): 'rational'
// export function getType(it: JSBI): 'jsbi'
// export function getType(it: null): 'null'
export function getType(it: unknown): TAssertType {
	const t = typeof it
	if (t === 'object') {
		if (it === null) return 'null'
		if (it instanceof Rational) return 'rational'
		if (it instanceof JSBI) return 'jsbi'
	}
	return t
}
