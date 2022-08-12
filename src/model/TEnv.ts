import { TEnvFunction } from './TEnvFunction'
import { TInValues } from './TInValues'
import { TSet } from './TSet'

export type TEnv = TSet<TInValues | TEnvFunction>
