import { TInValues } from './TInValues'
import { TOutValues } from './TOutValues'

export type TEnvFunction = (...rest: TOutValues[]) => void | TInValues
