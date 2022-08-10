import { TEnv } from '../model/TEnv'
import { TEnvMap } from '../model/TEnvMap'
import { evaluate } from './evaluate'
import { evaluateAst } from './evaluateAst'
import { parse } from './parse'

function envMapFrom(o: TEnv): TEnvMap {
	return new Map(Object.entries(o))
}

test(`[rgekuw]`, () => {
	expect(() => evaluate(`undefined`, envMapFrom({}))).toThrow(/defined/i)
})

test(`[rgekt8]`, () => {
	expect(evaluate(`null`, envMapFrom({}))).toBe(null)
})

test(`[rgektm]`, () => {
	expect(evaluate(`true`, envMapFrom({}))).toBe(true)
})

test(`[rgektx]`, () => {
	expect(evaluate(`false`, envMapFrom({}))).toBe(false)
})

test(`[rgekll]`, () => {
	expect(evaluate(`3`, envMapFrom({}))).toBe(3)
})

test(`[rgeksv]`, () => {
	expect(evaluate(`3.14`, envMapFrom({}))).toBe(3.14)
})

test(`[rgekx5]`, () => {
	expect(evaluate(`'hey'`, envMapFrom({}))).toBe('hey')
})

test(`[rgel03]`, () => {
	expect(evaluate(`a`, envMapFrom({ a: 3.14 }))).toBe(3.14)
})

test(`[rgelim]`, () => {
	expect(() => evaluate(`fn`, envMapFrom({}))).toThrow(/defined/i)
})

test(`[rgelre]`, () => {
	expect(evaluate(`5+2`, envMapFrom({}))).toBe(7)
})

test(`[rgeluc]`, () => {
	expect(evaluate(`5-2`, envMapFrom({}))).toBe(3)
})

test(`[rgelus]`, () => {
	expect(evaluate(`7*8`, envMapFrom({}))).toBe(56)
})

test(`[rgelvi]`, () => {
	expect(evaluate(`1/2`, envMapFrom({}))).toBe(0.5)
})

test(`[rgelw3]`, () => {
	expect(evaluate(`9%5`, envMapFrom({}))).toBe(4)
})

test(`[rgelw3]`, () => {
	expect(evaluate(`1==1`, envMapFrom({}))).toBe(true)
})

test(`[rgelxp]`, () => {
	expect(evaluate(`1==1`, envMapFrom({}))).toBe(true)
})

test(`[rgen4d]`, () => {
	expect(evaluate(`1!=2`, envMapFrom({}))).toBe(true)
})

test(`[rgen4f]`, () => {
	expect(evaluate(`'1'==1`, envMapFrom({}))).toBe(true)
})

test(`[rgen5t]`, () => {
	expect(evaluate(`'1'===1`, envMapFrom({}))).toBe(false)
})

test(`[rgel39]`, () => {
	expect(() => evaluate(`fn`, envMapFrom({ fn: () => {} }))).toThrow(
		/function as value/i,
	)
})

test(`[rgelka]`, () => {
	expect(evaluate(`fn()`, envMapFrom({ fn: () => {} }))).toBe(null)
})

test(`[rgelkl]`, () => {
	expect(evaluate(`fn()`, envMapFrom({ fn: () => 3.14 }))).toBe(3.14)
})

test(`[rgen6u]`, () => {
	expect(() =>
		evaluate([...Array(501).keys()].join('+'), envMapFrom({})),
	).toThrow(/limit/i)
})

test(`[rgeo8q]`, () => {
	expect(
		evaluate(`add(1,2)`, envMapFrom({ add: (a: any, b: any) => a + b })),
	).toBe(3)
})

test(`[rgepf8]`, () => {
	expect(evaluate(`(1+2)*3`, envMapFrom({}))).toBe(9)
})

test(`[rgepnu]`, () => {
	expect(
		evaluate(
			`filter(myArray, 'item % 2 == 0')`,
			envMapFrom({
				myArray: JSON.stringify([0, 1, 2, 3, 4]),
				filter: (what, how) => {
					if (typeof what !== 'string' || typeof how !== 'string') {
						throw new Error(
							`Invalid args. Expected: string, string Got: ${typeof what} ${typeof how}`,
						)
					}
					const ast = parse(how)[0]
					const env: TEnvMap = new Map()
					const arr = JSON.parse(what)
					if (!Array.isArray(arr)) {
						throw new Error(`Expected array, got: ${what}`)
					}
					return JSON.stringify(
						(arr as number[]).filter((n) => {
							env.set('item', n)
							return evaluateAst(ast, env)
						}),
					)
				},
			}),
		),
	).toBe(`[0,2,4]`)
})
