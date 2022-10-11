import { TExpression } from '../ast/TExpression'
import { parse } from './parse'

function unparse(ast: TExpression | null | undefined): string {
	if (ast == null) {
		return ''
	}
	switch (ast.type) {
		case 'funcall':
			return `→${ast.identifier}(${ast.params
				.map((param) => unparse(param))
				.join(', ')})←`
		case 'unary':
			return `→${ast.op.value}${unparse(ast.param)}←`
		case 'equality':
		case 'sum':
		case 'product':
		case 'coalesce':
		case 'or':
		case 'and':
		case 'exponent':
			return `→${unparse(ast.params[0])} ${ast.op.value} ${unparse(
				ast.params[1],
			)}←`
		case 'grouping':
			return `(${unparse(ast.expression)})`
		case 'ternary':
			return `→${unparse(ast.check)} ? ${unparse(ast.then)} : ${unparse(
				ast.else,
			)}←`
		case 'identifier':
		case 'keyword':
		case 'string':
		case 'number':
			return ast.text
	}
	return `►Unknown:${JSON.stringify(ast)}◄`
}

// primitives

test(`[rg1dz1]`, () => {
	expect(unparse(parse(`null`))).toBe(`null`)
})

test(`[rg1dyg]`, () => {
	expect(unparse(parse(`true`))).toBe(`true`)
})

test(`[rg1dys]`, () => {
	expect(unparse(parse(`false`))).toBe(`false`)
})

test(`[rg1ezl]`, () => {
	expect(unparse(parse(`id`))).toBe(`id`)
})

test(`[rg1f0g]`, () => {
	expect(unparse(parse(`_some_id`))).toBe(`_some_id`)
})

test(`[rg1f0g]`, () => {
	expect(unparse(parse(`someId2`))).toBe(`someId2`)
})

// string

test(`[rg1e3a]`, () => {
	expect(unparse(parse(`''`))).toBe(`''`)
})

test(`[rg1e3y]`, () => {
	expect(unparse(parse(`'árvíztűrő tükörfúrógép'`))).toBe(
		`'árvíztűrő tükörfúrógép'`,
	)
})

test(`[rg1e5m]`, () => {
	expect(unparse(parse(String.raw`'\''`))).toBe(String.raw`'\''`)
})

test(`[rg1e8p] Literal newline:`, () => {
	expect(unparse(parse(`'\n'`))).toBe(`'\n'`)
})

test(`[rjjbqs] Escaped newline:`, () => {
	expect(unparse(parse(String.raw`'\n'`))).toBe(String.raw`'\n'`)
})

test(`[rjjbp8]`, () => {
	expect(unparse(parse(String.raw`'\r'`))).toBe(String.raw`'\r'`)
})

test(`[rjjbsu]`, () => {
	expect(unparse(parse(String.raw`'\t'`))).toBe(String.raw`'\t'`)
})

test(`[rjjbz2]`, () => {
	expect(unparse(parse(String.raw`'foo\tbar'`))).toBe(String.raw`'foo\tbar'`)
})

test(`[rjjbtn]`, () => {
	expect(unparse(parse(String.raw`'\u00a0'`))).toBe(String.raw`'\u00a0'`)
})

test(`[rjjbzl]`, () => {
	expect(unparse(parse(String.raw`'foo\u00a0bar'`))).toBe(
		String.raw`'foo\u00a0bar'`,
	)
})

// number

test(`[rg181v]`, () => {
	expect(unparse(parse(`5`))).toBe(`5`)
})

test(`[rg1ecu]`, () => {
	expect(unparse(parse(`3.14`))).toBe(`3.14`)
})

test(`[rje2b0]`, () => {
	expect(unparse(parse(`3.14e+1`))).toBe(`3.14e+1`)
})

// ternary

test(`[rg1j1b]`, () => {
	expect(unparse(parse(`1?2:3`))).toBe(`→1 ? 2 : 3←`)
})

// orish

test(`[rg1jv6]`, () => {
	expect(unparse(parse(`1||2`))).toBe(`→1 || 2←`)
})

test(`[rg1jvp]`, () => {
	expect(unparse(parse(`1??2`))).toBe(`→1 ?? 2←`)
})

// and

test(`[rg1kkg]`, () => {
	expect(unparse(parse(`1&&2`))).toBe(`→1 && 2←`)
})

// equality

test(`[rg1edv]`, () => {
	expect(unparse(parse(`1 == 1`))).toBe(`→1 == 1←`)
})

test(`[rg1edv]`, () => {
	expect(unparse(parse(`1 != 1`))).toBe(`→1 != 1←`)
})

test(`[rg1ei0]`, () => {
	expect(unparse(parse(`1 <= 1`))).toBe(`→1 <= 1←`)
})

test(`[rg1ehf]`, () => {
	expect(unparse(parse(`1 < 1`))).toBe(`→1 < 1←`)
})

test(`[rg1eif]`, () => {
	expect(unparse(parse(`1 >= 1`))).toBe(`→1 >= 1←`)
})

test(`[rg1ehw]`, () => {
	expect(unparse(parse(`1 > 1`))).toBe(`→1 > 1←`)
})

// sum

test(`[rg1dta]`, () => {
	expect(unparse(parse(`5+3`))).toBe(`→5 + 3←`)
})

test(`[rg1dx7]`, () => {
	expect(unparse(parse(`5-3`))).toBe(`→5 - 3←`)
})

test(`[rggm8j]`, () => {
	expect(unparse(parse(`+3`))).toBe(`→+3←`)
})

test(`[rggmj1]`, () => {
	expect(unparse(parse(`-3`))).toBe(`→-3←`)
})

test(`[rggmjl]`, () => {
	expect(() => parse(`++3`)).toThrow(/syntax/i)
})

test(`[rggmoa]`, () => {
	expect(unparse(parse(`4+-5`))).toBe(`→4 + →-5←←`)
})

// product

test(`[rg1dwe]`, () => {
	expect(unparse(parse(`7*8`))).toBe(`→7 * 8←`)
})

test(`[rg1dwy]`, () => {
	expect(unparse(parse(`7/8`))).toBe(`→7 / 8←`)
})

test(`[rg1poa]`, () => {
	expect(unparse(parse(`7%8`))).toBe(`→7 % 8←`)
})

// exponent

test(`[rg1dy7]`, () => {
	expect(unparse(parse(`7**8`))).toBe(`→7 ** 8←`)
})

// unary

test(`[rg1a3q]`, () => {
	expect(unparse(parse(`-5`))).toBe(`→-5←`)
})

// parens

test(`[rg1drz]`, () => {
	expect(unparse(parse(`(5)`))).toBe(`(5)`)
})

// funcall

test(`[rg1enp]`, () => {
	expect(unparse(parse(`fn()`))).toBe(`→fn()←`)
})

test(`[rg1eyi]`, () => {
	expect(unparse(parse(`fn(   )`))).toBe(`→fn()←`)
})

test(`[rg1et1]`, () => {
	expect(unparse(parse(`fn(0)`))).toBe(`→fn(0)←`)
})

test(`[rg1etr]`, () => {
	expect(unparse(parse(`fn(0,1)`))).toBe(`→fn(0, 1)←`)
})

test(`[rg1euy]`, () => {
	expect(unparse(parse(`fn( 0 , 1 , 2 )`))).toBe(`→fn(0, 1, 2)←`)
})

test(`[rggn1t]`, () => {
	expect(unparse(parse(`a(b(c))`))).toBe(`→a(→b(c)←)←`)
})

// whitespace

test(`[rg1f3s]`, () => {
	expect(unparse(parse(``))).toBe(``)
})

test(`[rg1fcv]`, () => {
	expect(unparse(parse(` `))).toBe(``)
})

test(`[rg1fcx]`, () => {
	expect(unparse(parse(`  `))).toBe(``)
})

test(`[rg1fcz]`, () => {
	expect(unparse(parse(` 1 `))).toBe(`1`)
})

// operator precedence

test(`[rg1j2g]`, () => {
	expect(unparse(parse(`1?2?3:4:5`))).toBe(`→1 ? →2 ? 3 : 4← : 5←`)
})

test(`[rg1kn7]`, () => {
	expect(unparse(parse(`1?2:3?4:5`))).toBe(`→1 ? 2 : →3 ? 4 : 5←←`)
})

test(`[rg1l77]`, () => {
	expect(unparse(parse(`1??2??3`))).toBe(`→→1 ?? 2← ?? 3←`)
})

test(`[rg1l5k]`, () => {
	expect(() => parse(`1??2||3`)).toThrow(/syntax/i)
})

test(`[rgJSBI.BigInt(1)rb]`, () => {
	expect(() => parse(`1??2&&3`)).toThrow(/syntax/i)
})

test(`[rgJSBI.BigInt(1)q3]`, () => {
	expect(() => parse(`1||2??3`)).toThrow(/syntax/i)
})

test(`[rgJSBI.BigInt(1)rx]`, () => {
	expect(() => parse(`1&&2??3`)).toThrow(/syntax/i)
})

test(`[rg1oxh]`, () => {
	expect(unparse(parse(`1||2||3`))).toBe(`→→1 || 2← || 3←`)
})

test(`[rg1ov3]`, () => {
	expect(unparse(parse(`1||2&&3`))).toBe(`→1 || →2 && 3←←`)
})

test(`[rg1oxj]`, () => {
	expect(unparse(parse(`1&&2||3`))).toBe(`→→1 && 2← || 3←`)
})

test(`[rg1p28]`, () => {
	expect(unparse(parse(`1&&2&&3`))).toBe(`→→1 && 2← && 3←`)
})

test(`[rg1jdj]`, () => {
	expect(unparse(parse(`1??2?3||4:5&&6`))).toBe(
		`→→1 ?? 2← ? →3 || 4← : →5 && 6←←`,
	)
})

test(`[rg1g2z]`, () => {
	expect(() => parse(`1==2==3`)).toThrow(/syntax/i)
})

test(`[rg1gef]`, () => {
	expect(() => parse(`1<2>3`)).toThrow(/syntax/i)
})

test(`[rg1p45]`, () => {
	expect(unparse(parse(`1==2&&3`))).toBe(`→→1 == 2← && 3←`)
})

test(`[rg1p3j]`, () => {
	expect(unparse(parse(`1&&2==3`))).toBe(`→1 && →2 == 3←←`)
})

test(`[rg1g7q]`, () => {
	expect(unparse(parse(`1+2-3`))).toBe(`→→1 + 2← - 3←`)
})

test(`[rg1g92]`, () => {
	expect(unparse(parse(`1-2+3`))).toBe(`→→1 - 2← + 3←`)
})

test(`[rg1fgf]`, () => {
	expect(unparse(parse(`1+2==3`))).toBe(`→→1 + 2← == 3←`)
})

test(`[rg1gbx]`, () => {
	expect(unparse(parse(`1==2+3`))).toBe(`→1 == →2 + 3←←`)
})

test(`[rg1ga3]`, () => {
	expect(unparse(parse(`1*2/3`))).toBe(`→→1 * 2← / 3←`)
})

test(`[rg1ga6]`, () => {
	expect(unparse(parse(`1/2*3`))).toBe(`→→1 / 2← * 3←`)
})

test(`[rg1gd2]`, () => {
	expect(unparse(parse(`1+2*3`))).toBe(`→1 + →2 * 3←←`)
})

test(`[rg1ghe]`, () => {
	expect(unparse(parse(`1*2+3`))).toBe(`→→1 * 2← + 3←`)
})

test(`[rg1hfe]`, () => {
	expect(unparse(parse(`1*2+3`))).toBe(`→→1 * 2← + 3←`)
})

test(`[rg1hkj]`, () => {
	expect(unparse(parse(`1**2**3`))).toBe(`→1 ** →2 ** 3←←`)
})

test(`[rg1hhn]`, () => {
	expect(unparse(parse(`1**2*3`))).toBe(`→→1 ** 2← * 3←`)
})

test(`[rg1hkh]`, () => {
	expect(unparse(parse(`1*2**3`))).toBe(`→1 * →2 ** 3←←`)
})

test(`[rggmqm]`, () => {
	expect(unparse(parse(`!true`))).toBe(`→!true←`)
})

test(`[rggmqj]`, () => {
	expect(unparse(parse(`!!true`))).toBe(`→!→!true←←`)
})

test(`[rg1hny]`, () => {
	expect(unparse(parse(`!-1`))).toBe(`→!→-1←←`)
})

test(`[rg1i6h]`, () => {
	expect(unparse(parse(`1**-2`))).toBe(`→1 ** →-2←←`)
})

test(`[rg1ido]`, () => {
	expect(() => parse(`-1**2`)).toThrow(/syntax/i)
})

test(`[rg1ik8]`, () => {
	expect(unparse(parse(`!fn()`))).toBe(`→!→fn()←←`)
})

// Errors

test(`[rggeyp]`, () => {
	expect(() => unparse(parse(`()`))).toThrow(/syntax/i)
})
