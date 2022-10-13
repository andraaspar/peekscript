import { Grammar, Parser } from 'nearley'
import grammar from '../../grammar/grammar.js'
import { TExpression } from '../ast/TExpression.js'

const g = Grammar.fromCompiled(grammar)

export function parse(code: string): TExpression | null | undefined {
	const parser = new Parser(g)
	try {
		parser.feed(code)
		const asts = parser.results as TExpression[]
		if (asts.length > 1) {
			// console.error(`[rggn62]`, jsonStringifyInOrder(asts, null, 2))
			throw new Error(`[rgekiu] Ambiguous code: ${code}`)
		}
		if (asts.length === 0 && code.trim()) {
			throw new Error(`[rggm2b] Could not parse code: ${code}`)
		}
		return asts[0]
	} catch (e) {
		if (e instanceof Error) {
			if (/\s*Instead, I was/i.test(e.message)) {
				throw new Error(e.message.replace(/\s*Instead, I was[^]*/, ''), {
					cause: e,
				})
			}
		}
		throw e
	}
}
