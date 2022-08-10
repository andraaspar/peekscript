import { TExpression } from '../ast/TExpression'
import { TBasicValues } from '../model/TBasicValues'
import { TEnvMap } from '../model/TEnvMap'
import { makeEvaluateAstGenerator } from './makeEvaluateAstGenerator'

export function evaluateAst(
	ast: TExpression,
	env: TEnvMap,
	steps = 1000,
): TBasicValues {
	const gen = makeEvaluateAstGenerator(ast, env)
	for (let step = 0; step < steps; step++) {
		const value = gen.next()
		if (value.done) {
			return value.value
		}
	}
	throw new Error(`[rgemve] Exceeded step limit.`)
}
