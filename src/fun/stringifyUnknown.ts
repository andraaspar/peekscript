import type JSBI from 'jsbi'
import { getType } from './getType'

export function stringifyUnknown(o: unknown): string {
	const t = getType(o)
	switch (t) {
		case 'symbol':
			return `[${t} ${(o as symbol).toString()}]`
		case 'array':
			return `[object Array]`
		case 'jsbi':
			return `[object JSBI ${(o as JSBI).toString()}]`
		default:
			const str = o + ''
			return str.startsWith('[') ? str : `[${t} ${str}]`
	}
}
