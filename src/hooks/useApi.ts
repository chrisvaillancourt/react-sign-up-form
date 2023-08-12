import { useState, useEffect } from 'react';
import type { LoadingStatus } from '@/types';
import { useLocalStorage } from './index';

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
		getAccessToken().catch((err) => {
			console.error('Error loading access token: ');
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
			if (!res.ok)
				throw new Error(
					'Error requesting an access token. The response was not ok.',
				);
			const json = await res.json();
			if (!('auth_token' in json))
				throw new TypeError('auth_token key is missing.');
			const { auth_token } = json;
			if (typeof auth_token !== 'string')
				throw new TypeError('auth_token is not of type String.');
			setAccessToken(() => auth_token);
		}
	}, [apiEmail, apiToken]);

	return {
		accessToken,
	};
}

function useStates(accessToken: string) {
	const [states, setStates] = useState<string[]>([]);
	const [status, setStatus] = useState<LoadingStatus>('loading');
	// const [states, setStates] = useLocalStorage<string[]>('states', []);

	useEffect(() => {
		// don't need to fetch if already in cache
		// if (states?.length > 0) {
		// 	console.log('states in cache');
		// 	if (status !== 'loaded') setStatus('loaded');
		// 	return;
		// }

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
			if (!res.ok)
				throw new Error('Error requesting states. The response was not ok.');
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
	const [cities, setCities] = useState<string[]>([]);

	useEffect(() => {
		getCities()
			.then((cities) => {
				if (!cities) return;
				const cityNames = cities?.map((city) => city[CITY_NAME_KEY]);
				setCities(() => cityNames);
			})
			.catch((err) => {
				console.error(err);
			});
		async function getCities() {
			if (!accessToken || !state) return;

			const url = `${BASE_URL}/cities/${state}`;
			const headers = baseHeaders(accessToken);
			const response = await fetch(url, { headers });
			if (!response.ok)
				throw new Error('Error requesting cities. The response was not ok.');
			const citiesJson = await response.json();
			if (!isCitiesResponse(citiesJson))
				throw new TypeError(
					`Unexpected cities response type. Expected an array of objects with a key: ${CITY_NAME_KEY} containing the city name`,
				);
			return citiesJson;
		}
	}, [accessToken, state]);

	return { cities };
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
