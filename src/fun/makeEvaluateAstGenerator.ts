import { TExpression } from '../ast/TExpression'
import { TBasicValues } from '../model/TBasicValues'
import { TEnvMap } from '../model/TEnvMap'

export function* makeEvaluateAstGenerator(
	ast: TExpression,
	env: TEnvMap,
): Generator<void, TBasicValues, never> {
	yield
	switch (ast.type) {
		case 'keyword':
			return ast.value
		case 'number':
			return parseFloat(ast.value)
		case 'string':
			return ast.value
		case 'unary': {
			const r0 = yield* makeEvaluateAstGenerator(ast.param, env)
			return !r0
		}
		case 'and': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			if (!r0) return r0
			return yield* makeEvaluateAstGenerator(ast.params[1], env)
		}
		case 'or': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			if (r0) return r0
			return yield* makeEvaluateAstGenerator(ast.params[1], env)
		}
		case 'coalesce': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			if (r0 !== null && r0 !== void 0) return r0
			return yield* makeEvaluateAstGenerator(ast.params[1], env)
		}
		case 'equality':
		case 'product':
		case 'sum':
		case 'exponent': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env) as any
			const r1 = yield* makeEvaluateAstGenerator(ast.params[1], env) as any
			switch (ast.op.value) {
				case '**':
					return r0 ** r1
				case '+':
					return r0 + r1
				case '-':
					return r0 - r1
				case '*':
					return r0 * r1
				case '/':
					return r0 / r1
				case '%':
					return r0 % r1
				case '!==':
					return r0 !== r1
				case '!=':
					return r0 != r1
				case '<':
					return r0 < r1
				case '<=':
					return r0 <= r1
				case '>':
					return r0 > r1
				case '>=':
					return r0 >= r1
				case '==':
					return r0 == r1
				case '===':
					return r0 === r1
			}
			throw new Error(`[rgek2k] Invalid operator: ${ast.op.value}`)
		}
		case 'funcall': {
			if (!env.has(ast.identifier.value)) {
				throw new Error(
					`[rgelgy] Function not defined: ${ast.identifier.value}`,
				)
			}
			const fn = env.get(ast.identifier.value)
			if (typeof fn !== 'function') {
				throw new Error(
					`[rgeqnc] Cannot invoke non-function value: ${ast.identifier.value}`,
				)
			}
			const params: TBasicValues[] = []
			for (const param of ast.params) {
				params.push(yield* makeEvaluateAstGenerator(param, env))
			}
			const r = fn(...params)
			switch (typeof r) {
				case 'boolean':
				case 'number':
				case 'string':
					return r
				default:
					return null
			}
		}
		case 'grouping':
			return yield* makeEvaluateAstGenerator(ast.expression, env)
		case 'identifier': {
			if (!env.has(ast.value)) {
				throw new Error(`[rgeldo] Variable not defined: ${ast.value}`)
			}
			const r0 = env.get(ast.value)
			switch (typeof r0) {
				case 'function':
					throw new Error(`[rgeqjw] Cannot use function as value: ${ast.value}`)
				case 'boolean':
				case 'number':
				case 'string':
					return r0
				default:
					return null
			}
		}
		case 'ternary':
			return (yield* makeEvaluateAstGenerator(ast.check, env))
				? yield* makeEvaluateAstGenerator(ast.then, env)
				: yield* makeEvaluateAstGenerator(ast.else, env)
	}
}
