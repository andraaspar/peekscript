import JSBI from 'jsbi'
import { Rational } from '../class/Rational'
import { getType } from './getType'

test(`[rjlcf3]`, () => {
	expect(getType(undefined)).toBe('undefined')
})

test(`[rjlces]`, () => {
	expect(getType(null)).toBe('null')
})

test(`[rjlcg1]`, () => {
	expect(getType(false)).toBe('boolean')
})

test(`[rjlcg4]`, () => {
	expect(getType(0)).toBe('number')
})

test(`[rjlcdy]`, () => {
	expect(getType('')).toBe('string')
})

test(`[rjlcg8]`, () => {
	expect(getType(0n)).toBe('bigint')
})

test(`[rjlch0]`, () => {
	expect(getType({})).toBe('object')
})

test(`[rjlch2]`, () => {
	expect(getType(JSBI.BigInt(0))).toBe('jsbi')
})

test(`[rjlch2]`, () => {
	expect(getType(Rational.ZERO)).toBe('rational')
})
