import JSBI from 'jsbi'
import { Rational } from './Rational'

test(`[rgph47]`, () => {
	expect(new Rational(JSBI.BigInt(1), JSBI.BigInt(3)).toFixed(3)).toBe('0.333')
})

test(`[rgphbz]`, () => {
	expect(new Rational(JSBI.BigInt(2), JSBI.BigInt(3)).toFixed(3)).toBe('0.667')
})

test(`[rgph89]`, () => {
	expect(new Rational(JSBI.BigInt(5), JSBI.BigInt(100)).toFixed(3)).toBe(
		'0.050',
	)
})

test(`[rgpij1]`, () => {
	expect(new Rational(JSBI.BigInt(-1), JSBI.BigInt(20)).toFixed(3)).toBe(
		'-0.050',
	)
})

test(`[rgpkhq]`, () => {
	expect(new Rational(JSBI.BigInt(2), JSBI.BigInt(8)).toString()).toBe('1/4')
})

test(`[rgplld]`, () => {
	expect(new Rational(JSBI.BigInt(-2), JSBI.BigInt(8)).toString()).toBe('-1/4')
})

test(`[rgpllw]`, () => {
	expect(new Rational(JSBI.BigInt(2), JSBI.BigInt(-8)).toString()).toBe('-1/4')
})

test(`[rgplmb]`, () => {
	expect(new Rational(JSBI.BigInt(-2), JSBI.BigInt(-8)).toString()).toBe('1/4')
})

test(`[rgplny]`, () => {
	expect(new Rational(JSBI.BigInt(714), JSBI.BigInt(85)).toString()).toBe(
		'42/5',
	)
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
	expect(() => new Rational(JSBI.BigInt(1), JSBI.BigInt(0))).toThrow(
		/division/i,
	)
})

test(`[rgppzs]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(4)).isEqualTo(
			Rational.fromNumber(0.25),
		),
	).toBe(true)
})

test(`[rgpq2d]`, () => {
	expect(new Rational(JSBI.BigInt(3), JSBI.BigInt(2)).toFixed(0)).toBe('2')
})

test(`[rgpqh0]`, () => {
	expect(new Rational(JSBI.BigInt(-3), JSBI.BigInt(2)).toFixed(0)).toBe('-2')
})

test(`[rgprdd]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(4))
			.plus(new Rational(JSBI.BigInt(2), JSBI.BigInt(8)))
			.toString(),
	).toBe('1/2')
})

test(`[rgprf3]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(4))
			.plus(new Rational(JSBI.BigInt(-3), JSBI.BigInt(8)))
			.toString(),
	).toBe('-1/8')
})

test(`[rgprgb]`, () => {
	expect(
		new Rational(JSBI.BigInt(-1), JSBI.BigInt(4))
			.plus(new Rational(JSBI.BigInt(3), JSBI.BigInt(8)))
			.toString(),
	).toBe('1/8')
})

test(`[rgprgx]`, () => {
	expect(
		new Rational(JSBI.BigInt(-1), JSBI.BigInt(4))
			.plus(new Rational(JSBI.BigInt(-2), JSBI.BigInt(8)))
			.toString(),
	).toBe('-1/2')
})

test(`[rgprie]`, () => {
	expect(
		Rational.fromNumber(3.14).plus(Rational.fromNumber(3.14)).toFixed(2),
	).toBe('6.28')
})

test(`[rgprxn]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.minus(new Rational(JSBI.BigInt(1), JSBI.BigInt(4)))
			.toString(),
	).toBe('1/4')
})

test(`[rgps09]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.minus(new Rational(JSBI.BigInt(-1), JSBI.BigInt(4)))
			.toString(),
	).toBe('3/4')
})

test(`[rgps0b]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.multipliedBy(new Rational(JSBI.BigInt(1), JSBI.BigInt(2)))
			.toString(),
	).toBe('1/4')
})

test(`[rgps1e]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.multipliedBy(new Rational(JSBI.BigInt(-1), JSBI.BigInt(2)))
			.toString(),
	).toBe('-1/4')
})

test(`[rgps1v]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.dividedBy(new Rational(JSBI.BigInt(1), JSBI.BigInt(4)))
			.toString(),
	).toBe('2')
})

test(`[rgpsJSBI.BigInt(4)]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2))
			.dividedBy(new Rational(JSBI.BigInt(-1), JSBI.BigInt(4)))
			.toString(),
	).toBe('-2')
})

test(`[rgps64]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(8)).isLessThan(
			new Rational(JSBI.BigInt(1), JSBI.BigInt(4)),
		),
	).toBe(true)
})

test(`[rgpuek]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(8)).isLessThan(
			new Rational(JSBI.BigInt(-1), JSBI.BigInt(4)),
		),
	).toBe(false)
})

test(`[rgpufw]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(4)).isGreaterThan(
			new Rational(JSBI.BigInt(1), JSBI.BigInt(8)),
		),
	).toBe(true)
})

test(`[rgpuh0]`, () => {
	expect(
		new Rational(JSBI.BigInt(-1), JSBI.BigInt(4)).isGreaterThan(
			new Rational(JSBI.BigInt(1), JSBI.BigInt(8)),
		),
	).toBe(false)
})

test(`[rgpvc5]`, () => {
	expect(
		new Rational(JSBI.BigInt(3))
			.toThePowerOf(new Rational(JSBI.BigInt(2)))
			.toString(),
	).toBe('9')
})

test(`[rgpytk]`, () => {
	expect(
		new Rational(JSBI.BigInt(5))
			.toThePowerOf(new Rational(JSBI.BigInt(3)))
			.toString(),
	).toBe('125')
})

test(`[rgsz02]`, () => {
	expect(
		new Rational(JSBI.BigInt(2), JSBI.BigInt(3))
			.toThePowerOf(new Rational(JSBI.BigInt(2)))
			.toString(),
	).toBe('4/9')
})

test(`[rgsz2d]`, () => {
	expect(
		new Rational(JSBI.BigInt(5))
			.toThePowerOf(new Rational(JSBI.BigInt(-2)))
			.toString(),
	).toBe('1/25')
})

test(`[rgszbw]`, () => {
	expect(
		new Rational(JSBI.BigInt(5))
			.toThePowerOf(new Rational(JSBI.BigInt(0)))
			.toString(),
	).toBe('1')
})

test(`[rgszbw]`, () => {
	expect(
		new Rational(JSBI.BigInt(5))
			.toThePowerOf(new Rational(JSBI.BigInt(1)))
			.toString(),
	).toBe('5')
})

test(`[rgpw5t]`, () => {
	expect(() =>
		new Rational(JSBI.BigInt(25)).toThePowerOf(
			new Rational(JSBI.BigInt(1), JSBI.BigInt(2)),
		),
	).toThrow(/implemented/i)
})

test(`[rgt403]`, () => {
	expect(
		new Rational(JSBI.BigInt(10))
			.remainder(new Rational(JSBI.BigInt(7)))
			.toString(),
	).toBe('3')
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

test(`[rjlbvg]`, () => {
	expect(Rational.fromString('3.14').toDecimalString(3)).toBe('3.14')
})

test(`[rjlbxc]`, () => {
	expect(Rational.fromString('3e+3').toDecimalString(3)).toBe('3000')
})

test(`[rjlbxc]`, () => {
	expect(Rational.fromString('1e-3').toDecimalString(3)).toBe('0.001')
})

test(`[rje83c]`, () => {
	expect(
		new Rational(JSBI.BigInt(0), JSBI.BigInt(1), JSBI.BigInt(-1)).isEqualTo(
			Rational.ZERO,
		),
	).toBe(true)
})

test(`[rjlc08]`, () => {
	expect(
		new Rational(JSBI.BigInt(1), JSBI.BigInt(2), JSBI.BigInt(1)).toNumber(3),
	).toBe(0.5)
})

test(`[rjlc3p]`, () => {
	expect(() =>
		new Rational(JSBI.BigInt(1), JSBI.BigInt(3), JSBI.BigInt(1)).toNumber(3),
	).toThrow(/convert/)
})
