import { evaluateAst } from '../fun/evaluateAst'
import { parse } from '../fun/parse'
import { CachedEvaluator } from './CachedEvaluator'

function makeCachedEvaluatorWithCounts() {
	const counts = {
		parseCount: 0,
		evaluateCount: 0,
	}
	const evaluator = new CachedEvaluator(
		(code) => {
			counts.parseCount++
			return parse(code)
		},
		(ast, env, steps) => {
			counts.evaluateCount++
			return evaluateAst(ast, env, steps)
		},
	)
	return {
		counts,
		evaluator,
	}
}

test(`[rggc6a] Cache hit with env.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const code = `a+b`
	const result0 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 5, b: 3, c: 0 })),
	)
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	const result1 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 5, b: 3, c: 1 })),
	)
	expect(counts.parseCount).toBe(1) // No parse: no code change
	expect(counts.evaluateCount).toBe(1) // No eval: no relevant env change
	expect(result1).toBe(8) // From cache
})

test(`[rgge5l] Cache hit no env.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const code = `5+3`
	const result0 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 0 })), // Passing an env we do not use
	)
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	const result1 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 1 })), // Passing a different env we do not use
	)
	expect(counts.parseCount).toBe(1) // No parse: no code change
	expect(counts.evaluateCount).toBe(1) // No eval: no relevant env change
	expect(result1).toBe(8)
})

test(`[rggdh3] Changed env value, same code.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const code = `a+b`
	const result0 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 5, b: 3 })),
	)
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	const result1 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 5, b: 4 })), // b changed
	)
	expect(counts.parseCount).toBe(1) // No parse: no code change
	expect(counts.evaluateCount).toBe(2) // Eval: relevant env changed
	expect(result1).toBe(9)
	const result2 = evaluator.evaluate(
		code,
		new Map(Object.entries({ a: 5, b: 3 })), // b reverted
	)
	expect(counts.parseCount).toBe(1) // No parse: no code change
	expect(counts.evaluateCount).toBe(3) // Eval: relevant env changed
	expect(result2).toBe(8)
})

test(`[rggdj3] Changed code, same env.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const env = { a: 5, b: 3 }
	const result0 = evaluator.evaluate(`a+b`, new Map(Object.entries(env)))
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	const result1 = evaluator.evaluate(`b+a`, new Map(Object.entries(env)))
	expect(counts.parseCount).toBe(2) // Parse: code changed
	expect(counts.evaluateCount).toBe(2) // Eval: code changed
	expect(result1).toBe(8)
	const result2 = evaluator.evaluate(`a+b`, new Map(Object.entries(env)))
	expect(counts.parseCount).toBe(3) // Parse: code changed
	expect(counts.evaluateCount).toBe(3) // Eval: code changed
	expect(result2).toBe(8)
})

test(`[rggdlk] Changed steps, same code, same env.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const code = `a+b`
	const env = { a: 5, b: 3 }
	const result0 = evaluator.evaluate(code, new Map(Object.entries(env)), 1000)
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	const result1 = evaluator.evaluate(code, new Map(Object.entries(env)), 2000)
	expect(counts.parseCount).toBe(1) // No parse: code unchanged
	expect(counts.evaluateCount).toBe(2) // Eval: steps changed
	expect(result1).toBe(8)
	const result2 = evaluator.evaluate(code, new Map(Object.entries(env)), 1000)
	expect(counts.parseCount).toBe(1) // No parse: code unchanged
	expect(counts.evaluateCount).toBe(3) // Eval: steps changed
	expect(result2).toBe(8)
})

test(`[rgges2] Syntax error.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const env = { a: 5, b: 3 }
	const result0 = evaluator.evaluate(`a+b`, new Map(Object.entries(env)))
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	expect(() => evaluator.evaluate(`()`, new Map(Object.entries(env)))).toThrow(
		/syntax/i,
	)
	expect(counts.parseCount).toBe(2) // Parse: this is counted before it throws
	expect(counts.evaluateCount).toBe(1) // No eval: throw prevented
	const result2 = evaluator.evaluate(`a+b`, new Map(Object.entries(env)))
	expect(counts.parseCount).toBe(2) // No parse: last parse failed, therefore the state from before is used
	expect(counts.evaluateCount).toBe(1) // No eval: this state matches the one from before the error
	expect(result2).toBe(8)
})

test(`[rggf8r] Variable not defined error.`, () => {
	const { counts, evaluator } = makeCachedEvaluatorWithCounts()
	const result0 = evaluator.evaluate(
		`a+b`,
		new Map(Object.entries({ a: 5, b: 3 })),
	)
	expect(counts.parseCount).toBe(1)
	expect(counts.evaluateCount).toBe(1)
	expect(result0).toBe(8)
	expect(() =>
		evaluator.evaluate(`a+b`, new Map(Object.entries({ a: 5 }))),
	).toThrow(/defined/i)
	expect(counts.parseCount).toBe(1) // No parse: same code
	expect(counts.evaluateCount).toBe(2) // Eval: env changed
	const result1 = evaluator.evaluate(
		`a+b`,
		new Map(Object.entries({ a: 5, b: 3 })),
	)
	expect(counts.parseCount).toBe(1) // No parse: same code
	expect(counts.evaluateCount).toBe(2) // No eval: matches state from before the error
	expect(result1).toBe(8)
})
