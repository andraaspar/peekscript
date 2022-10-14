import JSBI from 'jsbi'
import { toInt } from '../fun/toInt'
import { DECIMAL_REGEX } from '../model/constants'

type TNumber = number | bigint | JSBI | Rational

const ZERO = JSBI.BigInt(0)

export class Rational {
	static ZERO = new Rational(ZERO)

	#numerator: JSBI
	#denominator: JSBI
	#signMultiplier: JSBI

	constructor(
		numerator: TNumber,
		denominator: TNumber = JSBI.BigInt(1),
		signMultiplier: TNumber = JSBI.BigInt(1),
	) {
		numerator = Rational.toBigInt(numerator)
		denominator = Rational.toBigInt(denominator)
		signMultiplier = Rational.toBigInt(signMultiplier)

		this.#signMultiplier =
			JSBI.lessThan(signMultiplier, ZERO) && JSBI.notEqual(numerator, ZERO)
				? JSBI.BigInt(-1)
				: JSBI.BigInt(1)
		this.#numerator = JSBI.BigInt(numerator)
		if (JSBI.lessThan(this.#numerator, ZERO)) {
			this.#signMultiplier = JSBI.unaryMinus(this.#signMultiplier)
			this.#numerator = JSBI.unaryMinus(this.#numerator)
		}
		this.#denominator = JSBI.BigInt(denominator)
		if (JSBI.equal(this.#denominator, ZERO)) {
			throw new Error(`[rgpljw] Division by zero.`)
		}
		if (JSBI.lessThan(this.#denominator, ZERO)) {
			this.#signMultiplier = JSBI.unaryMinus(this.#signMultiplier)
			this.#denominator = JSBI.unaryMinus(this.#denominator)
		}
		const gcd = this.#gcd(this.#numerator, this.#denominator)
		this.#numerator = JSBI.divide(this.#numerator, gcd)
		this.#denominator = JSBI.divide(this.#denominator, gcd)
	}

	get numerator() {
		return this.#numerator
	}

	get denominator() {
		return this.#denominator
	}

	get signMultiplier() {
		return this.#signMultiplier
	}

	isEqualTo(other: unknown): boolean {
		return (
			other instanceof Rational &&
			JSBI.equal(other.#signMultiplier, this.#signMultiplier) &&
			JSBI.equal(other.#numerator, this.#numerator) &&
			JSBI.equal(other.#denominator, this.#denominator)
		)
	}

	isLessThan(other: TNumber): boolean {
		other = Rational.fromNumber(other)
		if (JSBI.notEqual(this.#signMultiplier, other.#signMultiplier)) {
			return JSBI.lessThan(this.#signMultiplier, other.#signMultiplier)
		}
		return JSBI.lessThan(
			JSBI.multiply(
				JSBI.multiply(this.#signMultiplier, this.#numerator),
				other.#denominator,
			),
			JSBI.multiply(
				JSBI.multiply(other.#signMultiplier, other.#numerator),
				this.#denominator,
			),
		)
	}

	isGreaterThan(other: TNumber): boolean {
		other = Rational.fromNumber(other)
		if (JSBI.notEqual(this.#signMultiplier, other.#signMultiplier)) {
			return JSBI.greaterThan(this.#signMultiplier, other.#signMultiplier)
		}
		return JSBI.greaterThan(
			JSBI.multiply(
				JSBI.multiply(this.#signMultiplier, this.#numerator),
				other.#denominator,
			),
			JSBI.multiply(
				JSBI.multiply(other.#signMultiplier, other.#numerator),
				this.#denominator,
			),
		)
	}

	isLessThanOrEqualTo(other: Rational) {
		return this.isLessThan(other) || this.isEqualTo(other)
	}

	isGreaterThanOrEqualTo(other: Rational) {
		return this.isGreaterThan(other) || this.isEqualTo(other)
	}

	static fromNumber(n: TNumber): Rational {
		switch (typeof n) {
			case 'number':
				if (isNaN(n)) {
					throw new Error(`[rjn9fo] NaN cannot be converted to Rational.`)
				}
				if (!isFinite(n)) {
					throw new Error(`[rjn9fq] Infinity cannot be converted to Rational.`)
				}
				const signMultiplier = n < 0 ? JSBI.BigInt(-1) : JSBI.BigInt(1)
				let positiveN = Math.abs(n)
				const fractionPart = positiveN % 1
				if (fractionPart === 0) {
					return new Rational(
						JSBI.BigInt(positiveN),
						JSBI.BigInt(1),
						signMultiplier,
					)
				} else {
					let denominator = 1
					while (positiveN % 1) {
						positiveN *= 10
						denominator *= 10
					}
					return new Rational(
						JSBI.BigInt(positiveN),
						JSBI.BigInt(denominator),
						signMultiplier,
					)
				}
			case 'bigint':
				return new Rational(JSBI.BigInt(n + ''))
			case 'object':
				if (n instanceof Rational) {
					return n
				} else if (n instanceof JSBI) {
					return new Rational(n)
				}
			default:
				return Rational.fromNumber(Rational.toBigInt(n))
		}
	}

	static toBigInt(n: TNumber): JSBI {
		switch (typeof n) {
			case 'number':
				return JSBI.BigInt(n)
			case 'bigint':
				return JSBI.BigInt(n + '')
			case 'object':
				if (n instanceof Rational) {
					return JSBI.divide(
						JSBI.multiply(n.signMultiplier, n.numerator),
						n.denominator,
					)
				} else if (n instanceof JSBI) {
					return n
				}
			default:
				throw new Error(`[rjn88d] Could not convert ${typeof n} to JSBI.`)
		}
	}

	static fromString(s: string): Rational {
		if (/^[-+]?\d+\/[-+]?\d+$/.test(s)) {
			const [numerator, denominator = ''] = s.split('/')
			return new Rational(JSBI.BigInt(numerator), JSBI.BigInt(denominator))
		} else if (DECIMAL_REGEX.test(s)) {
			if (s.includes('e')) {
				const [baseString, expString] = s.split('e')
				const base = Rational.fromString(baseString)
				return base.multipliedBy(
					new Rational(JSBI.BigInt(10)).toThePowerOf(
						Rational.fromString(expString),
					),
				)
			} else {
				const sepIndex = s.indexOf('.')
				if (sepIndex < 0) {
					return new Rational(JSBI.BigInt(s))
				}
				return new Rational(
					JSBI.BigInt(s.replace('.', '')),
					JSBI.exponentiate(
						JSBI.BigInt(10),
						JSBI.BigInt(s.length - 1 - sepIndex),
					),
				)
			}
		}
		throw new Error(`[rh8f5b] Unsupported Rational string: ${s}`)
	}

	#gcd(a: JSBI, b: JSBI): JSBI {
		if (JSBI.equal(a, ZERO)) return b
		if (JSBI.equal(b, ZERO)) return a

		while (true) {
			a = JSBI.remainder(a, b)
			if (JSBI.equal(a, ZERO)) return b
			b = JSBI.remainder(b, a)
			if (JSBI.equal(b, ZERO)) return a
		}
	}

	toString() {
		const sign = JSBI.lessThan(this.#signMultiplier, ZERO) ? '-' : ''
		if (JSBI.equal(this.#denominator, JSBI.BigInt(1))) {
			return '(' + sign + this.#numerator.toString() + ')'
		} else {
			const wholePart = JSBI.divide(this.#numerator, this.#denominator)
			const wholePartString = JSBI.equal(wholePart, ZERO)
				? sign
				: sign + wholePart.toString() + (sign || '+')
			const fractionPartString =
				JSBI.remainder(this.#numerator, this.#denominator).toString() +
				'/' +
				this.#denominator.toString()
			return '(' + wholePartString + fractionPartString + ')'
		}
	}

	toDecimalString(precision: TNumber): string {
		return this.toFixed(precision).replace(/\.0*$|(\..*?[1-9])0+$/, '$1')
	}

	toFixed(precision: TNumber): string {
		precision = toInt(precision)

		// Divide
		let value = JSBI.divide(
			JSBI.multiply(
				this.#signMultiplier,
				JSBI.multiply(
					this.#numerator,
					JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(precision + 1)),
				),
			),
			this.#denominator,
		)

		// Round
		if (JSBI.greaterThanOrEqual(value, ZERO)) {
			// Positive
			if (
				JSBI.greaterThanOrEqual(
					JSBI.remainder(value, JSBI.BigInt(10)),
					JSBI.BigInt(5),
				)
			) {
				value = JSBI.add(value, JSBI.BigInt(10))
			}
		} else {
			// Negative
			if (
				JSBI.lessThanOrEqual(
					JSBI.remainder(value, JSBI.BigInt(10)),
					JSBI.BigInt(-5),
				)
			) {
				value = JSBI.subtract(value, JSBI.BigInt(10))
			}
		}
		value = JSBI.divide(value, JSBI.BigInt(10))

		// Stringify
		let valueString = (
			JSBI.lessThan(value, ZERO) ? JSBI.unaryMinus(value) : value
		)
			.toString()
			.padStart(precision + 1, '0')
		const splitPoint = Math.max(0, valueString.length - precision)
		const wholePart =
			(JSBI.lessThan(value, ZERO) ? '-' : '') +
			(valueString.slice(0, splitPoint) || '0')
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

	negated(): Rational {
		return new Rational(
			this.#numerator,
			this.#denominator,
			JSBI.unaryMinus(this.#signMultiplier),
		)
	}

	plus(other: TNumber) {
		other = Rational.fromNumber(other)
		return new Rational(
			JSBI.add(
				JSBI.multiply(
					JSBI.multiply(this.#signMultiplier, this.#numerator),
					other.#denominator,
				),
				JSBI.multiply(
					JSBI.multiply(other.#signMultiplier, other.#numerator),
					this.#denominator,
				),
			),
			JSBI.multiply(this.#denominator, other.#denominator),
		)
	}

	minus(other: TNumber) {
		other = Rational.fromNumber(other)
		return new Rational(
			JSBI.subtract(
				JSBI.multiply(
					JSBI.multiply(this.#signMultiplier, this.#numerator),
					other.#denominator,
				),
				JSBI.multiply(
					JSBI.multiply(other.#signMultiplier, other.#numerator),
					this.#denominator,
				),
			),
			JSBI.multiply(this.#denominator, other.#denominator),
		)
	}

	multipliedBy(other: TNumber) {
		other = Rational.fromNumber(other)
		return new Rational(
			JSBI.multiply(
				JSBI.multiply(
					JSBI.multiply(this.#signMultiplier, this.#numerator),
					other.#signMultiplier,
				),
				other.#numerator,
			),
			JSBI.multiply(this.#denominator, other.#denominator),
		)
	}

	dividedBy(other: TNumber) {
		other = Rational.fromNumber(other)
		return new Rational(
			JSBI.multiply(
				JSBI.multiply(
					JSBI.multiply(this.#signMultiplier, this.#numerator),
					other.#signMultiplier,
				),
				other.#denominator,
			),
			JSBI.multiply(this.#denominator, other.#numerator),
		)
	}

	remainder(other: TNumber) {
		other = Rational.fromNumber(other)
		return new Rational(
			JSBI.remainder(
				JSBI.multiply(
					JSBI.multiply(this.#signMultiplier, this.#numerator),
					other.#denominator,
				),
				JSBI.multiply(this.#denominator, other.#numerator),
			),
			JSBI.multiply(this.#denominator, other.denominator),
		)
	}

	toThePowerOf(other: TNumber) {
		other = Rational.fromNumber(other)
		if (JSBI.equal(other.#denominator, JSBI.BigInt(1))) {
			if (JSBI.lessThan(other.#signMultiplier, ZERO)) {
				return new Rational(
					JSBI.exponentiate(this.#denominator, other.#numerator),
					JSBI.exponentiate(this.#numerator, other.#numerator),
					this.#signMultiplier,
				)
			} else {
				return new Rational(
					JSBI.exponentiate(this.#numerator, other.#numerator),
					JSBI.exponentiate(this.#denominator, other.#numerator),
					this.#signMultiplier,
				)
			}
		}
		throw new Error(
			`[rgpz5u] Exponentiation not implemented for: ${other.toString()}`,
		)
	}
}
