import { TEnvFunction } from './TEnvFunction'
import { TInValues } from './TInValues'

export type TEnvMap = Map<string, TInValues | TEnvFunction>
