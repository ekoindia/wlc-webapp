/**
 * AddUserModal - Modal for adding a new user.
 * Allows admins to add a user with Name, Mobile Number, and Initial Credits.
 */

import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Modal } from "components";
import { ParamType } from "constants/trxnFramework";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";

interface AddUserModalProps {
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback to close the modal */
	onClose: () => void;
}

interface AddUserFormValues {
	name: string;
	mobile: string;
	initial_credits: number;
}

/** Form field configuration for Add User form */
const ADD_USER_FIELDS = [
	{
		name: "name",
		label: "Name",
		required: true,
		placeholder: "Enter full name",
		validations: {
			minLength: {
				value: 2,
				message: "Name must be at least 2 characters",
			},
		},
	},
	{
		name: "mobile",
		label: "Mobile Number",
		parameter_type_id: ParamType.MOBILE,
		required: true,
		validations: {
			minLength: {
				value: 10,
				message: "Enter valid 10-digit mobile number",
			},
			maxLength: {
				value: 10,
				message: "Enter valid 10-digit mobile number",
			},
		},
	},
	{
		name: "initial_credits",
		label: "Initial Credits",
		parameter_type_id: ParamType.NUMERIC,
		required: true,
		defaultValue: 0,
		helperText: "Credits to assign to the new user",
	},
];

/**
 * Modal component for adding a new user.
 * Provides a form with Name, Mobile Number, and Initial Credits fields.
 * @param {AddUserModalProps} props - The component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback function to close the modal
 * @returns {JSX.Element} The rendered modal component
 */
export const AddUserModal = ({
	isOpen,
	onClose,
}: AddUserModalProps): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<AddUserFormValues>({
		defaultValues: {
			name: "",
			mobile: "",
			initial_credits: 0,
		},
	});

	// Handle modal close - reset form state
	const handleClose = () => {
		reset();
		onClose();
	};

	// Handle form submission
	const onSubmit = async (data: AddUserFormValues) => {
		setIsSubmitting(true);

		try {
			// TODO: Integrate with actual API endpoint
			console.log("[AddUserModal] Submitting:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "User Added Successfully",
				description: `${data.name} has been added with ${data.initial_credits} credits.`,
				status: "success",
				duration: 4000,
				isClosable: true,
			});

			handleClose();
		} catch (err) {
			console.error("Error adding user:", err);
			toast({
				title: "Error Adding User",
				description:
					"An error occurred while adding the user. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Action button configuration
	const buttonConfigList = [
		{
			label: "Add User",
			onClick: handleSubmit(onSubmit),
			disabled: isSubmitting,
			loading: isSubmitting,
			icon: "check-circle",
			styles: {
				borderRadius: "10px",
			},
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: handleClose,
			styles: {
				color: "primary.DEFAULT",
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Add New User"
			size="md"
		>
			<Flex direction="column" gap="6">
				<Text fontSize="sm" color="gray.500" mt="-4">
					Add a new user to the system
				</Text>

				<Form
					parameter_list={ADD_USER_FIELDS}
					register={register as any}
					control={control as any}
					errors={errors as any}
					formValues={watch() as any}
				/>

				{/* Actions */}
				<ActionButtonGroup
					w="full"
					pos="initial"
					direction="row"
					gap="8"
					buttonConfigList={buttonConfigList}
				/>
			</Flex>
		</Modal>
	);
};

export default AddUserModal;
