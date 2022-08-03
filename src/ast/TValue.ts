import { IIdentifier } from './IIdentifier'
import { IKeyword } from './IKeyword'
import { INumber } from './INumber'
import { IString } from './IString'

export type TValue = IKeyword | INumber | IString | IIdentifier
