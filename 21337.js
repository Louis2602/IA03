const fs = require('fs');

const processVariable = (expression, options) => {
	const key = expression.trim();
	return options[key] !== undefined ? options[key] : '';
};

const render = (filePath, options, callback) => {
	fs.readFile(filePath, 'utf8', (err, content) => {
		if (err) return callback(err);

		let rendered = content;
		const includePattern = /21337\{\+(.*?)\}/g; // Updated include placeholder pattern

		// Search for include placeholders and replace them with file content
		const includeMatches = content.match(includePattern);
		if (includeMatches) {
			const includePromises = includeMatches.map((match) => {
				const includeFilePath = match
					.replace('21337{+', '')
					.replace('}', '');
				return new Promise((resolve, reject) => {
					fs.readFile(
						includeFilePath,
						'utf8',
						(err, includeContent) => {
							if (err) reject(err);
							resolve({ match, includeContent });
						}
					);
				});
			});

			// Replace each include placeholder with the content of the included file
			Promise.all(includePromises)
				.then((includes) => {
					includes.forEach(({ match, includeContent }) => {
						rendered = rendered.replace(match, includeContent);
					});
					// Process other variable replacements after includes are resolved
					rendered = rendered.replace(
						/21337\{(.*?)\}/g,
						(match, expression) =>
							processVariable(expression, options)
					);
					callback(null, rendered);
				})
				.catch((err) => {
					callback(err);
				});
		} else {
			// No includes found, proceed with variable replacements directly
			rendered = rendered.replace(
				/21337\{(.*?)\}/g,
				(match, expression) => processVariable(expression, options)
			);
			callback(null, rendered);
		}
	});
};

module.exports = { render };

// class TemplateEngine {
// 	constructor(template) {
// 		this.template = template;
// 	}
// 	readHTMLFile(filePath) {
// 		try {
// 			return fs.readFileSync(filePath, 'utf8');
// 		} catch (err) {
// 			console.error(`Error reading HTML file: ${err}`);
// 			return '';
// 		}
// 	}
// 	render(context) {
// 		return this.parse(this.template, context);
// 	}

// 	parse(template, context) {
// 		let match;
// 		const regex = /21337\{([^}]+)\}/g;
// 		while ((match = regex.exec(template)) !== null) {
// 			const [placeholder, expression] = match;
// 			let [command, ...args] = expression.trim().split(/\s+/);

// 			switch (command) {
// 				case 'if':
// 					// Replace the entire if-else block with the result of processIf
// 					const result = this.processIf(args.join(' '), context);
// 					template = template.replace(
// 						new RegExp(placeholder + '[\\s\\S]*?\\{/if\\}'),
// 						result
// 					);

// 					break;
// 				case 'for':
// 					const forResult = this.processFor(args.join(' '), context);
// 					template = template.replace(
// 						new RegExp(placeholder + '[\\s\\S]*?\\{/for\\}'),
// 						forResult
// 					);

// 					break;
// 				default:
// 					template = template.replace(
// 						placeholder,
// 						this.processVariable(expression, context)
// 					);
// 					break;
// 			}
// 		}
// 		return template;
// 	}

// 	// processIf(args, context) {
// 	// 	const ifRegex = new RegExp(
// 	// 		`21337\\{if\\s${args}\\}([\\s\\S]*?)\\{else\\}([\\s\\S]*?)\\{/if\\}`,
// 	// 		'g'
// 	// 	);
// 	// 	const matches = ifRegex.exec(this.template);
// 	// 	if (!matches) return '';

// 	// 	const [fullMatch, truePart, falsePart] = matches;
// 	// 	const condition = new Function(
// 	// 		'context',
// 	// 		`with (context) { return ${args}; }`
// 	// 	);

// 	// 	return condition(context) ? truePart.trim() : falsePart.trim();
// 	// }

// 	// processFor(args, context) {
// 	// 	const forRegex = new RegExp(
// 	// 		`21337\\{for\\s(\\w+)\\sin\\s(\\w+)\\}([\\s\\S]*?)\\{/for\\}`,
// 	// 		'g'
// 	// 	);
// 	// 	const matches = forRegex.exec(this.template);
// 	// 	if (!matches) return '';

// 	// 	const [fullMatch, loopVar, arrayName, loopContent] = matches;
// 	// 	const array = context[arrayName];
// 	// 	if (!Array.isArray(array)) return '';

// 	// 	return array
// 	// 		.map((item) => {
// 	// 			const loopContext = { ...context, [loopVar]: item };

// 	// 			return this.parse(loopContent, loopContext);
// 	// 		})
// 	// 		.join('');
// 	// }
// 	processFor(args, context, placeholder) {
// 		const forRegex = new RegExp(
// 			`21337\\{for\\s(\\w+)\\sin\\s(\\w+)\\}([\\s\\S]*?)\\{/for\\}`,
// 			'g'
// 		);
// 		const matches = forRegex.exec(this.template);
// 		if (!matches) return '';

// 		const [fullMatch, loopVar, arrayName, loopContent] = matches;
// 		const array = context[arrayName];
// 		if (!Array.isArray(array)) return '';

// 		const replacedContent = array
// 			.map((item) => {
// 				const loopContext = { ...context, [loopVar]: item };
// 				console.log(
// 					'🚀 ~ file: 21337.js:99 ~ .map ~ loopContext:',
// 					loopContext
// 				);
// 				console.log(
// 					'🚀 ~ file: 21337.js:104 ~ .map ~ loopContent:',
// 					loopContent
// 				);
// 				return this.parse(loopContent, loopContext);
// 			})
// 			.join('');

// 		return this.template.replace(fullMatch, replacedContent);
// 	}
// 	processVariable(expression, context) {
// 		try {
// 			const fn = new Function(
// 				'context',
// 				`with (context) { return ${expression}; }`
// 			);
// 			return fn(context);
// 		} catch (e) {
// 			console.warn(`Error processing variable '${expression}': ${e}`);
// 			return '';
// 		}
// 	}
// }

// module.exports = TemplateEngine;

// const nested_if_template = `
// 21337{if x}
//     21337{if y}
//         <p>Hello</p>
//     {/if}
// {else}
//     <p>World</p>
// {/if}
// `;

// const nested_for_template = `
// 21337{for movie in movies}
//     <p>21337{movie.id}</p>
// {/for}
// `;

// // 21337{for item in movie.items}
// //     <p>21337{movie.id}</p>
// //     <p>21337{item}</p>
// // {/for}
// const context = {
// 	movies: [
// 		{
// 			id: 1,
// 			items: ['Hello', 'Amazing', 'Good'],
// 		},
// 		{
// 			id: 2,
// 			items: ['Perfetc', 'Amazing', 'Rip'],
// 		},
// 		{
// 			id: 3,
// 			items: ['Hahahah', 'bababab', 'Shit'],
// 		},
// 	],
// };

// const engine = new TemplateEngine(nested_for_template);
// const result = engine.render(context);
// console.log('RESULT', result);
