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
export type ModuleNameType = "Feedback";
// | "FileViewer";
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
const defaultOptions: {
	[_key in ModuleNameType]: {
		/**
		 * Properties to pass to the module
		 */
		props?: { [key: string]: any };

		/**
		 * Styles attributes to apply to the modal popup. Eg: width, height, etc.
		 */
		styles?: { [key: string]: any };
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
		styles: {
			w: { base: "100%", md: "650px", lg: "800px" },
			background: "transparent",
		},
		// minW: { base: "100%", md: "400px" },
	},
	// Camera: {},
	// FileViewer: {},
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
	// Register: dynamic(() => import("/components/module2")),
};

// Declare the props interface
interface PropsType {
	module: ModuleNameType;
	options?: { [key: string]: any };
	[key: string]: any;
}

/**
 * Loads a component dynamically as a modal popup.
 * Used in the main Layout component to load & show RaiseIssue, ImageCapture, FileViewer, etc components in any page.
 *
 * @component
 * @param {object} prop - Properties passed to the component
//  * @param {ModuleNameType} prop.module - The module to show as a modal popup
//  * @param {object} [prop.options] - Options to pass to the module
//  * @param {function} prop.onClose - Callback function to close the modal
 * @param {...*} rest - Rest of the props
 * @example	`<DynamicPopupModuleLoader></DynamicPopupModuleLoader>` TODO: Fix example
 */
const DynamicPopupModuleLoader = ({
	// module,
	// options,
	// onClose,
	// onResult,
	...rest
}: PropsType) => {
	/**
	 * State to store the properties for the module to be loaded
	 */
	const [moduleData, setModuleData] = useState<
		| {
				ModuleNameType: ModuleDataType;
		  }
		| {}
	>({});

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

				// Store the module data as a sub-object with key as the module name
				setModuleData((prevData) => ({
					...prevData,
					[data.feature]: data,
				}));
			}
		);

		return unsubscribe; // Unsubscribe on component unmount
	}, []);

	/**
	 * Callback function to close the modal popup.
	 * @param {string} module - The module name
	 */
	const onPopupClose = (module, result) => {
		console.log("DynamicPopupModuleLoader: onPopupClose", module, result);

		if (moduleData[module] && moduleData[module].resultTopic) {
			publish(moduleData[module].resultTopic, result);
		}
		setModuleData((prevData) => ({
			...prevData,
			[module]: null,
		}));
	};

	if (!module) {
		return null;
	}

	// MARK: JSX
	return (
		<>
			{Object.keys(moduleData).map((module) => {
				if (!(module && moduleData[module])) {
					return null;
				}

				const { options } = moduleData[module];

				return (
					<Dialog
						key={module}
						module={module}
						options={options}
						onPopupClose={onPopupClose}
						{...rest}
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
 * @param {object} [props.options] - Options to pass to the module
 * @param {function} props.onPopupClose - Callback function to close the modal
 * @param {...*} rest - Rest of the props
 */
const Dialog = ({ module, options, onPopupClose, ...rest }) => {
	// const { isOpen, onOpen, onClose } = useDisclosure();
	const [result, setResult] = useState<any>(null); // The result returned by the module

	// Open the modal popup when the component is mounted
	// useEffect(() => {
	// 	onOpen();
	// }, []);

	// Get the dynamic component to load
	const Component = moduleList[module];
	const { props, styles, hideCloseIcon } = defaultOptions[module] || {};

	if (!Component) {
		return null;
	}

	return (
		<Modal
			isOpen={true}
			onClose={() => onPopupClose(module, result)}
			{...rest}
		>
			<ModalOverlay bg="blackAlpha.600" backdropBlur="10px" />
			<ModalContent {...{ ...{ maxW: "100%" }, ...styles }}>
				{hideCloseIcon ? null : (
					<ModalCloseButton _hover={{ color: "error" }} />
				)}
				{/* <ModalBody> */}
				<Component
					{...{ ...props, ...options }}
					onClose={() => onPopupClose(module, result)}
					onResult={setResult}
				/>
				{/* </ModalBody> */}
			</ModalContent>
		</Modal>
	);
};

export default DynamicPopupModuleLoader;
