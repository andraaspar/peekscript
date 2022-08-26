import { toInt } from '../fun/toInt'
import { toNumber } from '../fun/toNumber'
import { DECIMAL_REGEX } from '../model/constants'
import { INumberFn } from '../model/INumberFn'
import { TNumber } from '../model/TNumber'
import { Decimal } from './Decimal'

export class Rational implements INumberFn {
	#numerator: bigint
	#denominator: bigint
	#signMultiplier: bigint

	constructor(
		numerator: bigint,
		denominator: bigint = 1n,
		signMultiplier: bigint = 1n,
	) {
		this.#signMultiplier = signMultiplier < 0n ? -1n : 1n
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
				const [baseStr, expStr] = s.split('e')
				const base = Decimal.fromString(baseStr).toRational()
				return base.toThePowerOf(Decimal.fromString(expStr).toRational())
			} else {
				return Decimal.fromString(s).toRational()
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
		const sign = this.isNegative ? '-' : ''
		const remaining = this.#numerator % this.#denominator
		if (remaining) {
			const remainingToPow = remaining * 10n ** BigInt(precision + 1)
			const remainingString = (
				remainingToPow / this.#denominator +
				''
			).padStart(precision + 1, '0')
			return (
				sign +
				this.#numerator / this.#denominator +
				'.' +
				remainingString
			).replace(/(\d)\.?(\d)$/, (_, last, afterLast) =>
				parseInt(afterLast, 10) >= 5 ? parseInt(last, 10) + 1 + '' : last,
			)
		} else {
			return (
				sign + this.#numerator / this.#denominator + '.'.padEnd(precision, '0')
			)
		}
	}

	toDecimal(precision: TNumber) {
		precision = toInt(precision)
		return new Decimal(
			(this.#signMultiplier *
				(this.#numerator * 10n ** BigInt(precision + 1))) /
				this.#denominator,
			precision + 1,
		).toDecimal(precision)
	}

	toNumber(precision: TNumber) {
		return this.toDecimal(precision).toNumber()
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

	// 	function rootNth(val, k=2n) {
	//     let o = 0n; // old approx value
	//     let x = val;
	//     let limit = 100;

	//     while(x**k!==k && x!==o && --limit) {
	//       o=x;
	//       x = ((k-1n)*x + val/x**(k-1n))/k;
	//     }

	//     return x;
	// }

	// #root(val: bigint, k: bigint): bigint {
	// 	let prevN = 0n // old approx value
	// 	let n = val
	// 	let limit = 100
	// 	while (n ** k !== k && n !== prevN) {
	// 		if (--limit < 0) {
	// 			throw new Error(`[rgt5gw] Root calculation too complex.`)
	// 		}
	// 		prevN = n
	// 		n = ((k - 1n) * n + val / n ** (k - 1n)) / k
	// 	}

	// 	return n
	// }

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
		//  else if (other.#numerator === 1n) {
		// 	if (other.isNegative) {
		// 		return new ExactNum(
		// 			this.#root(this.#denominator, other.#denominator),
		// 			this.#root(this.#numerator, other.#denominator),
		// 			this.#signMultiplier,
		// 		)
		// 	} else {
		// 		return new ExactNum(
		// 			this.#root(this.#numerator, other.#denominator),
		// 			this.#root(this.#denominator, other.#denominator),
		// 			this.#signMultiplier,
		// 		)
		// 	}
		// }
		throw new Error(
			`[rgpz5u] Exponentiation not implemented for: ${other.toString()}`,
		)
	}
}
