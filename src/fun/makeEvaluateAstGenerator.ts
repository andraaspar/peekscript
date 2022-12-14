import JSBI from 'jsbi'
import { ILocation } from '../ast/ILocation'
import { TExpression } from '../ast/TExpression'
import { Rational } from '../class/RationalBigInt'
import { TEnvMap } from '../model/TEnvMap'
import { TOutValues } from '../model/TOutValues'
import { assertErrorText } from './assertErrorText'
import { assertType } from './assertType'
import { getType } from './getType'
import { jsonStringifyInOrder } from './jsonStringifyInOrder'
import { locationToString } from './locationToString'
import { stringifyUnknown } from './stringifyUnknown'
import { toInt } from './toInt'

export function* makeEvaluateAstGenerator(
	ast: TExpression,
	env: TEnvMap,
): Generator<void, TOutValues, never> {
	yield
	switch (ast.type) {
		case 'keyword':
			return ast.value
		case 'number':
			return Rational.fromString(ast.value)
		case 'string':
			return ast.value
		case 'unary': {
			const r0 = yield* makeEvaluateAstGenerator(ast.param, env)
			switch (ast.op.value) {
				case '!':
					if (typeof r0 !== 'boolean') {
						throw new Error(
							`[rgtkbf] ` + assertErrorText(r0, 'boolean', ast.op),
						)
					}
					return !r0
				case '+':
					if (typeof r0 === 'object') {
						if (r0 instanceof Rational) {
							return r0
						}
					}
					throw new Error(`[rgtkb3] ` + assertErrorText(r0, 'rational', ast.op))
				case '-':
					if (typeof r0 === 'object') {
						if (r0 instanceof Rational) {
							return r0.negated()
						}
					}
					throw new Error(`[rgtkb3] ` + assertErrorText(r0, 'rational', ast.op))
			}
			throw new Error(
				`[rggmgx] Invalid unary operator: ${ast.op?.value} ${locationToString(
					ast.op,
				)}`,
			)
		}
		case 'and': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			assertType(r0, 'boolean', ast.op)
			if (!r0) return r0
			const r1 = yield* makeEvaluateAstGenerator(ast.params[1], env)
			assertType(r1, 'boolean', ast.op)
			return r1
		}
		case 'or': {
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			assertType(r0, 'boolean', ast.op)
			if (r0) return r0
			const r1 = yield* makeEvaluateAstGenerator(ast.params[1], env)
			assertType(r1, 'boolean', ast.op)
			return r1
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
			const r0 = yield* makeEvaluateAstGenerator(ast.params[0], env)
			const r1 = yield* makeEvaluateAstGenerator(ast.params[1], env)
			switch (ast.op.value) {
				case '**': {
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.toThePowerOf(r1)
							} else {
								throw new Error(
									`[rgtkir] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtkb3] ` + assertErrorText(r0, 'rational', ast.op))
				}
				case '+':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.plus(r1)
							} else {
								throw new Error(
									`[rgtl58] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
						throw new Error(
							`[rgtl5d] ` + assertErrorText(r0, 'rational', ast.op),
						)
					}
					if (typeof r0 === 'string') {
						return r0 + r1
					} else if (typeof r1 === 'string') {
						return r0 + r1
					} else {
						throw new Error(
							`[rgtlce] Invalid operands for concatenation: ${typeof r0}, ${typeof r1} ` +
								locationToString(ast.op),
						)
					}
				case '-':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.minus(r1)
							} else {
								throw new Error(
									`[rgtlhr] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtljj] ` + assertErrorText(r0, 'rational', ast.op))
				case '*':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.multipliedBy(r1)
							} else {
								throw new Error(
									`[rgtlk7] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtlkc] ` + assertErrorText(r0, 'rational', ast.op))
				case '/':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								if (r1.isEqualTo(Rational.ZERO)) {
									throw new Error(
										`[rje7wl] Division by zero ${locationToString(ast.op)}`,
									)
								}
								return r0.dividedBy(r1)
							} else {
								throw new Error(
									`[rgtllf] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtlme] ` + assertErrorText(r0, 'rational', ast.op))
				case '%':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.remainder(r1)
							} else {
								throw new Error(
									`[rgtlor] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtlow] ` + assertErrorText(r0, 'rational', ast.op))
				case '!=':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return !r0.isEqualTo(r1)
							}
						}
					}
					return r0 !== r1
				case '<':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.isLessThan(r1)
							} else {
								throw new Error(
									`[rgtm1b] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtm1u] ` + assertErrorText(r0, 'rational', ast.op))
				case '<=':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.isLessThanOrEqualTo(r1)
							} else {
								throw new Error(
									`[rgtm6u] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtm74] ` + assertErrorText(r0, 'rational', ast.op))
				case '>':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.isGreaterThan(r1)
							} else {
								throw new Error(
									`[rgtm82] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtm86] ` + assertErrorText(r0, 'rational', ast.op))
				case '>=':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.isGreaterThanOrEqualTo(r1)
							} else {
								throw new Error(
									`[rgtm8m] ` + assertErrorText(r1, 'rational', ast.op),
								)
							}
						}
					}
					throw new Error(`[rgtm8t] ` + assertErrorText(r0, 'rational', ast.op))
				case '==':
					if (typeof r0 === 'object' && typeof r1 === 'object') {
						if (r0 instanceof Rational) {
							if (r1 instanceof Rational) {
								return r0.isEqualTo(r1)
							}
						}
					}
					return r0 === r1
			}
			throw new Error(
				`[rgek2k] Invalid operator: ${ast.op.value} ${locationToString(
					ast.op,
				)}`,
			)
		}
		case 'funcall': {
			if (!env.has(ast.identifier.value)) {
				throw new Error(
					`[rgelgy] Function not defined: ${
						ast.identifier.value
					} ${locationToString(ast.identifier)}`,
				)
			}
			const fn = env.get(ast.identifier.value)
			if (typeof fn !== 'function') {
				throw new Error(
					`[rgeqnc] Cannot invoke non-function value: ${
						ast.identifier.value
					} ${locationToString(ast.identifier)}`,
				)
			}
			const params: TOutValues[] = []
			for (const param of ast.params) {
				params.push(yield* makeEvaluateAstGenerator(param, env))
			}
			let r
			try {
				r = fn(...params)
			} catch (e) {
				throw new Error(`[rjne0l] [function ${ast.identifier.value}]:\n${e}`, {
					cause: e instanceof Error ? e : undefined,
				})
			}
			try {
				return sanitizeResult(r, ast.identifier)
			} catch (e) {
				throw new Error(
					`[rjne44] [function ${
						ast.identifier.value
					}] returned an invalid value: ${stringifyUnknown(
						r,
					)}\n(${e})\nParameters: (${params
						.map((it) => stringifyUnknown(it))
						.join(', ')})`,
					{
						cause: e instanceof Error ? e : undefined,
					},
				)
			}
		}
		case 'access': {
			const json = yield* makeEvaluateAstGenerator(ast.object, env)
			const t = getType(json)
			switch (t) {
				case 'null':
				case 'undefined':
					return null
				case 'string':
					break
				default:
					throw new Error(
						`[rjnhqs] Cannot access field '${
							ast.key.value
						}' of ${stringifyUnknown(json)} ${locationToString(ast.key)}`,
					)
			}
			let obj
			try {
				obj = JSON.parse(json as string)
			} catch (e) {
				throw new Error(
					`[rjnhxb] Cannot access field '${ast.key.value}' of ${getType(
						json,
					)} because it is invalid JSON: ${e}`,
					{ cause: e instanceof Error ? e : undefined },
				)
			}
			let value
			switch (getType(obj)) {
				case 'object': {
					switch (ast.key.type) {
						case 'keyword':
							value = obj[ast.key.text]
							break
						case 'identifier':
							value = obj[ast.key.text]
							break
					}
					break
				}
				default:
					throw new Error(
						`[rjnj0r] Cannot access field '${ast.key.value}' of ${getType(
							json,
						)} because it is not an object ${locationToString(ast.key)}`,
					)
			}
			switch (getType(value)) {
				case 'array':
				case 'object':
					value = jsonStringifyInOrder(value)
			}
			return sanitizeResult(value, ast.key)
		}
		case 'eaccess': {
			const key = yield* makeEvaluateAstGenerator(ast.key, env)
			const keyType = getType(key)
			switch (keyType) {
				case 'rational':
				case 'string':
					break
				default:
					throw new Error(
						`[rjopfn] Invalid key type ${stringifyUnknown(
							key,
						)} ${locationToString(ast)}`,
					)
			}
			const json = yield* makeEvaluateAstGenerator(ast.object, env)
			const jsonType = getType(json)
			switch (jsonType) {
				case 'null':
				case 'undefined':
					return null
				case 'string':
					break
				default:
					throw new Error(
						`[rjopho] Cannot access field ${stringifyUnknown(
							key,
						)} of ${stringifyUnknown(json)} ${locationToString(ast)}`,
					)
			}
			let obj
			try {
				obj = JSON.parse(json as string)
			} catch (e) {
				throw new Error(
					`[rjophm] Cannot access field ${stringifyUnknown(key)} of ${getType(
						json,
					)} because it is invalid JSON: ${e}`,
					{ cause: e instanceof Error ? e : undefined },
				)
			}
			let value
			switch (getType(obj)) {
				case 'null':
					return null
				case 'array': {
					switch (keyType) {
						case 'rational':
							try {
								value = obj[toInt(key as Rational)]
							} catch (e) {
								throw new Error(
									`[rjoqwt] Invalid key ${locationToString(ast)}\n${e}`,
									{ cause: e instanceof Error ? e : undefined },
								)
							}
							break
						default:
							throw new Error(
								`[rjopna] Cannot access field ${stringifyUnknown(
									key,
								)} of ${getType(json)} ${locationToString(ast)}`,
							)
					}
					break
				}
				case 'object': {
					switch (keyType) {
						case 'string':
							value = obj[key as string]
							break
						default:
							throw new Error(
								`[rjopow] Cannot access field ${stringifyUnknown(
									key,
								)} of ${getType(json)} ${locationToString(ast)}`,
							)
					}
					break
				}
				default:
					throw new Error(
						`[rjoprc] Cannot access field ${stringifyUnknown(key)} of ${getType(
							json,
						)} because it is not an object or array ${locationToString(ast)}`,
					)
			}
			switch (getType(value)) {
				case 'array':
				case 'object':
					value = jsonStringifyInOrder(value)
			}
			return sanitizeResult(value, ast)
		}
		case 'grouping':
			return yield* makeEvaluateAstGenerator(ast.expression, env)
		case 'identifier': {
			if (!env.has(ast.value)) {
				throw new Error(
					`[rgeldo] Variable not defined: ${ast.value} ${locationToString(
						ast,
					)}`,
				)
			}
			const r0 = env.get(ast.value)
			return sanitizeResult(r0, ast)
		}
		case 'ternary':
			return (yield* makeEvaluateAstGenerator(ast.check, env))
				? yield* makeEvaluateAstGenerator(ast.then, env)
				: yield* makeEvaluateAstGenerator(ast.else, env)
	}
}

function sanitizeResult(result: unknown, location: ILocation): TOutValues {
	if (result == null) return null
	switch (typeof result) {
		case 'function':
			throw new Error(
				`[rgeqjw] Cannot use function as value: ${locationToString(location)}`,
			)
		case 'boolean':
		case 'string':
			return result
		case 'number':
			if (isNaN(result)) {
				throw new Error(`[rh8e8i] NaN is not a valid number.`)
			}
			if (!isFinite(result)) {
				throw new Error(`[rh8e96] Infinity is not a valid number.`)
			}
			return Rational.fromNumber(result)
		case 'bigint':
			return Rational.fromNumber(result)
		case 'object':
			if (result instanceof Rational) {
				return result
			} else if (result instanceof JSBI) {
				return Rational.fromNumber(result)
			}
		default:
			throw new Error(`[rjneuq] Invalid value: ${stringifyUnknown(result)}`)
	}
}
