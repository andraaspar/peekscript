import { TExpression } from '../ast/TExpression'
import { evaluateAst } from '../fun/evaluateAst'
import { findIdentifiers } from '../fun/findIdentifiers'
import { parse } from '../fun/parse'
import { DEFAULT_STEPS } from '../model/constants'
import { TBasicValues } from '../model/TBasicValues'
import { TEnvMap } from '../model/TEnvMap'

export interface IState {
	code: string
	env: TEnvMap
	steps: number
	ast: TExpression | null | undefined
	identifiers: Set<string>
	result: TBasicValues
}

const DEFAULT_STATE: IState = {
	code: '',
	ast: undefined,
	identifiers: new Set<string>(),
	env: new Map(),
	steps: DEFAULT_STEPS,
	result: null,
}

export class CachedEvaluator {
	#state: IState = DEFAULT_STATE
	#parse: typeof parse
	#evaluateAst: typeof evaluateAst

	constructor(
		parseFunction: typeof parse = parse,
		evaluateAstFunction: typeof evaluateAst = evaluateAst,
	) {
		this.#parse = parseFunction
		this.#evaluateAst = evaluateAstFunction
	}

	evaluate(code: string, env: TEnvMap, steps = DEFAULT_STEPS): TBasicValues {
		const newState: Partial<IState> = {
			code,
			steps,
		}
		let mustEvaluate = false
		if (steps !== this.#state.steps) {
			mustEvaluate = true
		}
		if (code === this.#state.code) {
			mustEvaluate =
				mustEvaluate ||
				this.#envValuesChanged(this.#state.identifiers, this.#state.env, env)
			newState.ast = this.#state.ast
			newState.identifiers = this.#state.identifiers
		} else {
			mustEvaluate = true
			newState.ast = this.#parse(code)
			newState.identifiers = findIdentifiers(newState.ast)
		}
		if (mustEvaluate) {
			newState.result = this.#evaluateAst(newState.ast, env, steps)
		} else {
			newState.result = this.#state.result
		}
		newState.env = new Map()
		for (const identifier of newState.identifiers) {
			if (env.has(identifier)) {
				newState.env.set(identifier, env.get(identifier))
			}
		}
		this.#state = newState as IState
		return newState.result
	}

	#envValuesChanged(identifiers: Set<string>, env0: TEnvMap, env1: TEnvMap) {
		for (const identifier of identifiers) {
			if (!Object.is(env0.get(identifier), env1.get(identifier))) {
				return true
			}
		}
		return false
	}
}
