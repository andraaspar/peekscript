import { TBasicValues } from '../model/TBasicValues'
import { TEnvMap } from '../model/TEnvMap'
import { evaluateAst } from './evaluateAst'
import { parse } from './parse'

export function evaluate(
	code: string,
	env: TEnvMap,
	steps?: number,
): TBasicValues {
	const asts = parse(code)
	if (asts.length > 1) {
		throw new Error(`[rgekiu] Ambiguous code: ${code}`)
	}
	return evaluateAst(asts[0], env, steps)
}
