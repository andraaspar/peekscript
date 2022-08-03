import { IGrouping } from './IGrouping'
import { IUnary } from './IUnary'
import { TValue } from './TValue'

export type TExpression = IUnary | IGrouping | TValue
