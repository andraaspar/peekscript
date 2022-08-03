import { Grammar, Parser } from 'nearley'
import grammar from '../grammar/grammar.js'

const g = Grammar.fromCompiled(grammar)

export function parse(code: string) {
	const parser = new Parser(g)
	parser.feed(code)
	return parser.results
}
