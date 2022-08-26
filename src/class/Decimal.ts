import { toInt } from '../fun/toInt'
import { toNumber } from '../fun/toNumber'
import { DECIMAL_REGEX } from '../model/constants'
import { INumberFn } from '../model/INumberFn'
import { TNumber } from '../model/TNumber'
import { Rational } from './Rational'

export class Decimal implements INumberFn {
	#value: bigint
	#decimalPlaces: number

	constructor(value: bigint, decimalPlaces: TNumber) {
		decimalPlaces = toInt(decimalPlaces)
		if (decimalPlaces < 0) {
			throw new Error(
				`[rgt6p0] Expected decimal places to be equal to or greater than 0, got: ${decimalPlaces}`,
			)
		}
		for (let i = decimalPlaces; i > 0; i--) {
			if (value % 10n === 0n) {
				value /= 10n
				decimalPlaces--
			} else {
				break
			}
		}
		this.#value = value
		this.#decimalPlaces = decimalPlaces
	}

	get value() {
		return this.#value
	}

	get decimalPlaces() {
		return this.#decimalPlaces
	}

	toNumber(precision?: TNumber) {
		const src = precision == null ? this : this.toDecimal(precision)
		const s = src.toFixed(precision)
		const result = parseFloat(s)
		const dest = Decimal.fromNumber(result)
		if (!src.isEqualTo(dest)) {
			throw new Error(
				`[rgtd70] Cannot convert Decimal to number: ${src} != ${dest}`,
			)
		}
		return result
	}

	toDecimal(decimalPlaces: TNumber) {
		decimalPlaces = toInt(decimalPlaces)
		if (decimalPlaces < this.#decimalPlaces) {
			let value =
				this.#value / 10n ** BigInt(this.#decimalPlaces - decimalPlaces - 1)
			if (value >= 0n) {
				if (value % 10n >= 5n) {
					value += 10n
				}
			} else {
				if (value % 10n <= -5n) {
					value -= 10n
				}
			}
			return new Decimal(value / 10n, decimalPlaces)
		} else {
			return this
		}
	}

	toString(precision?: TNumber) {
		return this.toFixed(precision).replace(/\.0*$|(\..*?[1-9])0+$/, '$1')
	}

	toFixed(precision: TNumber = this.#decimalPlaces): string {
		precision = toInt(precision)
		if (precision < this.#decimalPlaces) {
			return this.toDecimal(precision).toFixed(precision)
		}
		let valueString = (this.#value < 0 ? -this.#value : this.#value)
			.toString()
			.padStart(this.decimalPlaces + 1, '0')
		valueString = valueString.padEnd(
			valueString.length + precision - this.#decimalPlaces,
			'0',
		)
		const splitPoint = Math.max(0, valueString.length - precision)
		const wholePart =
			(this.#value < 0 ? '-' : '') + (valueString.slice(0, splitPoint) || '0')
		const fractionPart = valueString.slice(splitPoint)
		return fractionPart ? wholePart + '.' + fractionPart : wholePart
	}

	static fromString(s: string): Decimal {
		if (!DECIMAL_REGEX.test(s)) {
			throw new Error(`[rh86ww] Unsupported Decimal string: ${s}`)
		}
		if (s.includes('e')) {
			const [baseString, expString] = s.split('e')
			const base = Decimal.fromString(baseString)
			return base.multipliedBy(
				new Decimal(10n, 0).toThePowerOf(Decimal.fromString(expString)),
			)
		} else {
			const sepIndex = s.indexOf('.')
			if (sepIndex < 0) {
				return new Decimal(BigInt(s), 0)
			}
			return new Decimal(BigInt(s.replace('.', '')), s.length - 1 - sepIndex)
		}
	}

	static fromNumber(n: TNumber): Decimal {
		n = toNumber(n)
		if (isNaN(n)) {
			throw new Error(`[rh87bq] NaN cannot be converted to Decimal.`)
		}
		if (!isFinite(n)) {
			throw new Error(`[rh87ct] Infinity cannot be converted to Decimal.`)
		}
		return this.fromString(n.toString())
	}

	isEqualTo(other: Decimal) {
		return (
			this.#decimalPlaces === other.decimalPlaces &&
			this.#value === other.#value
		)
	}

	#getCommonValuesAndDecimalPlaces(a: Decimal, b: Decimal) {
		const decimalPlaces = Math.max(a.#decimalPlaces, b.#decimalPlaces)
		const aValue =
			a.#decimalPlaces === decimalPlaces
				? a.#value
				: a.#value * 10n ** BigInt(decimalPlaces - a.#decimalPlaces)
		const bValue =
			b.#decimalPlaces === decimalPlaces
				? b.#value
				: b.#value * 10n ** BigInt(decimalPlaces - b.#decimalPlaces)
		return { decimalPlaces, a: aValue, b: bValue }
	}

	isLessThan(other: Decimal) {
		const { a, b } = this.#getCommonValuesAndDecimalPlaces(this, other)
		return a < b
	}

	isGreaterThan(other: Decimal) {
		const { a, b } = this.#getCommonValuesAndDecimalPlaces(this, other)
		return a > b
	}

	isLessThanOrEqualTo(other: Decimal) {
		return this.isLessThan(other) || this.isEqualTo(other)
	}

	isGreaterThanOrEqualTo(other: Decimal) {
		return this.isGreaterThan(other) || this.isEqualTo(other)
	}

	negated() {
		return new Decimal(-this.#value, this.#decimalPlaces)
	}

	plus(other: Decimal) {
		const { decimalPlaces, a, b } = this.#getCommonValuesAndDecimalPlaces(
			this,
			other,
		)
		return new Decimal(a + b, decimalPlaces)
	}

	minus(other: Decimal) {
		const { decimalPlaces, a, b } = this.#getCommonValuesAndDecimalPlaces(
			this,
			other,
		)
		return new Decimal(a - b, decimalPlaces)
	}

	multipliedBy(other: Decimal) {
		return new Decimal(
			this.#value * other.#value,
			this.#decimalPlaces + other.#decimalPlaces,
		)
	}

	dividedBy(other: Decimal, precision: TNumber) {
		return this.toRational().dividedBy(other.toRational()).toDecimal(precision)
	}

	toThePowerOf(other: Decimal) {
		if (other.#decimalPlaces === 0) {
			if (other.value === 0n) {
				return new Decimal(1n, 0)
			}
			if (other.value === 1n) {
				return this
			}
			if (other.#value > 0) {
				return new Decimal(
					this.#value ** other.#value,
					this.#decimalPlaces === 0
						? 0
						: this.decimalPlaces * Number(other.#value),
				)
			}
		}
		throw new Error(`[rgtgtd] Exponentiation not implemented for: ${other}`)
	}

	toRational() {
		return new Rational(this.#value, 10n ** BigInt(this.decimalPlaces))
	}
}
