import { Box, Flex } from "@chakra-ui/react";
import { ActionButtonGroup, PageTitle } from "components";
import router from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components/Form";
import { BbpsContext } from "./context/BbpsContext";
import { useBbpsApi } from "./hooks/useBbpsApi";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";
import { BbpsProduct } from "./types";

export const Search = ({ product }: { product: BbpsProduct }) => {
	const { state, dispatch } = useContext(BbpsContext);
	const nav = useBbpsNavigation();
	const { fetchBills, processBillFetchResponse, isLoadingBills } =
		useBbpsApi(product);

	const { useMockData } = state;

	// Set mock data flag based on product configuration
	useEffect(() => {
		if (product?.useMockData !== useMockData) {
			dispatch({
				type: "SET_MOCK_DATA_FLAG",
				useMockData: product?.useMockData || false,
			});
		}
	}, [product?.useMockData, useMockData, dispatch]);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: product.defaultSearchValues || {},
	});

	console.log("[BBPS] Search errors", errors);
	console.log("[BBPS] Search isValid", isValid);

	const onSubmit = async (payload: Record<string, string>) => {
		console.log("[BBPS] onSubmit", payload);

		// Store search form payload in context
		dispatch({ type: "SET_SEARCH_PAYLOAD", payload: payload });

		// Show loading state
		dispatch({ type: "SET_LOADING", value: true });

		try {
			// Fetch bills (will use mock if product.useMockData is true)
			const { data: response, error } = await fetchBills(payload);

			// Handle error case
			if (error || !response) {
				dispatch({
					type: "SET_ERROR",
					message:
						error || "Failed to fetch bills. Please try again.",
				});
				return;
			}

			// Success case: status === 0
			if (response.status === 0 && response.data) {
				// Transform and store the validation response
				const transformedData = processBillFetchResponse(response);

				if (transformedData) {
					dispatch({
						type: "SET_VALIDATION_RESPONSE",
						payload: transformedData,
					});

					console.log("[BBPS] Transformed response", transformedData);
					nav.goPreview();
				} else {
					dispatch({
						type: "SET_ERROR",
						message:
							"No bills found. Please check your input and try again.",
					});
				}
			} else {
				// Error case: status !== 0
				const errorMessage =
					response.message ||
					"Failed to fetch bills. Please check your input and try again.";
				dispatch({ type: "SET_ERROR", message: errorMessage });
			}
		} catch (error) {
			console.error("[BBPS] Error in onSubmit:", error);
			dispatch({
				type: "SET_ERROR",
				message: "An unexpected error occurred. Please try again.",
			});
		} finally {
			// Hide loading state
			dispatch({ type: "SET_LOADING", value: false });
		}
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Proceed",
			loading: isSubmitting || isLoadingBills,
			disabled: !isValid,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Flex direction="column">
			<PageTitle
				title="Search"
				subtitle="Search for bills"
				toolComponent={
					useMockData && (
						<Box
							px={2}
							py={1}
							bg="yellow.100"
							color="yellow.800"
							borderRadius="md"
							fontSize="sm"
							fontWeight="medium"
						>
							Mock Mode
						</Box>
					)
				}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex
					direction="column"
					px={{ base: "6", md: "8" }}
					mx={{ base: "4", md: "0" }}
					pt="6"
					pb="8"
					bg="white"
					gap="8"
					border="card"
					boxShadow="basic"
					borderRadius="10px"
				>
					<Form
						parameter_list={product.searchFields}
						register={register}
						formValues={state.searchFormData}
						control={control}
						errors={errors}
					/>
					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</form>
		</Flex>
	);
};
