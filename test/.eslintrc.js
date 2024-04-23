// overriding config for test files
module.exports = {
	rules: {
		// this allows to do `expect(true).to.be.true` in tests.
		'@typescript-eslint/no-unused-expressions': 'off',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true
			}
		]
	}
};
