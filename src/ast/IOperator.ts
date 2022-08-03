import { IToken } from './IToken'

export interface IOperator
	extends IToken<
		'operator',
		| '+'
		| '-'
		| '**'
		| '*'
		| '/'
		| '%'
		| '!=='
		| '!='
		| '<'
		| '<='
		| '>'
		| '>='
		| '=='
		| '==='
		| '!'
		| '??'
		| '?'
		| '||'
		| '&&'
	> {}
