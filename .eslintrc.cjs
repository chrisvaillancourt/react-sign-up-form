module.exports = {
	root: true,

	env: {
		es6: true,
		browser: true,
		node: true,
		es2022: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	plugins: [
		'react',
		'import',
		'jsx-a11y',
		'@typescript-eslint',
		'react-refresh',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: 'tsconfig.json',
		ecmaFeatures: {
			jsx: true,
		},
	},

	settings: {
		react: {
			version: 'detect',
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
	},
};
