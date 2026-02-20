import { Box, useToast, VStack } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ParamType } from "constants/trxnFramework";
import { useShopTypes } from "hooks";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import { useOnboardingContext } from "../../context";
import type { CustomComponentProps } from "../ContentRenderer";

interface FormData {
	selfie_image: File | null;
	shop_type: number | { value: number; label: string } | null;
	captured_latlong?: string;
	shop_name?: string;
}

const VideoKycStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	onSkip,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;
	const toast = useToast();
	const { userName, mobile, pipelineResults } = useOnboardingContext();
	const lastProcessedResultRef = useRef<any>(null);

	// Shop Types
	const { shopTypes, isLoading: isLoadingShopTypes } = useShopTypes();

	const {
		register,
		control,
		watch,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			selfie_image: null,
			shop_type: undefined,
			shop_name: "",
		},
	});

	const formValues = watch();

	// Calculate visibility of shop_name based on selected shop_type
	const isShopNameVisible = useMemo(() => {
		const selectedValue =
			typeof formValues.shop_type === "object" &&
			formValues.shop_type !== null
				? (formValues.shop_type as any).value
				: formValues.shop_type;

		if (!selectedValue) return false;

		const selectedOption = shopTypes.find((s) => s.value == selectedValue);
		const dependentParams = selectedOption?.dependent_params;

		if (Array.isArray(dependentParams)) {
			const shopNameParam = dependentParams.find(
				(p: any) => p.name === "shop_name"
			);
			return shopNameParam?.is_visible === 1;
		}

		return false;
	}, [formValues.shop_type, shopTypes]);

	// Parameter list for Form component (Image then Shop Type)
	// Note: Location is handled separately at the top
	const parameterList = useMemo(() => {
		const params: any[] = [
			{
				name: "captured_latlong",
				label: "Location",
				parameter_type_id: ParamType.GEOLOCATION,
				required: true,
			},
			{
				name: "selfie_image",
				label: "Take a live photo",
				parameter_type_id: ParamType.FILE,
				required: true,
				meta: {
					accept: "image/jpeg,image/png",
					cameraOnly: true,
					watermark:
						userName || mobile
							? {
									name:
										userName && mobile
											? `${userName} (${mobile})`
											: userName || mobile,
								}
							: true,
					options: {
						detectFace: true,
						minFaceCount: 1,
						maxFaceCount: 1,
					},
				},
			},
			{
				name: "shop_type",
				label: "Shop Type",
				parameter_type_id: ParamType.LIST,
				list_elements: shopTypes,
				required: true,
				meta: {
					placeholder: isLoadingShopTypes
						? "Loading..."
						: "--Select--",
					disabled: isLoadingShopTypes,
				},
			},
		];

		if (isShopNameVisible) {
			params.push({
				name: "shop_name",
				label: "Shop Name",
				parameter_type_id: ParamType.TEXT,
				required: true,
				meta: {
					placeholder: "Enter Shop Name",
				},
			});
		}

		return params;
	}, [shopTypes, isLoadingShopTypes, isShopNameVisible]);

	useEffect(() => {
		if (!isShopNameVisible) {
			setValue("shop_name", "");
		}
	}, [isShopNameVisible, setValue]);

	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		if (!result || result === lastProcessedResultRef.current) return;

		if (result.status === "success") {
			lastProcessedResultRef.current = result;
			toast({
				title: stepConfig.success_message || "KYC completed!",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		} else if (result.status === "failed") {
			lastProcessedResultRef.current = result;
			const failedStep = result.list.find((r) => r.status === "failed");
			const errorMessage =
				failedStep?.response?.message ||
				"Failed to complete KYC. Please try again.";
			toast({
				title: "Submission Failed",
				description: errorMessage,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
	]);

	const onFormSubmit = (data: FormData) => {
		if (!data.captured_latlong) {
			toast({
				title: "Location Required",
				description: "Please capture your location before proceeding.",
				status: "warning",
				duration: 3000,
			});
			return;
		}

		const shopTypeValue =
			typeof data.shop_type === "object"
				? (data.shop_type as any).value
				: data.shop_type;

		const formData: any = {
			captured_latlong: data.captured_latlong,
			shop_type: shopTypeValue,
			selfie_image: data.selfie_image,
		};

		if (data.shop_name) {
			formData.shop_name = data.shop_name;
		}

		onSubmit({
			id: stepConfig.id,
			form_data: formData,
		});
	};

	return (
		<VStack gap={6} align="stretch" w="full">
			<Box>
				<Box fontSize="2xl" fontWeight="medium">
					{stepConfig.label}
				</Box>
				<Box fontSize="sm" color="gray.600" mt={3}>
					{stepConfig.description}
				</Box>
			</Box>

			<form onSubmit={handleSubmit(onFormSubmit)}>
				<VStack gap={6} align="stretch">
					<Form
						parameter_list={parameterList}
						register={register as any}
						control={control as any}
						errors={errors as any}
						formValues={formValues as any}
						size="md"
					/>

					<ActionButtonGroup
						isFixedOnMobile={false}
						buttonConfigList={[
							{
								type: "submit",
								label: isSubmitting
									? "Processing..."
									: stepConfig.primaryCTAText || "Proceed",
								loading: isSubmitting,
								disabled: isSubmitting,
							},
							...(canSkip
								? [
										{
											type: "button",
											variant: "link",
											label: "Skip",
											disabled: isSubmitting,
											onClick: () =>
												onSkip?.(stepConfig.id),
											styles: {
												color: "primary.DEFAULT",
												bg: {
													base: "white",
													md: "none",
												},
												h: { base: "64px", md: "64px" },
												w: { base: "100%", md: "auto" },
												_hover: {
													textDecoration: "none",
												},
											},
										},
									]
								: []),
						]}
					/>
				</VStack>
			</form>
		</VStack>
	);
};

export default VideoKycStep;
