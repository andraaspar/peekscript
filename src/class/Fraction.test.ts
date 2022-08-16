import { Fraction } from './Fraction'

test(`[rgph47]`, () => {
	expect(new Fraction(1, 3).toString(3)).toBe('0.333')
})

test(`[rgphbz]`, () => {
	expect(new Fraction(2, 3).toString(3)).toBe('0.667')
})

test(`[rgph89]`, () => {
	expect(new Fraction(5, 100).toString(3)).toBe('0.05')
})

test(`[rgpij1]`, () => {
	expect(new Fraction(-1, 20).toString(3)).toBe('-0.05')
})

test(`[rgpkhq]`, () => {
	expect(new Fraction(2, 8).toFractionString()).toBe('1/4')
})

test(`[rgplld]`, () => {
	expect(new Fraction(-2, 8).toFractionString()).toBe('-1/4')
})

test(`[rgpllw]`, () => {
	expect(new Fraction(2, -8).toFractionString()).toBe('-1/4')
})

test(`[rgplmb]`, () => {
	expect(new Fraction(-2, -8).toFractionString()).toBe('1/4')
})

test(`[rgplny]`, () => {
	expect(new Fraction(714n, 85n).toFractionString()).toBe('42/5')
})

test(`[rgppns]`, () => {
	expect(Fraction.fromNumber(3.14159).toString()).toBe('3.14159')
})

test(`[rgpprr]`, () => {
	expect(Fraction.fromNumber(1.25).toFractionString()).toBe('5/4')
})

test(`[rgpptv]`, () => {
	expect(Fraction.fromNumber(3).toFractionString()).toBe('3')
})

test(`[rgpqj2]`, () => {
	expect(Fraction.fromNumber(3).toString()).toBe('3')
})

test(`[rgppwa]`, () => {
	expect(() => new Fraction(1, 0)).toThrow(/division/i)
})

test(`[rgppzs]`, () => {
	expect(new Fraction(1, 4).isEqualTo(Fraction.fromNumber(0.25))).toBe(true)
})

test(`[rgpq2d]`, () => {
	expect(new Fraction(3, 2).toString(0)).toBe('2')
})

test(`[rgpqh0]`, () => {
	expect(new Fraction(-3, 2).toString(0)).toBe('-2')
})

test(`[rgprdd]`, () => {
	expect(new Fraction(1, 4).add(new Fraction(2, 8)).toFractionString()).toBe(
		'1/2',
	)
})

test(`[rgprf3]`, () => {
	expect(new Fraction(1, 4).add(new Fraction(-3, 8)).toFractionString()).toBe(
		'-1/8',
	)
})

test(`[rgprgb]`, () => {
	expect(new Fraction(-1, 4).add(new Fraction(3, 8)).toFractionString()).toBe(
		'1/8',
	)
})

test(`[rgprgx]`, () => {
	expect(new Fraction(-1, 4).add(new Fraction(-2, 8)).toFractionString()).toBe(
		'-1/2',
	)
})

test(`[rgprie]`, () => {
	expect(
		Fraction.fromNumber(3.14).add(Fraction.fromNumber(3.14)).toString(),
	).toBe('6.28')
})

test(`[rgprxn]`, () => {
	expect(
		new Fraction(1, 2).subtract(new Fraction(1, 4)).toFractionString(),
	).toBe('1/4')
})

test(`[rgps09]`, () => {
	expect(
		new Fraction(1, 2).subtract(new Fraction(-1, 4)).toFractionString(),
	).toBe('3/4')
})

test(`[rgps0b]`, () => {
	expect(
		new Fraction(1, 2).multipliedBy(new Fraction(1, 2)).toFractionString(),
	).toBe('1/4')
})

test(`[rgps1e]`, () => {
	expect(
		new Fraction(1, 2).multipliedBy(new Fraction(-1, 2)).toFractionString(),
	).toBe('-1/4')
})

test(`[rgps1v]`, () => {
	expect(
		new Fraction(1, 2).dividedBy(new Fraction(1, 4)).toFractionString(),
	).toBe('2')
})

test(`[rgps4n]`, () => {
	expect(
		new Fraction(1, 2).dividedBy(new Fraction(-1, 4)).toFractionString(),
	).toBe('-2')
})

test(`[rgps64]`, () => {
	expect(new Fraction(1, 8).isSmallerThan(new Fraction(1, 4))).toBe(true)
})

test(`[rgpuek]`, () => {
	expect(new Fraction(1, 8).isSmallerThan(new Fraction(-1, 4))).toBe(false)
})

test(`[rgpufw]`, () => {
	expect(new Fraction(1, 4).isGreaterThan(new Fraction(1, 8))).toBe(true)
})

test(`[rgpuh0]`, () => {
	expect(new Fraction(-1, 4).isGreaterThan(new Fraction(1, 8))).toBe(false)
})

test(`[rgpvc5]`, () => {
	expect(new Fraction(3).toThePowerOf(new Fraction(2)).toString()).toBe('9')
})

test(`[rgpytk]`, () => {
	expect(new Fraction(5).toThePowerOf(new Fraction(3)).toString()).toBe('125')
})

test(`[rgpw5t]`, () => {
	expect(() => new Fraction(25).toThePowerOf(new Fraction(1, 2))).toThrow(
		/implemented/i,
	)
})
