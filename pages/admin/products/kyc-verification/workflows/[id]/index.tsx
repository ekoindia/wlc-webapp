import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { Button, PaddingBox, PageTitle } from "components";
import type { SerializedWorkflow } from "components/WorkflowBuilder/types";
import { KycServicesProvider } from "features/kyc-verification";
import { KycWorkflowExecutor } from "features/kyc-verification/components/KycWorkflowExecutor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const AdminWorkflowExecutionPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const [workflow, setWorkflow] = useState<SerializedWorkflow | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id || typeof id !== "string") return;

		try {
			// Find the workflow in localStorage
			const storeStr = localStorage.getItem("kyc-workflow-builder");
			if (storeStr) {
				const store = JSON.parse(storeStr);
				const matchedWorkflow = store?.workflows?.[id];
				if (matchedWorkflow) {
					setWorkflow(matchedWorkflow);
				} else {
					setError("Workflow not found or has been deleted.");
				}
			} else {
				setError("No saved workflows found.");
			}
		} catch (err) {
			console.error("Error loading workflow:", err);
			setError("Failed to load workflow data.");
		}
	}, [id]);

	if (error) {
		return (
			<PaddingBox>
				<PageTitle title="Execute Workflow" />
				<Box p="6" bg="red.50" color="red.800" borderRadius="md">
					<Text mb="4">{error}</Text>
					<Button
						onClick={() =>
							router.push("/admin/products/kyc-verification")
						}
					>
						Return to Verification Home
					</Button>
				</Box>
			</PaddingBox>
		);
	}

	if (!workflow) {
		return (
			<PaddingBox>
				<PageTitle title="Execute Workflow" />
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="lg" color="primary.DEFAULT" />
				</Flex>
			</PaddingBox>
		);
	}

	return (
		<PaddingBox>
			<KycServicesProvider>
				<KycWorkflowExecutor
					workflow={workflow}
					basePath="/admin/products/kyc-verification"
				/>
			</KycServicesProvider>
		</PaddingBox>
	);
};

export default AdminWorkflowExecutionPage;
