export function jsonStringifyInOrder(o: unknown, space?: string | number) {
	return JSON.stringify(
		o,
		(k, v) => {
			if (v == null || typeof v !== 'object' || Array.isArray(v)) return v
			const keys = Object.keys(v)
			keys.sort()
			const result: any = {}
			for (const key of keys) {
				result[key] = v[key]
			}
			return result
		},
		space,
	)
}
