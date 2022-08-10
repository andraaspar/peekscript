import { TBasicValues } from './TBasicValues'
import { TEnvFunction } from './TEnvFunction'

export type TEnvMap = Map<string, TBasicValues | undefined | TEnvFunction>
