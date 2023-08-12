import type { SelectHTMLAttributes } from 'react';
import type { LoadingStatus } from '@/types';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: string[];
	status?: LoadingStatus;
	placeholder?: string;
}

export function Select({
	label,
	status,
	id,
	options,
	placeholder,
	...rest
}: Props) {
	return (
		<>
			<label htmlFor={id}>{label}: </label>
			<select {...rest}>
				<option value="">{placeholder}</option>
				{options.map((option) => (
					<option value={option} key={option}>
						{option}
					</option>
				))}
			</select>
		</>
	);
}
