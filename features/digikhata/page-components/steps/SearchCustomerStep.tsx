import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { ANIMATION } from "../../constants";

interface SearchCustomerStepProps {
	onSearch: (_mobile: string) => void;
	isLoading: boolean;
}

/**
 * Step for searching a customer by mobile number in assisted mode.
 * The agent enters the customer's 10-digit mobile number to load their wallet.
 * @param root0
 * @param root0.onSearch
 * @param root0.isLoading
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
			<Flex direction="column" gap={1}>
				<Box fontSize="4xl" userSelect="none">
					🔍
				</Box>
				<Text fontWeight="semibold" fontSize="md" color="dark">
					Search Customer
				</Text>
				<Text fontSize="sm" color="light" maxW="360px">
					Enter the customer&apos;s 10-digit mobile number to load
					their DigiKhata wallet details.
				</Text>
			</Flex>

			<Box>
				<FormControl>
					<FormLabel>Customer Mobile Number</FormLabel>
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
