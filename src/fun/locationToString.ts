import { ILocation } from '../ast/ILocation'

export function locationToString(ast: ILocation | null | undefined): string {
	return ast == null ? '' : `@ line ${ast.line} col ${ast.col}`
}
