import { Rational } from './Rational'

export class Decimal {
	#value: bigint
	#decimalPlaces: number

	constructor(value: bigint, decimalPlaces: number) {
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

	toNumber() {
		const s = this.toString()
		const result = parseFloat(s)
		const other = Decimal.fromNumber(result)
		if (!this.isEqualTo(other)) {
			throw new Error(
				`[rgtd70] Cannot convert RoughNum to number: ${s} != ${other}`,
			)
		}
		return result
	}

	toDecimalPlaces(decimalPlaces: number) {
		if (decimalPlaces < this.#decimalPlaces) {
			let value =
				this.#value * 10n ** BigInt(decimalPlaces - this.#decimalPlaces + 1)
			if (value > 0) {
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

	toString(precision?: number) {
		return this.toFixed(precision).replace(/\.0*$|(\..*?[1-9])0+$/, '$1')
	}

	toFixed(precision: number = this.#decimalPlaces): string {
		if (precision < this.#decimalPlaces) {
			return this.toDecimalPlaces(precision).toFixed(precision)
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

	static fromNumber(n: number): Decimal {
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

	dividedBy(other: Decimal, precision: number) {
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
