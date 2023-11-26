const fs = require('fs');

function processVariable(expression, context) {
	try {
		const fn = new Function(
			'context',
			`with (context) { return ${expression}; }`
		);
		return fn(context);
	} catch (e) {
		return context[expression.trim()];
	}
}
const render = (filePath, options, callback) => {
	fs.readFile(filePath, 'utf8', (err, content) => {
		if (err) return callback(err);

		let rendered = content.toString();
		const regex = /21337\{([^}]+)\}/g;
		let match;

		// Handle for
		const loopPattern =
			/21337{for\s(\w+)\sin\s(\w+)(?:\.length)?}([\s\S]*?){\/for}/g;

		// const loopPattern = /21337{for\s(\w+)\sin\s(\w+)}([\s\S]*?){\/for}/g;

		rendered = rendered.replace(
			loopPattern,
			(fullMatch, loopVar, arrayName, loopContent) => {
				const array = options[arrayName];
				if (Array.isArray(array)) {
					return array
						.map((item) => {
							const loopContext = {
								...options,
								[loopVar]: item,
							};

							// Process if statements inside the loop
							return loopContent
								.replace(
									/21337{if\s(.*?)}([\s\S]*?){else}([\s\S]*?){\/if}/g,
									(
										ifFullMatch,
										condition,
										truePart,
										falsePart
									) => {
										const conditionResult = processVariable(
											condition.trim(),
											loopContext
										);

										return conditionResult
											? truePart
											: falsePart;
									}
								)
								.replace(regex, (match, expression) => {
									// Process other variables inside the loop
									const value = processVariable(
										expression,
										loopContext
									);
									return typeof value !== 'undefined'
										? value
										: match;
								});
						})
						.join('');
				} else {
					return ''; // Remove the loop structure if the arrayName is not an array
				}
			}
		);
		// Handle remaining if statements outside of loops
		const ifRegex = /21337{if\s(.*?)}([\s\S]*?){else}([\s\S]*?){\/if}/g;
		while ((match = ifRegex.exec(rendered)) !== null) {
			const [fullMatch, condition, truePart, falsePart] = match;

			const conditionResult = processVariable(condition.trim(), options);
			const renderedBlock = conditionResult ? truePart : falsePart;
			rendered = rendered.replace(fullMatch, renderedBlock);
		}

		// Handle variable replacements like 21337{x}
		rendered = rendered.replace(regex, (match, expression) => {
			const value = processVariable(expression.trim(), options);
			return typeof value !== 'undefined' ? value : match;
		});

		// Handle file includes like 21337{+index.html}
		const includePattern = /21337{\+(.*?)}/g;
		let includeMatch;
		const includePromises = [];
		while ((includeMatch = includePattern.exec(rendered)) !== null) {
			const [fullMatch, includeFilePath] = includeMatch;
			const includePromise = new Promise((resolve, reject) => {
				fs.readFile(includeFilePath, 'utf8', (err, includeContent) => {
					if (err) {
						console.error(
							`Error including file ${includeFilePath}:`,
							err
						);
						reject(err);
					} else {
						resolve({ fullMatch, includeContent });
					}
				});
			});
			includePromises.push(includePromise);
		}

		Promise.all(includePromises)
			.then((includeResults) => {
				includeResults.forEach(({ fullMatch, includeContent }) => {
					rendered = rendered.replace(fullMatch, includeContent);
				});
				callback(null, rendered);
			})
			.catch((err) => {
				callback(err);
			});
	});
};

module.exports = { render };
