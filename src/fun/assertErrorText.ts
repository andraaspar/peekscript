import { ILocation } from '../ast/ILocation'
import { locationToString } from './locationToString'
import { stringifyUnknown } from './stringifyUnknown'

export function assertErrorText(
	it: unknown,
	types: string | string[],
	location?: ILocation,
): string {
	return `Expected ${
		Array.isArray(types) ? types.join(' or ') : types
	}, got ${stringifyUnknown(it)} ${locationToString(location)}`
}
