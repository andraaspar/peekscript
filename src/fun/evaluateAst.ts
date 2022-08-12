import { TExpression } from '../ast/TExpression'
import { DEFAULT_STEPS } from '../model/constants'
import { TEnvMap } from '../model/TEnvMap'
import { TOutValues } from '../model/TOutValues'
import { makeEvaluateAstGenerator } from './makeEvaluateAstGenerator'

export function evaluateAst(
	ast: TExpression | null | undefined,
	env: TEnvMap,
	steps = DEFAULT_STEPS,
): TOutValues {
	if (ast == null) {
		return null
	}
	const gen = makeEvaluateAstGenerator(ast, env)
	for (let step = 0; step < steps; step++) {
		const value = gen.next()
		if (value.done) {
			return value.value
		}
	}
	throw new Error(`[rgemve] Exceeded step limit.`)
}
