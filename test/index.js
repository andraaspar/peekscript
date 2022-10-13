import {
	evaluate,
	CachedEvaluator,
	jsonStringifyInOrder,
} from '../build/main.js'

const out = document.getElementById('out')
let log = ''

const code = `$foo.name==trim($foo.name)?$bar+4:$quux[1]?9*9:''`
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
			$foo: { name: 'hey ' },
			$bar: 5,
			$quux: [false, true],
		})
		if (i === 0) log += result + '\n'
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
							$foo: jsonStringifyInOrder({ name: 'hey ' }),
							$bar: 5,
							$quux: jsonStringifyInOrder([false, true]),
						}),
					),
				) + ''
			if (i === 0) log += result + '\n'
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
							$foo: jsonStringifyInOrder({ name: 'hey ' }),
							$bar: 5,
							$quux: jsonStringifyInOrder([false, true]),
						}),
					),
				)
				if (i === 0) log += result + '\n'
			}
			log += `peekscript cached: ${Math.round(performance.now() - start)} ms\n`
			out.textContent = log
		})
	})
})
