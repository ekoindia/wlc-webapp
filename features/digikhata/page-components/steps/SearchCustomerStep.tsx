import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION } from "../../constants";

interface SearchCustomerStepProps {
	onSearch: (_mobile: string) => void;
	isLoading: boolean;
}

/**
 * Step for searching a customer by mobile number in assisted mode.
 * The agent enters the customer's 10-digit mobile number to load their wallet.
 * @param {object} root0 - Component props
 * @param {(mobile: string) => void} root0.onSearch - Callback with searched mobile number
 * @param {boolean} root0.isLoading - Loading state indicator
 * @returns {JSX.Element} Mobile number search input form with validation
 */
export const SearchCustomerStep = ({
	onSearch,
	isLoading,
}: SearchCustomerStepProps): JSX.Element => {
	const [mobile, setMobile] = useState("");

	const isValid = mobile.length === 10;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 10);
		setMobile(value);
	};

	const handleSubmit = () => {
		if (isValid && !isLoading) {
			onSearch(mobile);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<Flex
			direction="column"
			gap={5}
			sx={{
				animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				animationDelay: ANIMATION.STEP_IN_DELAY,
			}}
		>
			<StepHeader
				title="Search Customer"
				subtitle="Enter the customer's 10-digit mobile number to load their DigiKhata wallet details."
			/>

			<Box>
				<FormControl>
					<FormLabel>Enter Mobile Number</FormLabel>
					<Input
						type="tel"
						placeholder="Enter 10-digit mobile number"
						value={mobile}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						maxLength={10}
						inputMode="numeric"
						borderColor="hint"
						_hover={{ borderColor: "hint" }}
						_focus={{
							borderColor: "primary.light",
							boxShadow: "0 0 0 1px primary.light",
						}}
					/>
				</FormControl>
			</Box>

			<Button
				w="full"
				bg="primary.DEFAULT"
				color="white"
				borderRadius="10"
				size="lg"
				isDisabled={!isValid || isLoading}
				isLoading={isLoading}
				onClick={handleSubmit}
				sx={{
					animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
					animationDelay: ANIMATION.CTA_DELAY,
				}}
				_hover={{ bg: "primary.dark" }}
			>
				Search Customer →
			</Button>
		</Flex>
	);
};
