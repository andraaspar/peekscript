import { ILocation } from './ILocation'
import { TExpression } from './TExpression'

export interface IEaccess extends ILocation {
	type: 'eaccess'
	object: TExpression
	key: TExpression
}
