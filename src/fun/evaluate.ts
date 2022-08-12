import { TEnvMap } from '../model/TEnvMap'
import { TOutValues } from '../model/TOutValues'
import { evaluateAst } from './evaluateAst'
import { parse } from './parse'

export function evaluate(
	code: string,
	env: TEnvMap,
	steps?: number,
): TOutValues {
	return evaluateAst(parse(code), env, steps)
}
