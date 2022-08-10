import { IOperator } from './IOperator'
import { TExpression } from './TExpression'

export interface IBinary {
	type: 'coalesce' | 'or' | 'and' | 'equality' | 'sum' | 'product' | 'exponent'
	op: IOperator
	params: [TExpression, TExpression]
}
