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
		const ifElseRegex = /21337\{if\s+([^}]+)\}([\s\S]*?)21337\{\/if\}/g;
		const variableRegex = /21337\{([^}]+)\}/g;

		// This function will process the if-else block content.
		const processBlock = (block, ctx) => {
			let match;
			let output = block;

			while ((match = ifElseRegex.exec(block)) !== null) {
				const [fullMatch, condition, content] = match;
				let isConditionMet;
				try {
					isConditionMet = new Function(
						'context',
						`with (context) { return ${condition}; }`
					)(ctx);
				} catch (e) {
					console.error('Error evaluating condition:', condition);
					isConditionMet = false;
				}

				const parts = content.split('21337{else}');
				const truePart = parts[0] || '';
				const falsePart = parts[1] || '';

				// Recursively process the nested true and false parts.
				const processedPart = isConditionMet
					? processBlock(truePart, ctx)
					: processBlock(falsePart, ctx);
				output = output.replace(fullMatch, processedPart.trim());
			}

			// Process remaining variables in the output.
			output = output.replace(variableRegex, (match, variable) => {
				try {
					return new Function(
						'context',
						`with (context) { return ${variable}; }`
					)(ctx);
				} catch (e) {
					console.error('Error evaluating variable:', variable);
					return '';
				}
			});

			return output;
		};

		// Process the full template with the provided context.
		return processBlock(template, context);
	}
	// processIf(args, context) {
	// 	const ifRegex = new RegExp(
	// 		`21337\\{if\\s${args}\\}([\\s\\S]*?)\\{else\\}([\\s\\S]*?)\\{/if\\}`,
	// 		'g'
	// 	);
	// 	const matches = ifRegex.exec(this.template);
	// 	if (!matches) return '';

	// 	const [fullMatch, truePart, falsePart] = matches;
	// 	const condition = new Function(
	// 		'context',
	// 		`with (context) { return ${args}; }`
	// 	);

	// 	return condition(context) ? truePart.trim() : falsePart.trim();
	// }

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

const template = `
21337{if x}
    21337{if y}
        <p>Hello</p>
    {/if}
{else}
    <p>World</p>
{/if}
`;

const context = {
	x: true,
	y: true,
};

const engine = new TemplateEngine(template);
const result = engine.render(context);
console.log('RESULT', result);
