import { Decimal } from './Decimal'

test(`[rgta0o]`, () => {
	const it = new Decimal(100n, 0)
	expect(it.value).toBe(100n)
	expect(it.decimalPlaces).toBe(0)
	expect(it.toFixed()).toBe('100')
	expect(it.toString()).toBe('100')
})

test(`[rgta0o]`, () => {
	const it = new Decimal(123n, 2)
	expect(it.value).toBe(123n)
	expect(it.decimalPlaces).toBe(2)
	expect(it.toFixed()).toBe('1.23')
	expect(it.toString()).toBe('1.23')
})

test(`[rgtbdf]`, () => {
	const it = new Decimal(123n, 2).toDecimal(1)
	expect(it.value).toBe(12n)
	expect(it.decimalPlaces).toBe(1)
	expect(it.toFixed(2)).toBe('1.20')
	expect(it.toString()).toBe('1.2')
})

test(`[rgtc9f]`, () => {
	const it = new Decimal(125n, 2).toDecimal(1)
	expect(it.value).toBe(13n)
	expect(it.decimalPlaces).toBe(1)
	expect(it.toFixed(1)).toBe('1.3')
	expect(it.toString()).toBe('1.3')
})

test(`[rgtc7f]`, () => {
	const it = new Decimal(295n, 2).toDecimal(1)
	expect(it.value).toBe(3n)
	expect(it.decimalPlaces).toBe(0)
	expect(it.toFixed(1)).toBe('3.0')
	expect(it.toString()).toBe('3')
})

test(`[rgtip8]`, () => {
	const it = new Decimal(666n, 3).toDecimal(2)
	expect(it.value).toBe(67n)
	expect(it.decimalPlaces).toBe(2)
	expect(it.toFixed(3)).toBe('0.670')
	expect(it.toString()).toBe('0.67')
})

test(`[rh890b]`, () => {
	const it = new Decimal(12345678911234567891n, 20).toDecimal(10)
	expect(it.value).toBe(1234567891n)
	expect(it.decimalPlaces).toBe(10)
	expect(it.toFixed(11)).toBe('0.12345678910')
	expect(it.toString()).toBe('0.1234567891')
})

test(`[rgtdaw]`, () => {
	const it = new Decimal(BigInt(Number.MAX_SAFE_INTEGER) + 2n, 0)
	expect(it.toString()).toBe('9007199254740993')
	expect(() => it.toNumber()).toThrow(/conver/i)
})

test(`[rgtdih]`, () => {
	const it = new Decimal(BigInt(Number.MIN_SAFE_INTEGER) - 2n, 0)
	expect(it.toString()).toBe('-9007199254740993')
	expect(() => it.toNumber()).toThrow(/conver/i)
})

test(`[rgteob]`, () => {
	expect(new Decimal(123n, 2).toNumber()).toBe(1.23)
})

test(`[rgth1r]`, () => {
	expect(Decimal.fromString('0.123').toString()).toBe('0.123')
})

test(`[rgthdd]`, () => {
	expect(Decimal.fromString('-123.456').toString()).toBe('-123.456')
})

test(`[rgthei]`, () => {
	expect(Decimal.fromString('-1.23456e+2').toString()).toBe('-123.456')
})
