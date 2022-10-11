import { evaluate, CachedEvaluator } from '../build/main.js'
import Interpreter from 'js-interpreter'

const out = document.getElementById('out')
let log = ''

// const code = `!$foo`
const code = `$foo==trim($foo)?$bar+4:$quux?9*9:''`
const count = 1000

const evaluator = new CachedEvaluator()

function eval2(code, env) {
	return new Function(
		`${Object.entries(env)
			.map(([k, v]) => `var ${k}=this.${k}`)
			.join(';')};return (${code})`,
	).apply(env)
}

requestAnimationFrame(() => {
	const start = performance.now()
	for (let i = 0; i < count; i++) {
		const result = eval2(code, {
			trim: (s) => s.trim(),
			$foo: 'hey ',
			$bar: 5,
			$quux: true,
		})
	}
	log += `eval: ${Math.round(performance.now() - start)} ms\n`
	out.textContent = log

	requestAnimationFrame(() => {
		const start = performance.now()
		for (let i = 0; i < count; i++) {
			const result =
				evaluate(
					code,
					new Map(
						Object.entries({
							trim: (s) => s.trim(),
							$foo: 'hey ',
							$bar: 5,
							$quux: true,
						}),
					),
				) + ''
		}
		log += `peekscript: ${Math.round(performance.now() - start)} ms\n`
		out.textContent = log

		requestAnimationFrame(() => {
			const start = performance.now()
			for (let i = 0; i < count; i++) {
				const result = evaluator.evaluate(
					code,
					new Map(
						Object.entries({
							trim: (s) => s.trim(),
							$foo: 'hey ',
							$bar: 5,
							$quux: true,
						}),
					),
				)
			}
			log += `peekscript cached: ${Math.round(performance.now() - start)} ms\n`
			out.textContent = log

			requestAnimationFrame(() => {
				const start = performance.now()
				for (let i = 0; i < count; i++) {
					const interpreter = new Interpreter(
						code,
						(interpreter, globalObject) => {
							interpreter.setProperty(globalObject, '$foo', 'hey ')
							interpreter.setProperty(
								globalObject,
								'trim',
								interpreter.createNativeFunction((s) => s.trim()),
							)
							interpreter.setProperty(globalObject, '$bar', 5)
							interpreter.setProperty(globalObject, '$quux', true)
						},
					)
					interpreter.run()
					const result = interpreter.value
				}
				log += `js-interpreter: ${Math.round(performance.now() - start)} ms\n`
				out.textContent = log
			})
		})
	})
})
