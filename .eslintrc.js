module.exports = {
	root:   true,
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		project: './tsconfig.json'
	},
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	plugins: [
		'node' // we are not interested in `plugin:node/recommended` config. We need only one rule from it. Hence importing plugin only without any implications
	],
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					// I'm pretty sure https://github.com/microsoft/TypeScript/issues/21732
					// isn't a deal breaker for us here
					object: false
				}
			}
		],
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'import/prefer-default-export': 'off',
		'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
		'consistent-return': 'off',
		'class-methods-use-this': 'off',
		"no-restricted-syntax": [
			"error",
			{
				"selector": "ForInStatement",
				"message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
			},
			{
				"selector": "LabeledStatement",
				"message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
			},
			{
				"selector": "WithStatement",
				"message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
			}
		],
		"@typescript-eslint/lines-between-class-members": ['error', {
			"exceptAfterOverload": true,
			"exceptAfterSingleLine": true
		}]
	}
};
