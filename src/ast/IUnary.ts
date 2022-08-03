import { IOperator } from './IOperator'
import { TExpression } from './TExpression'

export interface IUnary {
	type: 'unary'
	op: IOperator
	param: TExpression
}
