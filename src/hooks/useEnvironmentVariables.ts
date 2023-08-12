import { useState, useEffect } from 'react';

/* Get environment variables .env file. */
export function useEnvironmentVariables() {
	// * We can't programmatically retrieve env variables
	// * We must always reference them statically
	// * see https://vitejs.dev/guide/env-and-mode.html#production-replacement

	const [apiToken, setApiToken] = useState('');
	const [apiEmail, setApiEmail] = useState('');

	useEffect(() => {
		const _apiToken = validateEnvVariable(import.meta.env.VITE_API_TOKEN);
		setApiToken(_apiToken);
	}, []);
	useEffect(() => {
		const _email = validateEnvVariable(import.meta.env.VITE_API_EMAIL);
		setApiEmail(_email);
	}, []);
	return { apiToken, apiEmail };
}
/**
 * Template a message for a missing environment variable.
 * Can be passed as the message to a new Error instance.
 * Example: throw new Error(missingEnvVarMessage(SOME_ENV_VAR))
 */
function missingEnvVarMessage(envVar: unknown) {
	return `
	Missing environment variable: ${envVar}. 
	Please be sure a .env file exists in the project root.
	The .env file should have an environment variable with the key ${envVar}.
	See the .env-example file in the project root for reference.
	`;
}
/**
 * Template a message for an environment variable with the wrong type.
 * Can be passed as the message to a new TypeError instance.
 * Example: throw new TypeError(wrongEnvVarType('SOME_ENV_VAR', 'String'))
 */
function wrongEnvVarType(envVar: unknown, expectedType: string) {
	return `The environment variable ${envVar} must be of type ${expectedType}`;
}
/**
 * Validates the provided env variable exists and is a string.
 * @throws Error if envVar is falsy.
 * @throws TypeError if envVar is not of type string.
 */
function validateEnvVariable(envVar: unknown) {
	if (!envVar) throw new Error(missingEnvVarMessage(envVar));
	if (typeof envVar !== 'string')
		throw new TypeError(wrongEnvVarType(envVar, 'String'));
	return envVar;
}
