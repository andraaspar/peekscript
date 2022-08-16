export class Fraction {
	#numerator: bigint
	#denominator: bigint
	#signMultiplier: bigint

	constructor(
		numerator: number | string | bigint,
		denominator: number | string | bigint = 1n,
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
		return new Fraction(
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

	isEqualTo(other: Fraction): boolean {
		return (
			other.#signMultiplier === this.#signMultiplier &&
			other.#numerator === this.#numerator &&
			other.#denominator === this.#denominator
		)
	}

	isSmallerThan(other: Fraction): boolean {
		if (this.#signMultiplier !== other.#signMultiplier) {
			return this.#signMultiplier < other.#signMultiplier
		}
		return (
			this.#signMultiplier * this.#numerator * other.#denominator <
			other.#signMultiplier * other.#numerator * this.#denominator
		)
	}

	isGreaterThan(other: Fraction): boolean {
		if (this.#signMultiplier !== other.#signMultiplier) {
			return this.#signMultiplier > other.#signMultiplier
		}
		return (
			this.#signMultiplier * this.#numerator * other.#denominator >
			other.#signMultiplier * other.#numerator * this.#denominator
		)
	}

	static fromNumber(n: number): Fraction {
		const signMultiplier = n < 0 ? -1n : 1n
		let positiveN = Math.abs(n)
		const fractionPart = positiveN % 1
		if (fractionPart === 0) {
			return new Fraction(positiveN, 1, signMultiplier)
		} else {
			let denominator = 1
			while (positiveN % 1) {
				positiveN *= 10
				denominator *= 10
			}
			return new Fraction(positiveN, denominator, signMultiplier)
		}
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

	toFractionString() {
		const sign = this.isNegative ? '-' : ''
		if (this.#denominator === 1n) {
			return sign + this.#numerator
		} else {
			return sign + this.#numerator + '/' + this.#denominator
		}
	}

	toString(precision?: number): string {
		return this.toFixed(precision).replace(/\.0*$|(\..*?[1-9])0+$/, '$1')
	}

	toFixed(precision: number = 20): string {
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

	negated(): Fraction {
		return new Fraction(
			this.#numerator,
			this.#denominator,
			-this.#signMultiplier,
		)
	}

	add(other: Fraction) {
		return new Fraction(
			this.#signMultiplier * this.#numerator * other.#denominator +
				other.#signMultiplier * other.#numerator * this.#denominator,
			this.#denominator * other.#denominator,
		)
	}

	subtract(other: Fraction) {
		return new Fraction(
			this.#signMultiplier * this.#numerator * other.#denominator -
				other.#signMultiplier * other.#numerator * this.#denominator,
			this.#denominator * other.#denominator,
		)
	}

	multipliedBy(other: Fraction) {
		return new Fraction(
			this.#signMultiplier *
				this.#numerator *
				other.#signMultiplier *
				other.#numerator,
			this.#denominator * other.#denominator,
		)
	}

	dividedBy(other: Fraction) {
		return new Fraction(
			this.#signMultiplier *
				this.#numerator *
				other.#signMultiplier *
				other.#denominator,
			this.#denominator * other.#numerator,
		)
	}

	toThePowerOf(other: Fraction) {
		if (other.#denominator === 1n) {
			if (other.isNegative) {
				return new Fraction(
					this.#denominator ** other.#numerator,
					this.#numerator ** other.#numerator,
					this.#signMultiplier,
				)
			} else {
				return new Fraction(
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
