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
	expect(evaluate(`3`, envMapFrom({}))?.toString()).toBe('(3)')
})

test(`[rgeksv]`, () => {
	expect(evaluate(`3.1`, envMapFrom({}))?.toString()).toBe('(3+1/10)')
})

test(`[rgekx5]`, () => {
	expect(evaluate(`'hey'`, envMapFrom({}))).toBe('hey')
})

test(`[rgel03]`, () => {
	expect(evaluate(`a`, envMapFrom({ a: 3.1 }))?.toString()).toBe('(3+1/10)')
})

test(`[rjldq2]`, () => {
	expect(() => evaluate(`a`, envMapFrom({ a: NaN }))).toThrow(/nan/i)
})

test(`[rjldrq]`, () => {
	expect(() => evaluate(`a`, envMapFrom({ a: Infinity }))).toThrow(/infinity/i)
})

test(`[rgelim]`, () => {
	expect(() => evaluate(`fn`, envMapFrom({}))).toThrow(/defined/i)
})

test(`[rgelre]`, () => {
	expect(evaluate(`5+2`, envMapFrom({}))?.toString()).toBe('(7)')
})

test(`[rgelre]`, () => {
	expect(() => evaluate(`5+null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld34]`, () => {
	expect(() => evaluate(`null+null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld4k]`, () => {
	expect(() => evaluate(`true+false`, envMapFrom({}))).toThrow(/invalid/i)
})

test(`[rjld59]`, () => {
	expect(() => evaluate(`5-null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld5s]`, () => {
	expect(() => evaluate(`true-true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld7n]`, () => {
	expect(() => evaluate(`5*null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld7p]`, () => {
	expect(() => evaluate(`true*true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld8p]`, () => {
	expect(() => evaluate(`1/0`, envMapFrom({}))).toThrow(/zero/i)
})

test(`[rjld9o]`, () => {
	expect(() => evaluate(`5/null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjld9q]`, () => {
	expect(() => evaluate(`true/true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjldap]`, () => {
	expect(() => evaluate(`5%null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjldar]`, () => {
	expect(() => evaluate(`true%true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjlcoe]`, () => {
	expect(() => evaluate(`+true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjlcu2]`, () => {
	expect(() => evaluate(`-true`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgeluc]`, () => {
	expect(evaluate(`5-2`, envMapFrom({}))?.toString()).toBe('(3)')
})

test(`[rgelus]`, () => {
	expect(evaluate(`7*8`, envMapFrom({}))?.toString()).toBe('(56)')
})

test(`[rgelvi]`, () => {
	expect(evaluate(`1/2`, envMapFrom({}))?.toString()).toBe('(1/2)')
})

test(`[rgt4in]`, () => {
	expect(evaluate(`1/3*3==1`, envMapFrom({}))).toBe(true)
})

test(`[rgi40p]`, () => {
	expect(evaluate(`9%5`, envMapFrom({}))?.toString()).toBe('(4)')
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

test(`[rjldbw]`, () => {
	expect(evaluate(`null!=0`, envMapFrom({}))).toBe(true)
})

test(`[rgen4f]`, () => {
	expect(evaluate(`'1'==1`, envMapFrom({}))).toBe(false)
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
	expect(evaluate(`fn()`, envMapFrom({ fn: () => 3.1 }))?.toString()).toBe(
		'(3+1/10)',
	)
})

test(`[rgen6u]`, () => {
	expect(() =>
		evaluate([...Array(501).keys()].join('+'), envMapFrom({}))?.toString(),
	).toThrow(/limit/i)
})

test(`[rgepf8]`, () => {
	expect(evaluate(`(1+2)*3`, envMapFrom({}))?.toString()).toBe('(9)')
})

test(`[rggaza]`, () => {
	expect(evaluate(`'hey' + 'ho'`, envMapFrom({}))).toBe('heyho')
})

test(`[rgpfy2]`, () => {
	expect(evaluate(`'high' + 5`, envMapFrom({}))).toBe('high(5)')
})

test(`[rgpfy8]`, () => {
	expect(evaluate(`3+'cm'`, envMapFrom({}))).toBe('(3)cm')
})

test(`[rgpfz9]`, () => {
	expect(evaluate(`'Result: '+1+'cm'`, envMapFrom({}))).toBe('Result: (1)cm')
})

test(`[rgepnu]`, () => {
	let env: TEnvMap
	expect(
		evaluate(
			`filter(myArray, 'item % 2 == 0')`,
			(env = envMapFrom({
				myArray: JSON.stringify([0, 1, 2, 3, 4]),
				filter: (what, how) => {
					if (typeof what !== 'string' || typeof how !== 'string') {
						throw new Error(
							`Invalid args. Expected: string, string Got: ${typeof what}, ${typeof how}`,
						)
					}
					const ast = parse(how)
					const innerEnv: TEnvMap = new Map(env)
					const arr = JSON.parse(what)
					if (!Array.isArray(arr)) {
						throw new Error(`Expected array, got: ${what}`)
					}
					return JSON.stringify(
						(arr as number[]).filter((n) => {
							innerEnv.set('item', n)
							return evaluateAst(ast, innerEnv)
						}),
					)
				},
			})),
		),
	).toBe(`[0,2,4]`)
})

test(`[rggfgy]`, () => {
	expect(() => evaluate(`a`, envMapFrom({}))).toThrow(/defined/i)
})

test(`[rggfj1]`, () => {
	expect(() => evaluate(`a+b`, envMapFrom({ a: 5 }))).toThrow(/defined/i)
})

test(`[rggjtw]`, () => {
	expect(
		evaluate(`a?b:c`, envMapFrom({ a: true, b: 0, c: 1 }))?.toString(),
	).toBe('(0)')
})

test(`[rggjv8]`, () => {
	expect(
		evaluate(`a?b:c`, envMapFrom({ a: false, b: 0, c: 1 }))?.toString(),
	).toBe('(1)')
})

test(`[rgpf0t]`, () => {
	expect(evaluate(`+7`, envMapFrom({}))?.toString()).toBe('(7)')
})

test(`[rgpf7r]`, () => {
	expect(evaluate(`!true`, envMapFrom({}))).toBe(false)
})

test(`[rjlclt]`, () => {
	expect(() => evaluate(`!0`, envMapFrom({}))).toThrow(/boolean/i)
})

test(`[rgpf93]`, () => {
	expect(evaluate(`true && true`, envMapFrom({}))).toBe(true)
})

test(`[rgpf9s]`, () => {
	expect(evaluate(`true && false`, envMapFrom({}))).toBe(false)
})

test(`[rgpfa4]`, () => {
	expect(evaluate(`false || true`, envMapFrom({}))).toBe(true)
})

test(`[rgpfa6]`, () => {
	expect(evaluate(`false || false`, envMapFrom({}))).toBe(false)
})

test(`[rgpfbs]`, () => {
	expect(evaluate(`null ?? true`, envMapFrom({}))).toBe(true)
})

test(`[rgpfbs]`, () => {
	expect(evaluate(`false ?? true`, envMapFrom({}))).toBe(false)
})

test(`[rgpfdg]`, () => {
	expect(evaluate(`2**2`, envMapFrom({}))?.toString()).toBe('(4)')
})

test(`[rjlcx3]`, () => {
	expect(() => evaluate(`2**null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjlcy7]`, () => {
	expect(() => evaluate(`true**2`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgpfet]`, () => {
	expect(evaluate(`1<2`, envMapFrom({}))).toBe(true)
})

test(`[rgpff6]`, () => {
	expect(evaluate(`2<2`, envMapFrom({}))).toBe(false)
})

test(`[rjlddh]`, () => {
	expect(() => evaluate(`2<null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjlddk]`, () => {
	expect(() => evaluate(`true<2`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgpffh]`, () => {
	expect(evaluate(`2<=2`, envMapFrom({}))).toBe(true)
})

test(`[rgpffh]`, () => {
	expect(evaluate(`3<=2`, envMapFrom({}))).toBe(false)
})

test(`[rjldex]`, () => {
	expect(() => evaluate(`2<=null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjldez]`, () => {
	expect(() => evaluate(`true<=2`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgpfga]`, () => {
	expect(evaluate(`2>1`, envMapFrom({}))).toBe(true)
})

test(`[rgpfgm]`, () => {
	expect(evaluate(`2>2`, envMapFrom({}))).toBe(false)
})

test(`[rjldfi]`, () => {
	expect(() => evaluate(`2>null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjldfk]`, () => {
	expect(() => evaluate(`true>2`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgpfgz]`, () => {
	expect(evaluate(`2>=2`, envMapFrom({}))).toBe(true)
})

test(`[rgpfhc]`, () => {
	expect(evaluate(`2>=3`, envMapFrom({}))).toBe(false)
})

test(`[rjldfr]`, () => {
	expect(() => evaluate(`2>=null`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rjldfu]`, () => {
	expect(() => evaluate(`true>=2`, envMapFrom({}))).toThrow(/rational/i)
})

test(`[rgpfif]`, () => {
	expect(() => evaluate(`fn()`, envMapFrom({}))).toThrow(/defined/i)
})

test(`[rgpfk4]`, () => {
	expect(() => evaluate(`fn()`, envMapFrom({ fn: 1 }))).toThrow(/invoke/i)
})

test(`[rgpfll]`, () => {
	expect(evaluate(`a`, envMapFrom({ a: [] as any }))).toBe(null)
})

test(`[rgpfp3]`, () => {
	expect(() => evaluate(`(`, envMapFrom({}))).toThrow(/parse/i)
})
