import { IAccess } from './IAccess'
import { IBinary } from './IBinary'
import { IEaccess } from './IEaccess'
import { IFuncall } from './IFuncall'
import { IGrouping } from './IGrouping'
import { ITernary } from './ITernary'
import { IUnary } from './IUnary'
import { TValue } from './TValue'

export type TExpression =
	| ITernary
	| IBinary
	| IUnary
	| IFuncall
	| IAccess
	| IEaccess
	| IGrouping
	| TValue
