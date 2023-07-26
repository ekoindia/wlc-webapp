import {
	Box,
	chakra,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Image,
	Select,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import { Button, Headings, Input } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * A <NotificationCreator> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<NotificationCreator></NotificationCreator>` TODO: Fix example
 */
const NotificationCreator = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm({
		defaultValues: {
			priority: 1,
			status: 1,
		},
	});

	const toast = useToast();

	const [previewImage, setPreviewImage] = useState(null);
	const [_networkList, setNetworkList] = useState([]);
	const [ready, setReady] = useState(false);

	const { isLoggedIn, isAdmin, accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	const Fieldset = chakra("fieldset", {
		baseStyle: {
			borderWidth: "1px",
			borderColor: "bg",
			borderStyle: "dashed",
			borderRadius: "md",
			padding: "1em 1.2em",
		},
	});

	const Legend = chakra("legend", {
		baseStyle: {
			// marginLeft: "0.2em",
			// paddingX: "0.2em",
			fontSize: { base: "sm", "2xl": "lg" },
			fontWeight: "semibold",
			color: "inputlabel",
		},
	});

	// Download the list of agents in the network for sending notification
	// This list is to be passed to the final API call for sending notification.
	useEffect(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				headers: {
					"Content-Type": "application/json",
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agents/ids",
					"tf-req-method": "GET",
				},
				token: accessToken,
			},
			generateNewToken
		)
			.then((data) => {
				if (data.status === 0 && data?.data?.csp_list?.length > 0) {
					const networkList = data?.data?.csp_list ?? [];
					console.log(
						"[Send Notifications] networkList: ",
						networkList
					);
					setNetworkList(networkList);
					setReady(true);
				}
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error(
					"[Send Notifications] Failed to get network list:",
					error
				);
			});
	}, [accessToken, isLoggedIn, isAdmin]);

	// Check if the user is logged in and is an admin, before showing the page
	if (!isLoggedIn || !isAdmin) {
		return null;
	}

	const onSubmit = (data) => {
		// Here we would make our API request or whatever needs to be done with the form data
		toast({
			title: data.title,
			description: data.description + " - " + data.image,
			status: getStatus(data.status),
			duration: 5000,
			isClosable: true,
		});
	};

	const handleImageChange = (e) => {
		// Set the value of 'image' manually in react-hook-form
		setValue("image", e.target.files[0]);

		const reader = new FileReader();
		reader.onloadend = () => {
			console.log("reader.result", reader.result);
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const getStatus = (status) => {
		switch (status) {
			case "1":
				return "info";
			case "2":
				return "success";
			case "3":
				return "error";
			case "4":
				return "warning";
			default:
				return "info";
		}
	};

	return (
		<>
			<Headings
				title="Send Notification"
				subtitle="Send notifications to your entire network"
				hasIcon={false}
			/>

			<Box p={{ base: "1em", md: "2em" }} bg="white" borderRadius={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* <FormControl> */}
					<Input
						id="name"
						label="Notification Name/Purpose"
						maxLength="30"
						required
						invalid={errors.name ? true : false}
						errorMsg={errors?.name?.message}
						description="Describe the purpose for this notification. This is for internal use only."
						maxW={{ base: "auto", lg: "400px" }}
						mb={6}
						{...register("name", {
							required: true,
							minLength: {
								value: 4,
								message: "Minimum 4 characters required",
							},
						})}
					/>
					{/* </FormControl> */}

					<FormControl mb={6} maxW={{ base: "auto", lg: "400px" }}>
						<Input
							id="title"
							required
							label="Notification Title"
							invalid={errors.title ? true : false}
							errorMsg={errors?.title?.message}
							maxLength="100"
							{...register("title", {
								required: true,
								minLength: 6,
								maxLength: 100,
							})}
						/>
					</FormControl>

					<FormControl
						id="description"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.description}
					>
						<FormLabel>Description</FormLabel>
						<Textarea
							maxLength="500"
							// theme="accent"
							borderRadius="6px"
							borderColor="hint"
							isRequired={true}
							_focus={{
								bg: "focusbg",
								boxShadow: "0px 3px 6px #0000001A",
								borderColor: "hint",
								transition: "box-shadow 0.3s ease-out",
							}}
							{...register("description", {
								required: true,
								maxLength: 500,
							})}
						/>
						{errors.description ? (
							<FormErrorMessage>
								{errors?.description?.message}
							</FormErrorMessage>
						) : null}
					</FormControl>

					<FormControl
						id="priority"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.priority}
					>
						<FormLabel>Priority</FormLabel>
						<Select {...register("priority", { required: true })}>
							<option value="1">Normal</option>
							<option value="2">Low</option>
							<option value="3">High</option>
						</Select>
						{errors.priority ? (
							<FormErrorMessage>
								{errors?.priority?.message}
							</FormErrorMessage>
						) : null}
					</FormControl>

					<FormControl
						id="status"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.status}
					>
						<FormLabel>Status</FormLabel>
						<Select {...register("status", { required: true })}>
							<option value="1">Info</option>
							<option value="2">Success</option>
							<option value="3">Error</option>
							<option value="4">Warning</option>
						</Select>
						{errors.status ? (
							<FormErrorMessage>
								{errors?.status?.message}
							</FormErrorMessage>
						) : null}
					</FormControl>

					<FormControl mb={6} maxW={{ base: "auto", lg: "400px" }}>
						<Input
							id="image"
							type="file"
							label="Add an Image"
							description={
								previewImage
									? ""
									: "Add an image to your notification"
							}
							accept="image/png, image/jpeg"
							invalid={errors.image ? true : false}
							errorMsg={errors?.image?.message}
							onChange={handleImageChange}
							// {...register("image")}
						/>
						{previewImage ? <Image src={previewImage} /> : null}
					</FormControl>

					<Fieldset maxW={{ base: "auto", lg: "400px" }}>
						<Legend>Add a Link</Legend>
						<FormControl

						// maxW={{ base: "auto", lg: "400px" }}
						>
							<Input
								id="link"
								type="url"
								label="Link URL"
								invalid={errors.link ? true : false}
								errorMsg={errors?.link?.message}
								maxLength="100"
								placeholder="https://..."
								mb={6}
								{...register("link")}
							/>
						</FormControl>

						<FormControl
							mb={6}
							// maxW={{ base: "auto", lg: "400px" }}
							isInvalid={errors.link}
						>
							<Input
								id="linklabel"
								label="Link Label"
								invalid={errors.linklabel ? true : false}
								errorMsg={errors?.linklabel?.message}
								maxLength="25"
								placeholder="eg: Click To Know More"
								{...register("linklabel")}
							/>
						</FormControl>
					</Fieldset>

					<Button
						loading2={isSubmitting || !ready}
						mt={4}
						type="submit"
						size="lg"
					>
						{ready ? "Submit" : "Loading..."}
					</Button>
				</form>
			</Box>
		</>
	);
};

export default NotificationCreator;
