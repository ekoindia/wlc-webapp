import { Box, useToast, VStack } from "@chakra-ui/react";
import { ActionButtonGroup, LocationCapture } from "components";
import { ParamType } from "constants/trxnFramework";
import { useShopTypes } from "hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import { useOnboardingContext } from "../../context";
import type { CustomComponentProps } from "../ContentRenderer";

interface FormData {
	selfie_image: File | null;
	shop_type: number | { value: number; label: string } | null;
}

const VideoKycStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const toast = useToast();
	const { pipelineResults } = useOnboardingContext();
	const lastProcessedResultRef = useRef<any>(null);

	// Location State
	const [capturedLocation, setCapturedLocation] = useState<string | null>(
		null
	);

	// Shop Types
	const { shopTypes, isLoading: isLoadingShopTypes } = useShopTypes();

	const {
		register,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			selfie_image: null,
			shop_type: undefined,
		},
	});

	const formValues = watch();

	// Parameter list for Form component (Image then Shop Type)
	// Note: Location is handled separately at the top
	const parameterList = useMemo(() => {
		return [
			{
				name: "selfie_image",
				label: "Take a live photo with ID proof",
				parameter_type_id: ParamType.FILE,
				required: true,
				meta: {
					accept: "image/jpeg,image/png",
					cameraOnly: true,
					watermark: true,
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
	}, [shopTypes, isLoadingShopTypes]);

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
		if (!capturedLocation) {
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

		const formData = {
			captured_latlong: capturedLocation,
			shop_type: shopTypeValue,
			selfie_image: data.selfie_image,
		};

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

			{/* Location Capture Section */}
			<LocationCapture onCaptured={setCapturedLocation} />

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
						]}
					/>
				</VStack>
			</form>
		</VStack>
	);
};

export default VideoKycStep;
