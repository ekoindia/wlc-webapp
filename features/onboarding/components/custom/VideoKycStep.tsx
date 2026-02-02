import { Box, Text, VStack } from "@chakra-ui/react";
import { ActionButtonGroup, Dropzone } from "components";
import { useState } from "react";
import type { CustomComponentProps } from "../ContentRenderer";

/**
 * VideoKycStep - Custom component for selfie/video KYC onboarding
 * Uses Dropzone with cameraOnly mode for consistent UI with other screens
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const VideoKycStep = ({
	stepConfig,
	onSubmit,
	onSkip,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const [selfieImage, setSelfieImage] = useState<File | null>(null);

	const hasImage = selfieImage !== null;

	/**
	 * Handle form submission
	 */
	const handleFormSubmit = () => {
		if (!selfieImage) return;

		const formData = {
			videoKyc: {
				url: URL.createObjectURL(selfieImage),
				fileData: selfieImage,
			},
		};

		onSubmit({
			id: stepConfig.id,
			form_data: formData,
		});
	};

	return (
		<VStack gap={6} align="stretch" w="full">
			{/* Header */}
			<Box>
				<Text fontSize="2xl" fontWeight="medium">
					{stepConfig.label}
				</Text>
				<Text fontSize="sm" color="gray.600" mt={3}>
					{stepConfig.description}
				</Text>
			</Box>

			{/* Dropzone with camera only mode */}
			<Box flex={1} w="full">
				<Dropzone
					label="Take a live photo with ID proof"
					file={selfieImage}
					setFile={setSelfieImage}
					accept="image/jpeg,image/png"
					cameraOnly={true}
					watermark={true}
					required={true}
					hideOptionalMark={true}
					options={{
						detectFace: true,
						minFaceCount: 1,
						maxFaceCount: 1,
					}}
				/>
			</Box>

			{/* Required validation message */}
			{!hasImage && (
				<Text textAlign="center" fontSize="xs" color="red.500">
					Required
				</Text>
			)}

			{/* Action buttons */}
			<ActionButtonGroup
				isFixedOnMobile={false}
				buttonConfigList={[
					{
						type: "submit",
						label: isSubmitting
							? "Please wait..."
							: stepConfig.primaryCTAText || "Next",
						loading: isSubmitting,
						disabled: isSubmitting || !hasImage,
						onClick: handleFormSubmit,
					},
					...(onSkip
						? [
								{
									type: "button" as const,
									label: "Skip",
									variant: "outline" as const,
									onClick: () => onSkip(stepConfig.id),
									disabled: isSubmitting,
								},
							]
						: []),
				]}
			/>
		</VStack>
	);
};

export default VideoKycStep;
