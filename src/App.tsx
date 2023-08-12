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
	const { cities, status: citiesStatus } = useCities(accessToken, state);

	/**
	 * Generic helper to destructure the current value of an input/select
	 * and pass it to a SetStateAction.
	 */
	function handleInputChange(
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		cb: Dispatch<SetStateAction<string>>,
	) {
		const {
			target: { value },
		} = e;

		cb(value);
	}
	function handleSubmit() {
		// TODO put in request body
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
			<h1>
				<span className="first">React Sign-up Form</span>
				<span className="second">React Sign-up Form</span>
				<span className="third">React Sign-up Form</span>
			</h1>
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
							const emailRegex = new RegExp(
								/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
								'gm',
							);
							const isValid = emailRegex.test(e.target.value);
							e.target.setCustomValidity(isValid ? '' : 'Enter valid email');
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
						placeholder={
							statesStatus === 'loading' ? 'loading...' : `Select a State`
						}
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
					{/*
					 * we could use CSS `content-visibility: auto` to improve rendering perf
					 * https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility
					 */}
					<Select
						label="City"
						id="city"
						name="city"
						options={cities}
						value={city}
						required
						disabled={!state || citiesStatus === 'loading'}
						status={citiesStatus}
						placeholder={
							citiesStatus === 'pending'
								? 'Select a State'
								: citiesStatus === 'loading'
								? 'loading...'
								: 'Select a City'
						}
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
