import {
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import { usePubSub } from "contexts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Names of the modules that can be loaded
 */
export type ModuleNameType = "Feedback" | "FileViewer" | "ImageEditor";
// | "Support"
// | "Camera"
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
		 * Properties to pass to the module
		 */
		props?: { [key: string]: any };

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
		closeBtnStyle: {
			position: "fixed",
			top: "5px",
			right: "10px",
		},
		overlayStyle: {
			bg: "blackAlpha.800",
		},
	},
	// Camera: {},
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
			loading: () => <p>Loading...</p>,
		}
	),
	FileViewer: dynamic(
		() => import("components/FileView").then((pkg) => pkg.FileView) as any,
		{
			ssr: false,
			loading: () => <p>Loading...</p>,
		}
	),
	ImageEditor: dynamic(
		() =>
			import("page-components/ImageEditor").then(
				(pkg) => pkg.ImageEditor
			) as any,
		{
			ssr: false,
			loading: () => <p>Loading...</p>,
		}
	),
};

/**
 * Loads a component dynamically as a modal popup.
 * Used in the main Layout component to load & show RaiseIssue, ImageCapture, FileViewer, etc components in any page.
 *
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
	 */
	const addModule = (module: ModuleDataType) => {
		setModuleData((prevData) => {
			const index = prevData.findIndex(
				(_module) => _module.feature === module.feature
			);
			if (index >= 0) {
				const newData = [...prevData];
				newData[index] = module;
				return newData;
			}
			return [...prevData, module];
		});
	};

	/**
	 * Function to remove a module from the list of modules to be displayed
	 */
	const removeModule = (moduleName: ModuleNameType) => {
		setModuleData((prevData) =>
			prevData.filter((_module) => _module.feature !== moduleName)
		);
	};

	/**
	 * Callback function to close the modal popup.
	 * @param {string} moduleName - The module name
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
 * @param {function} props.onPopupClose - Callback function to close the modal
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
	const { props, style, closeBtnStyle, overlayStyle, hideCloseIcon } =
		DefaultOptions[module] || {};

	if (!Component) {
		return null;
	}

	console.log("DynamicPopupModuleLoader: Dialog 2", module, Component);

	return (
		<Modal
			isOpen={true}
			onClose={() => onPopupClose(index, module, result || {})}
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
						// position="fixed"
						// top="10px"
						// right="10px"
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

export default DynamicPopupModuleLoader;
