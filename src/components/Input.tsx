import type { HTMLInputTypeAttribute, ChangeEvent } from 'react';

interface Props {
	value: string;
	id: string;
	type: HTMLInputTypeAttribute;
	label: string;
	name: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
	value,
	id,
	type,
	label,
	name,
	onChange,
	onBlur,
}: Props) {
	return (
		<>
			<label htmlFor={id}>{`${label}: `}</label>
			<input
				type={type}
				name={name}
				id={id}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</>
	);
}
