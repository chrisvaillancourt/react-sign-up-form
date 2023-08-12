import { useState, useEffect } from 'react';
import type { LoadingStatus } from '@/types';

const BASE_URL = `https://www.universal-tutorial.com/api`;

/**
 * Key used in states response to store the state name.
 */
const STATE_NAME_KEY = 'state_name';

interface StateResponse {
	[STATE_NAME_KEY]: string;
}

const CITY_NAME_KEY = 'city_name';

interface CityResponse {
	[CITY_NAME_KEY]: string;
}

export { useAccessToken, useStates, useCities };

function useAccessToken({
	apiEmail,
	apiToken,
}: {
	apiEmail: string;
	apiToken: string;
}) {
	const [accessToken, setAccessToken] = useState('');

	useEffect(() => {
		getAccessToken()
			.then((accessToken) => {
				if (!accessToken) return;
				setAccessToken(() => accessToken);
			})
			.catch((err) => {
				console.error(err);
			});

		async function getAccessToken() {
			if (!apiEmail || !apiToken) return;

			const headers = {
				Accept: 'application/json',
				'user-email': apiEmail,
				'api-token': apiToken,
			};
			const url = `${BASE_URL}/getaccesstoken`;
			const res = await fetch(url, {
				headers,
			});
			validateResponseIsOk(res, 'access token');
			const json = await res.json();
			if (!('auth_token' in json))
				throw new TypeError('auth_token key is missing.');
			const { auth_token } = json;
			if (typeof auth_token !== 'string')
				throw new TypeError('auth_token is not of type String.');
			return auth_token;
		}
	}, [apiEmail, apiToken]);

	return {
		accessToken,
	};
}

function useStates(accessToken: string) {
	// * refactor opportunity: leverage useLocalStorage to load state data from cache
	const [states, setStates] = useState<string[]>([]);
	const [status, setStatus] = useState<LoadingStatus>('loading');

	useEffect(() => {
		getStates()
			.then((statesResponse) => {
				if (!statesResponse) return;
				const stateNames = statesResponse.map(
					(stateMetadata) => stateMetadata[STATE_NAME_KEY],
				);

				setStates(() => stateNames);
				setStatus('loaded');
			})
			.catch((err) => {
				setStatus('error');
				console.error(err);
			});
		async function getStates() {
			if (!accessToken) return;

			const headers = baseHeaders(accessToken);
			const url = `${BASE_URL}/states/United%20States`;
			const res = await fetch(url, { headers });
			validateResponseIsOk(res, 'states');
			const statesJson = await res.json();
			if (!isStatesResponse(statesJson))
				throw new TypeError(
					`Unexpected states response type. Expected an array of objects with a key: ${STATE_NAME_KEY} containing the state name`,
				);
			return statesJson;
		}
	}, [accessToken]);

	return { states, status };
}
function isStatesResponse(
	maybeStatesResponse?: unknown,
): maybeStatesResponse is StateResponse[] {
	return (
		!!maybeStatesResponse &&
		Array.isArray(maybeStatesResponse) &&
		maybeStatesResponse.every(
			(state) =>
				state !== null && typeof state === 'object' && STATE_NAME_KEY in state,
		)
	);
}
function isCitiesResponse(
	maybeCitiesResponse?: unknown,
): maybeCitiesResponse is CityResponse[] {
	return (
		!!maybeCitiesResponse &&
		Array.isArray(maybeCitiesResponse) &&
		maybeCitiesResponse.every(
			(city) =>
				city !== null && typeof city === 'object' && CITY_NAME_KEY in city,
		)
	);
}

function useCities(accessToken: string, state: string) {
	// * refactor opportunity: leverage useLocalStorage to load city data from cache
	const [cities, setCities] = useState<string[]>([]);
	const [status, setStatus] = useState<LoadingStatus>('loading');

	useEffect(() => {
		getCities()
			.then((cities) => {
				setStatus('loaded');
				if (!cities) return;
				// some states return duplicate city names (i.e. florida)
				// use a set to remove duplicates
				const cityNames = new Set(cities.map((city) => city[CITY_NAME_KEY]));
				setCities(() => [...cityNames]);
			})
			.catch((err) => {
				setStatus('error');
				console.error(err);
			});
		async function getCities() {
			if (!accessToken || !state) return;
			const url = `${BASE_URL}/cities/${state}`;
			const headers = baseHeaders(accessToken);
			const response = await fetch(url, { headers });
			validateResponseIsOk(response, 'cities');
			const citiesJson = await response.json();
			if (!isCitiesResponse(citiesJson))
				throw new TypeError(
					`Unexpected cities response type. Expected an array of objects with a key: ${CITY_NAME_KEY} containing the city name`,
				);
			return citiesJson;
		}
	}, [accessToken, state]);

	return { cities, status };
}

function baseHeaders(accessToken: string) {
	return Object.freeze({
		Accept: 'application/json',
		Authorization: bearerToken(accessToken),
	});
}

function bearerToken(accessToken: string) {
	return `Bearer ${accessToken}`;
}

/**
 * Validate the response was successful (returned status code in 200-299 range).
 * @throws Error if response is not ok.
 */
function validateResponseIsOk(response: Response, resourceName: string) {
	if (!response.ok)
		throw new Error(
			`Error requesting ${resourceName}. The response was not ok.`,
		);
}
