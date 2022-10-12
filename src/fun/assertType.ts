import JSBI from 'jsbi'
import { ILocation } from '../ast/ILocation'
import { TAssertType } from '../model/TAssertType'
import { assertErrorText } from './assertErrorText'

/* prettier-ignore */ export function assertType(a: unknown, b: 'string', c?: ILocation): asserts a is string
/* prettier-ignore */ export function assertType(a: unknown, b: 'number', c?: ILocation): asserts a is number
/* prettier-ignore */ export function assertType(a: unknown, b: 'jsbi', c?: ILocation): asserts a is JSBI
/* prettier-ignore */ export function assertType(a: unknown, b: 'bigint', c?: ILocation): asserts a is bigint
/* prettier-ignore */ export function assertType(a: unknown, b: 'boolean', c?: ILocation): asserts a is boolean
/* prettier-ignore */ export function assertType(a: unknown, b: 'symbol', c?: ILocation): asserts a is symbol
/* prettier-ignore */ export function assertType(a: unknown, b: 'undefined', c?: ILocation): asserts a is undefined
/* prettier-ignore */ export function assertType(a: unknown, b: 'object', c?: ILocation): asserts a is object
/* prettier-ignore */ export function assertType(a: unknown, b: 'array', c?: ILocation): asserts a is Array<any>
/* prettier-ignore */ export function assertType(a: unknown, b: 'function', c?: ILocation): asserts a is Function
export function assertType(
	it: unknown,
	types: TAssertType | TAssertType[],
	location?: ILocation,
) {
	const itsType = typeof it
	if (Array.isArray(types) ? !types.includes(itsType) : types !== itsType) {
		throw new Error(`[rghzev] ${assertErrorText(it, types, location)}`)
	}
}
