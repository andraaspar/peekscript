import { TAssertType } from '../model/TAssertType'

export function getType(it: unknown): TAssertType {
	if (it === null) return 'null'
	return typeof it
}
