class TemplateEngine {
	constructor(template) {
		this.template = template;
	}

	render(context) {
		return this.parse(this.template, context);
	}

	parse(template, context) {
		let match;
		const regex = /21337\{([^}]+)\}/g;
		while ((match = regex.exec(template)) !== null) {
			const [placeholder, expression] = match;
			console.log(
				'🚀 ~ file: test.js:15 ~ TemplateEngine ~ placeholder:',
				placeholder
			);
			let [command, ...args] = expression.trim().split(/\s+/);

			switch (command) {
				case 'if':
					// Replace the entire if-else block with the result of processIf
					const result = this.processIf(args.join(' '), context);
					template = template.replace(
						new RegExp(placeholder + '[\\s\\S]*?\\{/if\\}'),
						result
					);

					break;
				case 'for':
					const forResult = this.processFor(args.join(' '), context);
					template = template.replace(
						new RegExp(placeholder + '[\\s\\S]*?\\{/for\\}'),
						forResult
					);

					break;
				default:
					console.log(context);
					console.log(this.processVariable(expression, context));
					template = template.replace(
						placeholder,
						this.processVariable(expression, context)
					);
					break;
			}
		}
		return template;
	}

	processIf(args, context) {
		console.log('🚀 ~ file: test.js:53 ~ processIf ~ args:', args);
		const ifRegex = new RegExp(
			`21337\\{if\\s${args}\\}([\\s\\S]*?)\\{else\\}([\\s\\S]*?)\\{/if\\}`,
			'g'
		);
		const matches = ifRegex.exec(this.template);
		if (!matches) return '';

		const [fullMatch, truePart, falsePart] = matches;
		const condition = new Function(
			'context',
			`with (context) { return ${args}; }`
		);

		return condition(context) ? truePart.trim() : falsePart.trim();
	}

	processFor(args, context) {
		const forRegex = new RegExp(
			`21337\\{for\\s(\\w+)\\sin\\s(\\w+)\\}([\\s\\S]*?)\\{/for\\}`,
			'g'
		);
		const matches = forRegex.exec(this.template);
		if (!matches) return '';

		const [fullMatch, loopVar, arrayName, loopContent] = matches;
		const array = context[arrayName];
		if (!Array.isArray(array)) return '';

		return array
			.map((item) => {
				const loopContext = { ...context, [loopVar]: item };

				return this.parse(loopContent, loopContext);
			})
			.join('');
	}

	processVariable(expression, context) {
		try {
			const fn = new Function(
				'context',
				`with (context) { return ${expression}; }`
			);
			return fn(context);
		} catch (e) {
			console.warn(`Error processing variable '${expression}': ${e}`);
			return '';
		}
	}
}

module.exports = TemplateEngine;

const for_template = `
21337{for starIndex in Math.floor(21337{movie} / 2)}
<p>starIndex</p>
{/for}
`;

const context = {
	movie: 10,
};

const engine = new TemplateEngine(for_template);
const result = engine.render(context);
console.log('RESULT', result);
