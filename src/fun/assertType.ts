import { ILocation } from '../ast/ILocation'
import { TAssertType } from '../model/TAssertType'
import { assertErrorText } from './assertErrorText'
import { getType } from './getType'

/* prettier-ignore */ export function assertType(a: unknown, b: 'string', c?: ILocation): asserts a is string
/* prettier-ignore */ export function assertType(a: unknown, b: 'number', c?: ILocation): asserts a is number
/* prettier-ignore */ export function assertType(a: unknown, b: 'bigint', c?: ILocation): asserts a is bigint
/* prettier-ignore */ export function assertType(a: unknown, b: 'boolean', c?: ILocation): asserts a is boolean
/* prettier-ignore */ export function assertType(a: unknown, b: 'symbol', c?: ILocation): asserts a is symbol
/* prettier-ignore */ export function assertType(a: unknown, b: 'undefined', c?: ILocation): asserts a is undefined
/* prettier-ignore */ export function assertType(a: unknown, b: 'object', c?: ILocation): asserts a is object
/* prettier-ignore */ export function assertType(a: unknown, b: 'function', c?: ILocation): asserts a is Function
/* prettier-ignore */ export function assertType(a: unknown, b: 'null', c?: ILocation): asserts a is null
export function assertType(
	it: unknown,
	types: TAssertType | TAssertType[],
	location?: ILocation,
) {
	const itsType = getType(it)
	if (Array.isArray(types) ? !types.includes(itsType) : types !== itsType) {
		throw new Error(`[rghzev] ${assertErrorText(it, types, location)}`)
	}
}
