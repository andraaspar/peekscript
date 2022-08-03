import { IIdentifier } from './IIdentifier'
import { TExpression } from './TExpression'

export interface IFuncall {
	type: 'funcall'
	identifier: IIdentifier
	params: TExpression[]
}
