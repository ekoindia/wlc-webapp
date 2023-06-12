import {
	Box,
	FormControl,
	FormErrorMessage,
	FormHelperText,
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
		formState: { errors },
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
		).then((data) => {
			if (data.status === 0 && data?.data?.csp_list?.length > 0) {
				const networkList = data?.data?.csp_list ?? [];
				console.log("[Send Notifications] networkList: ", networkList);
				setNetworkList(networkList);
				setReady(true);
			}
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
					<FormControl
						id="name"
						isRequired
						mb={6}
						isInvalid={errors.name}
					>
						<FormLabel>Notification Name/Purpose</FormLabel>
						<Input
							type="text"
							maxLength="30"
							invalid={errors.name ? true : false}
							errorMsg={errors.name}
							description="Describe the purpose for this notification. This is for internal use only."
							maxW={{ base: "auto", lg: "400px" }}
							{...register("name", {
								required: true,
								maxLength: 30,
							})}
						/>
					</FormControl>

					<FormControl
						id="title"
						isRequired
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.title}
					>
						<FormLabel>Title</FormLabel>
						<Input
							type="text"
							maxLength="100"
							{...register("title", {
								required: true,
								maxLength: 100,
							})}
						/>
					</FormControl>

					<FormControl
						id="description"
						isRequired
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.description}
					>
						<FormLabel>Description</FormLabel>
						<Textarea
							maxLength="500"
							// theme="primary"
							borderRadius="6px"
							borderColor="hint"
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
					</FormControl>

					<FormControl
						id="image"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.image}
					>
						<FormLabel>Image</FormLabel>
						<Input
							type="file"
							accept="image/png, image/jpeg"
							onChange={handleImageChange}
							// {...register("image")}
						/>
						{previewImage ? (
							<Image src={previewImage} />
						) : errors.image ? (
							<FormErrorMessage>{errors.image}</FormErrorMessage>
						) : (
							<FormHelperText>
								Add an image to your notification (optional)
							</FormHelperText>
						)}
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
					</FormControl>

					<FormControl
						id="link"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.link}
					>
						<FormLabel>Link</FormLabel>
						<Input
							type="url"
							maxLength="100"
							placeholder="https://..."
							{...register("link")}
						/>
					</FormControl>

					<FormControl
						id="linklabel"
						mb={6}
						maxW={{ base: "auto", lg: "400px" }}
						isInvalid={errors.link}
					>
						<FormLabel>Link Label</FormLabel>
						<Input
							type="text"
							maxLength="25"
							placeholder="eg: Click To Know More"
							{...register("linklabel")}
						/>
					</FormControl>

					<Button loading={!ready} mt={4} type="submit" size="lg">
						{ready ? "Submit" : "Loading..."}
					</Button>
				</form>
			</Box>
		</>
	);
};

export default NotificationCreator;
