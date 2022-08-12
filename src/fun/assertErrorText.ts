import { ILocation } from '../ast/ILocation'
import { getType } from './getType'
import { locationToString } from './locationToString'

export function assertErrorText(
	it: unknown,
	types: string | string[],
	location?: ILocation,
): string {
	return `Expected ${
		Array.isArray(types) ? types.join(' or ') : types
	}, got ${getType(it)} ${locationToString(location)}`
}
