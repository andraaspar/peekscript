import { TBasicValues } from './TBasicValues'
import { TEnvFunction } from './TEnvFunction'
import { TSet } from './TSet'

export type TEnv = TSet<TBasicValues | undefined | TEnvFunction>
