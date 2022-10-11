import { evaluateAst, parse, Rational } from '../build/main.js'

const envIn = document.getElementById('env-in')
const code = document.getElementById('code')
const astOut = document.getElementById('ast-out')
const out = document.getElementById('out')

envIn.value = localStorage.getItem('peekscript-env') ?? ''
code.value = localStorage.getItem('peekscript-code') ?? ''

function oninput(e) {
	try {
		localStorage.setItem('peekscript-env', envIn.value)
		localStorage.setItem('peekscript-code', code.value)
		const env = new Map(
			Object.entries(
				new Function(
					`'use strict';const Rational=this.Rational;const env=({${envIn.value}});return env`,
				).apply({ Rational }),
			),
		)
		const ast = parse(code.value)
		console.log('AST:', ast)
		astOut.innerText = JSON.stringify(ast, null, 2)
		try {
			const result = evaluateAst(ast, env)
			if (result instanceof Rational) {
				console.log(`Result: ${result}`)
				out.innerText = result.toString()
			} else {
				console.log('Result:', result)
				out.innerText = JSON.stringify(result, null, 2)
			}
		} catch (e) {
			console.error(e)
			out.innerText = e + ''
		}
	} catch (e) {
		console.error(e)
		out.innerText = e + ''
		astOut.innerText = '-'
	}
}
code.addEventListener('input', oninput)
envIn.addEventListener('input', oninput)
oninput()
