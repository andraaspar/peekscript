import { Decimal } from '../class/Decimal'
import { Rational } from '../class/Rational'
import { TNumber } from './TNumber'

export interface INumberFn {
	toDecimal(precision: TNumber): Decimal
	toRational(): Rational
	toNumber(precision: TNumber): number
	toFixed(precision: TNumber): string
}
