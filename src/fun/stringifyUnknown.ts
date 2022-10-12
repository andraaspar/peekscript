import { getType } from './getType'

export function stringifyUnknown(o: unknown): string {
	const t = getType(o)
	switch (t) {
		case 'symbol':
			return `[${t} ${(o as symbol).toString()}]`
		case 'array':
			return `[object Array]`
		default:
			const str = o + ''
			return str.startsWith('[') ? str : `[${t} ${str}]`
	}
}
