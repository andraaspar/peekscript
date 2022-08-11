import { TBasicValues } from '../model/TBasicValues'
import { TEnvMap } from '../model/TEnvMap'
import { evaluateAst } from './evaluateAst'
import { parse } from './parse'

export function evaluate(
	code: string,
	env: TEnvMap,
	steps?: number,
): TBasicValues {
	return evaluateAst(parse(code), env, steps)
}
