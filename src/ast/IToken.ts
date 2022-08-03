import { ILocation } from './ILocation'

export interface IToken<T, V> extends ILocation {
	type: T
	value: V
	text: string
}
