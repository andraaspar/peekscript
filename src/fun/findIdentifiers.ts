import { TExpression } from '../ast/TExpression'

export function findIdentifiers(
	ast: TExpression | null | undefined,
): Set<string> {
	const result = new Set<string>()
	if (ast != null) findIdentifiersInternal(ast, result)
	return result
}

function findIdentifiersInternal(
	ast: TExpression,
	identifiers: Set<string>,
): void {
	switch (ast.type) {
		case 'keyword':
		case 'number':
		case 'string':
			break
		case 'unary':
			findIdentifiersInternal(ast.param, identifiers)
			break
		case 'and':
		case 'or':
		case 'coalesce':
		case 'equality':
		case 'product':
		case 'sum':
		case 'exponent':
			findIdentifiersInternal(ast.params[0], identifiers)
			findIdentifiersInternal(ast.params[1], identifiers)
			break
		case 'funcall':
			identifiers.add(ast.identifier.value)
			for (const param of ast.params) {
				findIdentifiersInternal(param, identifiers)
			}
			break
		case 'access':
			findIdentifiersInternal(ast.object, identifiers)
			break
		case 'eaccess':
			findIdentifiersInternal(ast.object, identifiers)
			findIdentifiersInternal(ast.key, identifiers)
			break
		case 'grouping':
			findIdentifiersInternal(ast.expression, identifiers)
			break
		case 'identifier':
			identifiers.add(ast.value)
			break
		case 'ternary':
			findIdentifiersInternal(ast.check, identifiers)
			findIdentifiersInternal(ast.then, identifiers)
			findIdentifiersInternal(ast.else, identifiers)
			break
		default:
			throw new Error(`[rje5t5] ${(ast as TExpression).type}`)
	}
}
