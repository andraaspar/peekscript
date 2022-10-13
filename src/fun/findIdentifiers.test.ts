import { findIdentifiers } from './findIdentifiers'
import { parse } from './parse'

test('[rjos7d]', () => {
	expect(findIdentifiers(parse(`null`))).toEqual(new Set([]))
})

test('[rjosai]', () => {
	expect(findIdentifiers(parse(`foo`))).toEqual(new Set(['foo']))
})

test('[rjosax]', () => {
	expect(findIdentifiers(parse(`(foo)`))).toEqual(new Set(['foo']))
})

test('[rjosb2]', () => {
	expect(findIdentifiers(parse(`a.b`))).toEqual(new Set(['a']))
})

test('[rjosqw]', () => {
	expect(findIdentifiers(parse(`a[b]`))).toEqual(new Set(['a', 'b']))
})

test('[rjosrc]', () => {
	expect(findIdentifiers(parse(`a.b[c]`))).toEqual(new Set(['a', 'c']))
})
