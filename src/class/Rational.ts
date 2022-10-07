import { toInt } from '../fun/toInt'
import { toNumber } from '../fun/toNumber'
import { DECIMAL_REGEX } from '../model/constants'
import { TNumber } from '../model/TNumber'

export class Rational {
	static ZERO = new Rational(0n)

	#numerator: bigint
	#denominator: bigint
	#signMultiplier: bigint

	constructor(
		numerator: bigint,
		denominator: bigint = 1n,
		signMultiplier: bigint = 1n,
	) {
		this.#signMultiplier = signMultiplier < 0n && numerator !== 0n ? -1n : 1n
		this.#numerator = BigInt(numerator)
		if (this.#numerator < 0n) {
			this.#signMultiplier = -this.#signMultiplier
			this.#numerator = -this.#numerator
		}
		this.#denominator = BigInt(denominator)
		if (this.#denominator === 0n) {
			throw new Error(`[rgpljw] Division by zero.`)
		}
		if (this.#denominator < 0n) {
			this.#signMultiplier = -this.#signMultiplier
			this.#denominator = -this.#denominator
		}
		const gcd = this.#gcd(this.#numerator, this.#denominator)
		this.#numerator /= gcd
		this.#denominator /= gcd
	}

	clone() {
		return new Rational(
			this.#numerator,
			this.#denominator,
			this.#signMultiplier,
		)
	}

	get numerator() {
		return this.#numerator
	}

	get denominator() {
		return this.#denominator
	}

	get isNegative() {
		return this.#signMultiplier < 0n
	}

	isEqualTo(other: Rational): boolean {
		return (
			other.#signMultiplier === this.#signMultiplier &&
			other.#numerator === this.#numerator &&
			other.#denominator === this.#denominator
		)
	}

	isLessThan(other: Rational): boolean {
		if (this.#signMultiplier !== other.#signMultiplier) {
			return this.#signMultiplier < other.#signMultiplier
		}
		return (
			this.#signMultiplier * this.#numerator * other.#denominator <
			other.#signMultiplier * other.#numerator * this.#denominator
		)
	}

	isGreaterThan(other: Rational): boolean {
		if (this.#signMultiplier !== other.#signMultiplier) {
			return this.#signMultiplier > other.#signMultiplier
		}
		return (
			this.#signMultiplier * this.#numerator * other.#denominator >
			other.#signMultiplier * other.#numerator * this.#denominator
		)
	}

	isLessThanOrEqualTo(other: Rational) {
		return this.isLessThan(other) || this.isEqualTo(other)
	}

	isGreaterThanOrEqualTo(other: Rational) {
		return this.isGreaterThan(other) || this.isEqualTo(other)
	}

	static fromNumber(n: TNumber): Rational {
		n = toNumber(n)
		if (isNaN(n)) {
			throw new Error(`[rh8fes] NaN cannot be converted to Rational.`)
		}
		if (!isFinite(n)) {
			throw new Error(`[rh8feu] Infinity cannot be converted to Rational.`)
		}
		const signMultiplier = n < 0 ? -1n : 1n
		let positiveN = Math.abs(n)
		const fractionPart = positiveN % 1
		if (fractionPart === 0) {
			return new Rational(BigInt(positiveN), 1n, signMultiplier)
		} else {
			let denominator = 1
			while (positiveN % 1) {
				positiveN *= 10
				denominator *= 10
			}
			return new Rational(
				BigInt(positiveN),
				BigInt(denominator),
				signMultiplier,
			)
		}
	}

	static fromString(s: string): Rational {
		if (/^[-+]?\d+\/[-+]?\d+$/.test(s)) {
			const [numerator, denominator = ''] = s.split('/')
			return new Rational(BigInt(numerator), BigInt(denominator))
		} else if (DECIMAL_REGEX.test(s)) {
			if (s.includes('e')) {
				const [baseString, expString] = s.split('e')
				const base = Rational.fromString(baseString)
				return base.multipliedBy(
					new Rational(10n).toThePowerOf(Rational.fromString(expString)),
				)
			} else {
				const sepIndex = s.indexOf('.')
				if (sepIndex < 0) {
					return new Rational(BigInt(s))
				}
				return new Rational(
					BigInt(s.replace('.', '')),
					10n ** BigInt(s.length - 1 - sepIndex),
				)
			}
		}
		throw new Error(`[rh8f5b] Unsupported Rational string: ${s}`)
	}

	#gcd(a: bigint, b: bigint): bigint {
		if (!a) return b
		if (!b) return a

		while (true) {
			a %= b
			if (!a) return b
			b %= a
			if (!b) return a
		}
	}

	toString() {
		const sign = this.isNegative ? '-' : ''
		if (this.#denominator === 1n) {
			return sign + this.#numerator
		} else {
			return sign + this.#numerator + '/' + this.#denominator
		}
	}

	toDecimalString(precision: TNumber): string {
		return this.toFixed(precision).replace(/\.0*$|(\..*?[1-9])0+$/, '$1')
	}

	toFixed(precision: TNumber): string {
		precision = toInt(precision)

		// Divide
		let value =
			(this.#signMultiplier *
				(this.#numerator * 10n ** BigInt(precision + 1))) /
			this.#denominator

		// Round
		if (value >= 0n) {
			// Positive
			if (value % 10n >= 5n) {
				value += 10n
			}
		} else {
			// Negative
			if (value % 10n <= -5n) {
				value -= 10n
			}
		}
		value = value / 10n

		// Stringify
		let valueString = (value < 0 ? -value : value)
			.toString()
			.padStart(precision + 1, '0')
		const splitPoint = Math.max(0, valueString.length - precision)
		const wholePart =
			(value < 0n ? '-' : '') + (valueString.slice(0, splitPoint) || '0')
		const fractionPart = valueString.slice(splitPoint)
		return fractionPart ? wholePart + '.' + fractionPart : wholePart
	}

	toNumber(precision: TNumber) {
		let valueString = this.toFixed(precision)
		const result = parseFloat(valueString)

		// Test
		const dest = Rational.fromNumber(result)
		if (!this.isEqualTo(dest)) {
			throw new Error(
				`[rgtd70] Cannot convert Rational to number: ${this} != ${dest}`,
			)
		}

		return result
	}

	toRational() {
		return this
	}

	negated(): Rational {
		return new Rational(
			this.#numerator,
			this.#denominator,
			-this.#signMultiplier,
		)
	}

	plus(other: Rational) {
		return new Rational(
			this.#signMultiplier * this.#numerator * other.#denominator +
				other.#signMultiplier * other.#numerator * this.#denominator,
			this.#denominator * other.#denominator,
		)
	}

	minus(other: Rational) {
		return new Rational(
			this.#signMultiplier * this.#numerator * other.#denominator -
				other.#signMultiplier * other.#numerator * this.#denominator,
			this.#denominator * other.#denominator,
		)
	}

	multipliedBy(other: Rational) {
		return new Rational(
			this.#signMultiplier *
				this.#numerator *
				other.#signMultiplier *
				other.#numerator,
			this.#denominator * other.#denominator,
		)
	}

	dividedBy(other: Rational) {
		return new Rational(
			this.#signMultiplier *
				this.#numerator *
				other.#signMultiplier *
				other.#denominator,
			this.#denominator * other.#numerator,
		)
	}

	remainder(other: Rational) {
		return new Rational(
			(this.#signMultiplier * (this.#numerator * other.#denominator)) %
				(this.#denominator * other.#numerator),
			this.#denominator * other.denominator,
		)
	}

	toThePowerOf(other: Rational) {
		if (other.#denominator === 1n) {
			if (other.isNegative) {
				return new Rational(
					this.#denominator ** other.#numerator,
					this.#numerator ** other.#numerator,
					this.#signMultiplier,
				)
			} else {
				return new Rational(
					this.#numerator ** other.#numerator,
					this.#denominator ** other.#numerator,
					this.#signMultiplier,
				)
			}
		}
		throw new Error(
			`[rgpz5u] Exponentiation not implemented for: ${other.toString()}`,
		)
	}
}
