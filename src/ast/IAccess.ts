import { IIdentifier } from './IIdentifier'
import { IKeyword } from './IKeyword'
import { TExpression } from './TExpression'

export interface IAccess {
	type: 'access'
	object: TExpression
	key: IIdentifier | IKeyword
}
