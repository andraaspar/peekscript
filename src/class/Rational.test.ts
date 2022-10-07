import { Rational } from './Rational'

test(`[rgph47]`, () => {
	expect(new Rational(1n, 3n).toFixed(3)).toBe('0.333')
})

test(`[rgphbz]`, () => {
	expect(new Rational(2n, 3n).toFixed(3)).toBe('0.667')
})

test(`[rgph89]`, () => {
	expect(new Rational(5n, 100n).toFixed(3)).toBe('0.050')
})

test(`[rgpij1]`, () => {
	expect(new Rational(-1n, 20n).toFixed(3)).toBe('-0.050')
})

test(`[rgpkhq]`, () => {
	expect(new Rational(2n, 8n).toString()).toBe('1/4')
})

test(`[rgplld]`, () => {
	expect(new Rational(-2n, 8n).toString()).toBe('-1/4')
})

test(`[rgpllw]`, () => {
	expect(new Rational(2n, -8n).toString()).toBe('-1/4')
})

test(`[rgplmb]`, () => {
	expect(new Rational(-2n, -8n).toString()).toBe('1/4')
})

test(`[rgplny]`, () => {
	expect(new Rational(714n, 85n).toString()).toBe('42/5')
})

test(`[rgppns]`, () => {
	expect(Rational.fromNumber(3.14159).toFixed(5)).toBe('3.14159')
})

test(`[rgpprr]`, () => {
	expect(Rational.fromNumber(1.25).toString()).toBe('5/4')
})

test(`[rgpptv]`, () => {
	expect(Rational.fromNumber(3).toString()).toBe('3')
})

test(`[rgpqj2]`, () => {
	expect(Rational.fromNumber(3).toString()).toBe('3')
})

test(`[rgppwa]`, () => {
	expect(() => new Rational(1n, 0n)).toThrow(/division/i)
})

test(`[rgppzs]`, () => {
	expect(new Rational(1n, 4n).isEqualTo(Rational.fromNumber(0.25))).toBe(true)
})

test(`[rgpq2d]`, () => {
	expect(new Rational(3n, 2n).toFixed(0)).toBe('2')
})

test(`[rgpqh0]`, () => {
	expect(new Rational(-3n, 2n).toFixed(0)).toBe('-2')
})

test(`[rgprdd]`, () => {
	expect(new Rational(1n, 4n).plus(new Rational(2n, 8n)).toString()).toBe('1/2')
})

test(`[rgprf3]`, () => {
	expect(new Rational(1n, 4n).plus(new Rational(-3n, 8n)).toString()).toBe(
		'-1/8',
	)
})

test(`[rgprgb]`, () => {
	expect(new Rational(-1n, 4n).plus(new Rational(3n, 8n)).toString()).toBe(
		'1/8',
	)
})

test(`[rgprgx]`, () => {
	expect(new Rational(-1n, 4n).plus(new Rational(-2n, 8n)).toString()).toBe(
		'-1/2',
	)
})

test(`[rgprie]`, () => {
	expect(
		Rational.fromNumber(3.14).plus(Rational.fromNumber(3.14)).toFixed(2),
	).toBe('6.28')
})

test(`[rgprxn]`, () => {
	expect(new Rational(1n, 2n).minus(new Rational(1n, 4n)).toString()).toBe(
		'1/4',
	)
})

test(`[rgps09]`, () => {
	expect(new Rational(1n, 2n).minus(new Rational(-1n, 4n)).toString()).toBe(
		'3/4',
	)
})

test(`[rgps0b]`, () => {
	expect(
		new Rational(1n, 2n).multipliedBy(new Rational(1n, 2n)).toString(),
	).toBe('1/4')
})

test(`[rgps1e]`, () => {
	expect(
		new Rational(1n, 2n).multipliedBy(new Rational(-1n, 2n)).toString(),
	).toBe('-1/4')
})

test(`[rgps1v]`, () => {
	expect(new Rational(1n, 2n).dividedBy(new Rational(1n, 4n)).toString()).toBe(
		'2',
	)
})

test(`[rgps4n]`, () => {
	expect(new Rational(1n, 2n).dividedBy(new Rational(-1n, 4n)).toString()).toBe(
		'-2',
	)
})

test(`[rgps64]`, () => {
	expect(new Rational(1n, 8n).isLessThan(new Rational(1n, 4n))).toBe(true)
})

test(`[rgpuek]`, () => {
	expect(new Rational(1n, 8n).isLessThan(new Rational(-1n, 4n))).toBe(false)
})

test(`[rgpufw]`, () => {
	expect(new Rational(1n, 4n).isGreaterThan(new Rational(1n, 8n))).toBe(true)
})

test(`[rgpuh0]`, () => {
	expect(new Rational(-1n, 4n).isGreaterThan(new Rational(1n, 8n))).toBe(false)
})

test(`[rgpvc5]`, () => {
	expect(new Rational(3n).toThePowerOf(new Rational(2n)).toString()).toBe('9')
})

test(`[rgpytk]`, () => {
	expect(new Rational(5n).toThePowerOf(new Rational(3n)).toString()).toBe('125')
})

test(`[rgsz02]`, () => {
	expect(new Rational(2n, 3n).toThePowerOf(new Rational(2n)).toString()).toBe(
		'4/9',
	)
})

test(`[rgsz2d]`, () => {
	expect(new Rational(5n).toThePowerOf(new Rational(-2n)).toString()).toBe(
		'1/25',
	)
})

test(`[rgszbw]`, () => {
	expect(new Rational(5n).toThePowerOf(new Rational(0n)).toString()).toBe('1')
})

test(`[rgszbw]`, () => {
	expect(new Rational(5n).toThePowerOf(new Rational(1n)).toString()).toBe('5')
})

test(`[rgpw5t]`, () => {
	expect(() => new Rational(25n).toThePowerOf(new Rational(1n, 2n))).toThrow(
		/implemented/i,
	)
})

test(`[rgt403]`, () => {
	expect(new Rational(10n).remainder(new Rational(7n)).toString()).toBe('3')
})

test(`[rgt64c]`, () => {
	expect(Rational.fromString('-2/6').toString()).toBe('-1/3')
})

test(`[rgti5f]`, () => {
	expect(Rational.fromString('-1/2').toDecimalString(3)).toBe('-0.5')
})

test(`[rjdui4]`, () => {
	expect(Rational.fromString('1/4').toDecimalString(3)).toBe('0.25')
})
