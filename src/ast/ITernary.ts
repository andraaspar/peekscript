import { TExpression } from './TExpression'

export interface ITernary {
	type: 'ternary'
	check: TExpression
	then: TExpression
	else: TExpression
}
