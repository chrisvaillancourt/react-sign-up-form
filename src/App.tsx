import { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import {
	useEnvironmentVariables,
	useAccessToken,
	useStates,
	useCities,
} from '@/hooks';

import './App.css';

export function App() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [state, setState] = useState('');
	const [city, setCity] = useState('');

	const { apiEmail, apiToken } = useEnvironmentVariables();
	const { accessToken } = useAccessToken({ apiEmail, apiToken });
	const { states, status: statesStatus } = useStates(accessToken);
	const { cities } = useCities(accessToken, state);

	function handleInputChange(
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		cb: Dispatch<SetStateAction<string>>,
	) {
		const {
			target: { value },
		} = e;

		cb(() => value);
	}
	function handleSubmit() {
		const formData = {
			firstName,
			lastName,
			state,
			city,
			email,
			password,
		};
		console.clear();
		console.log(formData);
	}

	return (
		<main>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<fieldset>
					<legend>Personal Information</legend>
					<Input
						type="text"
						name="first name"
						label="First name"
						id="first-name"
						placeholder="Enter first name"
						value={firstName}
						required
						onChange={(e) => {
							handleInputChange(e, setFirstName);
						}}
						onBlur={(e) => {
							handleInputChange(e, setFirstName);
							const isValid = e.target.checkValidity();
							if (!isValid) {
								e.target.setCustomValidity('First name is required.');
							}
						}}
					/>
					<Input
						type="text"
						name="last name"
						label="Last name"
						id="last-name"
						placeholder="Enter last name"
						required
						value={lastName}
						onChange={(e) => {
							handleInputChange(e, setLastName);
						}}
						onBlur={(e) => {
							handleInputChange(e, setLastName);
						}}
					/>
				</fieldset>
				<fieldset>
					<legend>Account Login</legend>
					<Input
						type="email"
						name="email"
						label="Email"
						id="email"
						placeholder="Enter email"
						required
						value={email}
						onChange={(e) => {
							handleInputChange(e, setEmail);
						}}
						onBlur={(e) => {
							handleInputChange(e, setEmail);
						}}
					/>
					<Input
						type="password"
						name="password"
						label="Password"
						id="password"
						placeholder="Enter password"
						required
						value={password}
						onChange={(e) => {
							handleInputChange(e, setPassword);
						}}
						onBlur={(e) => {
							handleInputChange(e, setPassword);
						}}
					/>
				</fieldset>
				<fieldset>
					<legend>Location</legend>
					<Select
						label="State"
						id="state"
						name="state"
						required
						options={states}
						status={statesStatus}
						disabled={statesStatus === 'loading'}
						onChange={(e) => {
							handleInputChange(e, setState);
							setCity('');
						}}
						onBlur={(e) => {
							handleInputChange(e, setState);
							setCity('');
						}}
						value={state}
					/>
					<Select
						label="City"
						id="city"
						name="city"
						options={cities}
						value={city}
						required
						disabled={!state}
						onChange={(e) => {
							handleInputChange(e, setCity);
						}}
						onBlur={(e) => {
							handleInputChange(e, setCity);
						}}
					/>
				</fieldset>
				<button>Submit</button>
			</form>
		</main>
	);
}
