import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Spinner,
	useToast,
} from "@chakra-ui/react";
import { usePubSub } from "contexts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Names of the modules that can be loaded
 */
export type ModuleNameType =
	| "Feedback"
	| "FileViewer"
	| "ImageEditor"
	| "Camera"
	| "Notifications"
	| "AiChatWidget";
// | "Support"
// | "About";

/**
 * Data type for the module to load dynamically
 */
type ModuleDataType = {
	feature: ModuleNameType;
	options?: object;
	resultTopic?: string;
	result?: any;
};

/**
 * Default options for each module
 */
const DefaultOptions: {
	[_key in ModuleNameType]: {
		/**
		 * Title of the popup (optional). Works better with "drawer" style.
		 */
		title?: string;

		/**
		 * Properties to pass to the module
		 */
		props?: { [key: string]: any };

		/**
		 * Type of pupup style to use: "modal" (default) or "drawer"
		 */
		popupStyle?: "modal" | "drawer";

		/**
		 * Styles attributes to apply to the modal dialog (Modal or Panel)
		 */
		dialogStyles?: { [key: string]: any };

		/**
		 * Styles attributes to apply to the modal popup. Eg: width, height, etc.
		 */
		style?: { [key: string]: any };

		/**
		 * Styles attributes to apply to the close button in the modal popup.
		 */
		closeBtnStyle?: { [key: string]: any };

		/**
		 * Style attributes to apply to the modal overlay.
		 */
		overlayStyle?: { [key: string]: any };

		/**
		 * Whether to hide the default close icon in the modal popup.
		 * It can be useful if the component has its own close button.
		 */
		hideCloseIcon?: boolean;
	};
} = {
	Feedback: {
		props: {
			heading: "Raise Query",
			origin: "Global-Help",
			// showCloseIcon: true,
		},
		closeBtnStyle: {
			boxShadow: "none",
		},
		style: {
			w: { base: "100%", md: "650px", lg: "800px" },
		},
		// minW: { base: "100%", md: "400px" },
	},
	FileViewer: {
		style: {
			m: "0",
			borderRadius: "6px",
			overflow: "hidden",
			pointerEvents: "none",
		},
		closeBtnStyle: {
			position: "fixed",
			top: "5px",
			right: "10px",
		},
	},
	ImageEditor: {
		hideCloseIcon: true,
		props: {
			maxLength: "1024", // Maximum length of the longer side of the image in px
		},
		style: {
			m: "0",
			borderRadius: "6px",
			overflow: "hidden",
			pointerEvents: "none",
		},
		overlayStyle: {
			bg: "blackAlpha.800",
		},
	},
	Camera: {
		hideCloseIcon: true,
		style: {
			m: "0",
			borderRadius: "6px",
			overflow: "hidden",
			// pointerEvents: "none",
		},
		overlayStyle: {
			bg: "blackAlpha.800",
		},
	},
	Notifications: {
		title: "Notifications",
		popupStyle: "drawer",
		dialogStyles: {
			size: { base: "full", md: "md" },
		},
		// props: {},
	},
	AiChatWidget: {
		title: "Chat with AI",
		hideCloseIcon: true,
		dialogStyles: {
			isCentered: true,
		},
		props: {
			isPopupMode: true,
		},
		style: {
			w: { base: "100%", md: "650px" },
		},
	},
	// About: {},
};

/**
 * List of modules that can be loaded dynamically.
 * Module name mapped to to the dynamically imported component.
 */
const moduleList: { [_key in ModuleNameType]: any } = {
	Feedback: dynamic(
		() =>
			import("page-components/RaiseIssueCard").then(
				(pkg) => pkg.RaiseIssueCard
			) as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
	FileViewer: dynamic(
		() => import("components/FileView").then((pkg) => pkg.FileView) as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
	ImageEditor: dynamic(
		() =>
			import("page-components/ImageEditor").then(
				(pkg) => pkg.ImageEditor
			) as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
	Camera: dynamic(
		() => import("components/Camera").then((pkg) => pkg.Camera) as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
	Notifications: dynamic(
		() =>
			import(
				"page-components/Home/NotificationWidget/NotificationWidget.jsx"
			) as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
	AiChatWidget: dynamic(
		() => import("page-components/Home/AiChatWidget") as any,
		{
			ssr: false,
			loading: () => <Loading />,
		}
	),
};

/**
 * Maximum modules that can be loaded at a time
 */
const MAX_MODULES = 10;

/**
 * Loads a component dynamically as a modal popup.
 * Used in the main Layout component to load & show RaiseIssue, ImageCapture, FileViewer, etc components in any page.
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {...*} rest - Rest of the props
 * @example	`<DynamicPopupModuleLoader></DynamicPopupModuleLoader>` TODO: Fix example
 */
const DynamicPopupModuleLoader = () => {
	/**
	 * State to store the properties for the modules to be loaded
	 */
	const [moduleData, setModuleData] = useState<ModuleDataType[] | []>([]);
	const { publish, subscribe, TOPICS } = usePubSub();
	const toast = useToast();

	// Listen to the topic to show the dialog with a feature
	useEffect(() => {
		const unsubscribe = subscribe(
			TOPICS.SHOW_DIALOG_FEATURE,
			(data: {
				feature: ModuleNameType;
				options: object;
				resultTopic: string;
			}) => {
				if (!(data && data.feature)) {
					return;
				}

				// Push the module data to be displayed as a modal popup
				addModule(data);
			}
		);

		return unsubscribe; // Unsubscribe on component unmount
	}, []);

	/**
	 * Function to add a module to the list of modules to be displayed. If it already exists, it will be replaced.
	 * @param module
	 */
	const addModule = (module: ModuleDataType) => {
		// If the module count exceeds the maximum limit, show an error toast
		if (moduleData.length >= MAX_MODULES) {
			toast({
				title: "Too many popups!",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			console.error(
				"DynamicPopupModuleLoader: Maximum modules limit reached: ",
				moduleData.length
			);
			return;
		}

		setModuleData((prevData: ModuleDataType[]) => {
			// If the last module is the same as the new module, replace the last module
			if (
				prevData.length > 0 &&
				prevData[prevData.length - 1].feature === module.feature
			) {
				const newData = [...prevData];
				newData[prevData.length - 1] = module;
				return newData;
			}

			// Otherwise, add the new module to the list
			return [...prevData, module];
		});
	};

	/**
	 * Function to remove a module from the list of modules to be displayed
	 * @param moduleName
	 */
	const removeModule = (moduleName: ModuleNameType) => {
		// See if the module is the last one in the list
		const lastModule = moduleData[moduleData.length - 1];
		if (lastModule?.feature === moduleName) {
			// If the module is the last one, remove it from the list
			setModuleData((prevData: ModuleDataType[]) =>
				prevData.filter((_module) => _module.feature !== moduleName)
			);
		} else {
			// If the module is not the last one, find the last matching module and remove it
			const lastIndex = moduleData
				.map((_module) => _module.feature)
				.lastIndexOf(moduleName);
			if (lastIndex >= 0) {
				setModuleData((prevData: ModuleDataType[]) =>
					prevData.filter((_module, _i) => _i !== lastIndex)
				);
			}
		}
	};

	/**
	 * Callback function to close the modal popup.
	 * @param index
	 * @param {string} moduleName - The module name
	 * @param result
	 */
	const onPopupClose = (index, moduleName, result) => {
		const closedModule = moduleData[index];

		console.log("DynamicPopupModuleLoader: onPopupClose", {
			index,
			moduleName,
			moduleData,
			result,
			closedModule,
		});

		if (
			closedModule &&
			closedModule.feature === moduleName &&
			closedModule.resultTopic
		) {
			console.log(
				"DynamicPopupModuleLoader: onPopupClose: publishing result: ",
				closedModule.resultTopic,
				result
			);

			publish(closedModule.resultTopic, result);
		}
		removeModule(moduleName);
	};

	// MARK: JSX
	return (
		<>
			{moduleData?.map((_module, _i) => {
				if (!_module?.feature) {
					return null;
				}

				const { feature, options } = _module;

				console.log("DynamicPopupModuleLoader: _module", _module);

				return (
					<Dialog
						key={feature}
						index={_i}
						module={feature}
						options={options}
						isBackgroundModule={_i !== moduleData.length - 1}
						onPopupClose={onPopupClose}
					/>
				);
			})}
		</>
	);
};

/**
 * Component to render the modal dialogue with a component.
 * @param {object} props - The properties of the component
 * @param {ModuleNameType} props.module - The module to show as a modal popup
 * @param {number} props.index - The index of the module in the list
 * @param {object} [props.options] - Options to pass to the module
 * @param {boolean} [props.isBackgroundModule] - Whether the module is in the background
 * @param {Function} props.onPopupClose - Callback function to close the modal
 */
const Dialog = ({
	module,
	index,
	options,
	isBackgroundModule,
	onPopupClose,
}) => {
	console.log("DynamicPopupModuleLoader: Dialog 1: " + module);

	// const { isOpen, onOpen, onClose } = useDisclosure();
	const [isHidden, setIsHidden] = useState(false);
	const [result, setResult] = useState<any>(null); // The result returned by the module

	// Open the modal popup when the component is mounted
	// useEffect(() => {
	// 	onOpen();
	// }, []);

	// Get the dynamic component to load
	const Component = moduleList[module];
	const {
		title,
		popupStyle,
		dialogStyles,
		props,
		style,
		closeBtnStyle,
		overlayStyle,
		hideCloseIcon,
	} = DefaultOptions[module] || {};

	if (!Component) {
		return null;
	}

	console.log("DynamicPopupModuleLoader: Dialog 2", module, Component);

	// Check if the popup style is a drawer...
	if (popupStyle === "drawer") {
		return (
			<Drawer
				isOpen={true}
				placement="right"
				onClose={() => onPopupClose(index, module, result || {})}
				{...dialogStyles}
			>
				<DrawerOverlay />
				<DrawerContent>
					{hideCloseIcon || isBackgroundModule ? null : (
						<DrawerCloseButton />
					)}

					{title ? <DrawerHeader>{title}</DrawerHeader> : null}

					<DrawerBody p={0}>
						<Component
							{...{ ...props, ...options }}
							onClose={(resp) =>
								onPopupClose(index, module, resp || result)
							}
							onResult={setResult}
							onHide={() => setIsHidden(true)}
							onShow={() => setIsHidden(false)}
						/>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		);
	}

	// Otherwise, show the modal popup...
	return (
		<Modal
			isOpen={true}
			onClose={() => onPopupClose(index, module, result || {})}
			{...dialogStyles}
		>
			<ModalOverlay
				bg="blackAlpha.700"
				backdropBlur="10px"
				{...overlayStyle}
				visibility={isHidden ? "hidden" : "visible"}
			/>
			<ModalContent
				{...{
					...{
						w: "auto",
						maxW: "100%",
						alignItems: "center",
						justifyContent: "center",
						bg: "transparent",
						boxShadow: "none",
					},
					...style,
				}}
				visibility={isHidden ? "hidden" : "visible"}
			>
				<Component
					{...{ ...props, ...options }}
					onClose={(resp) =>
						onPopupClose(index, module, resp || result)
					}
					onResult={setResult}
					onHide={() => setIsHidden(true)}
					onShow={() => setIsHidden(false)}
				/>
				{hideCloseIcon || isBackgroundModule ? null : (
					<ModalCloseButton
						bg="gray.100"
						size={{ base: "md", md: "lg" }}
						borderRadius="full"
						opacity="0.9"
						p={{ base: "6px", md: "13px" }}
						_hover={{ bg: "error", color: "white" }}
						pointerEvents="auto"
						boxShadow="dark-lg"
						{...closeBtnStyle}
					/>
				)}
			</ModalContent>
		</Modal>
	);
};

/**
 * Spinner (loading animation) component while loading the dynamic modules
 */
const Loading = () => {
	return (
		<Flex
			position="fixed"
			top="0"
			right="0"
			bottom="0"
			left="0"
			direction="row"
			align="center"
			justify="center"
			pointerEvents="none"
		>
			<Spinner thickness="4px" speed="0.65s" color="white" size="xl" />
		</Flex>
	);
};

export default DynamicPopupModuleLoader;
