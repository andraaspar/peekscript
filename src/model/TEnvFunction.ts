import { TBasicValues } from './TBasicValues'

export type TEnvFunction = (...rest: TBasicValues[]) => void | TBasicValues
