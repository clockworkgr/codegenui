module.exports = {
	root: true,

	env: {
		node: true
	},

	extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:prettier/recommended', '@vue/prettier'],

	parserOptions: {
		parser: 'babel-eslint'
	},

	plugins: ['prettier'],

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'vue/component-name-in-template-casing': ['error', 'PascalCase'],
		'prettier/prettier': [
			'warn',
			{
				trailingComma: 'none',
				tabWidth: 2,
				semi: false,
				singleQuote: true,
				printWidth: 120
			}
		]
	},

	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true
			}
		},
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true
			}
		}
	]
}
