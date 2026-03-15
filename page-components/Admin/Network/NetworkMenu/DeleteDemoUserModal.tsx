import { Flex, Text, useToast } from "@chakra-ui/react";
import { Button, Modal } from "components";
import { Endpoints } from "constants/index";
import { fetcher } from "helpers";
import React, { useState } from "react";

interface DeleteDemoUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	eko_code: string;
	accessToken: string;
	onDeleteDemoUser?: (_eko_code: string) => void;
}

export const DeleteDemoUserModal: React.FC<DeleteDemoUserModalProps> = ({
	isOpen,
	onClose,
	eko_code,
	accessToken,
	onDeleteDemoUser,
}) => {
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteDemoUserConfirm = async () => {
		setIsLoading(true);
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.TRANSACTION_JSON,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `/network/agent`,
						"tf-req-method": "POST",
					},
					body: {
						csp_code: eko_code,
						source: "WLC",
						version: "v1",
					},
					token: accessToken,
				}
			);

			const isSuccess = response.status === 0;

			if (isSuccess) {
				toast({
					title:
						response.message || "Demo user deleted successfully!",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				if (onDeleteDemoUser) {
					onDeleteDemoUser(eko_code);
				}
				onClose();
			} else if (response.status === 1) {
				toast({
					title: response.message || "Failed to delete demo user",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error deleting demo user:", error);
			toast({
				title: "Network error. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete Demo User">
			<Flex direction="column" gap="8" pb="4">
				<Text>
					Are you sure you want to delete this demo user account? This
					action cannot be undone.
				</Text>
				<Flex gap="4">
					<Button
						onClick={onClose}
						variant="ghost"
						size="lg"
						width="100%"
						fontSize="lg"
						isDisabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleDeleteDemoUserConfirm}
						size="lg"
						width="100%"
						fontSize="lg"
						colorScheme="red"
						loading={isLoading}
					>
						Delete
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};
