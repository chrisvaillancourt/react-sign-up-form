import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

export function Input({ id, label, ...rest }: Props) {
	return (
		<>
			<label htmlFor={id}>{`${label}: `}</label>
			<input id={id} {...rest} />
		</>
	);
}
