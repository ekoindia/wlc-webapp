import {
	Box,
	FormControl,
	FormLabel,
	Image,
	Input,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import { Button, Headings } from "components";
import { useState } from "react";
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
			<Headings title="Send Notification" hasIcon={false} />

			<Box p={{ base: "1em", md: "2em" }} bg="white" borderRadius={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormControl id="name" mb={6} isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input
							type="text"
							{...register("name", {
								required: true,
								maxLength: 50,
							})}
						/>
					</FormControl>

					<FormControl id="title" mb={6} isInvalid={errors.title}>
						<FormLabel>Title</FormLabel>
						<Input
							type="text"
							{...register("title", {
								required: true,
								maxLength: 50,
							})}
						/>
					</FormControl>

					<FormControl
						id="description"
						mb={6}
						isInvalid={errors.description}
					>
						<FormLabel>Description</FormLabel>
						<Textarea
							{...register("description", {
								required: true,
								maxLength: 500,
							})}
						/>
					</FormControl>

					<FormControl id="image" mb={6} isInvalid={errors.image}>
						<FormLabel>Image</FormLabel>
						<Input
							type="file"
							accept="image/png, image/jpeg"
							onChange={handleImageChange}
							// {...register("image")}
						/>
						{previewImage && <Image src={previewImage} />}
					</FormControl>

					<FormControl
						id="priority"
						mb={6}
						isInvalid={errors.priority}
					>
						<FormLabel>Priority</FormLabel>
						<select {...register("priority", { required: true })}>
							<option value="1">Normal</option>
							<option value="2">Low</option>
							<option value="3">High</option>
						</select>
					</FormControl>

					<FormControl id="status" mb={6} isInvalid={errors.status}>
						<FormLabel>Status</FormLabel>
						<select {...register("status", { required: true })}>
							<option value="1">Info</option>
							<option value="2">Success</option>
							<option value="3">Error</option>
							<option value="4">Warning</option>
						</select>
					</FormControl>

					<FormControl id="link" mb={6} isInvalid={errors.link}>
						<FormLabel>Link</FormLabel>
						<Input type="url" {...register("link")} />
					</FormControl>

					<FormControl id="linklabel" mb={6} isInvalid={errors.link}>
						<FormLabel>Link Label</FormLabel>
						<Input type="text" {...register("linklabel")} />
					</FormControl>

					<Button mt={4} type="submit" size="lg">
						Submit
					</Button>
				</form>
			</Box>
		</>
	);
};

export default NotificationCreator;
