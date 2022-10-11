import JSBI from 'jsbi'
import { Rational } from '../class/Rational'
import { toNumber } from './toNumber'

test(`[rjlc7n]`, () => {
	expect(toNumber(3.14)).toBe(3.14)
})

test(`[rjlc8c]`, () => {
	expect(toNumber(1n)).toBe(1)
})

test(`[rjlc8q]`, () => {
	expect(toNumber(Rational.fromString('1/2'))).toBe(0.5)
})

test(`[rjlc98]`, () => {
	expect(toNumber(JSBI.BigInt(3))).toBe(3)
})

test(`[rjlcb7]`, () => {
	expect(() => toNumber('3' as any)).toThrow(/convert/i)
})
