import {
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { usePubSub } from "contexts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Type of modules that can be loaded
export type ModuleTypes = "Feedback";
// | "Support"
// | "Camera"
// | "FileViewer"
// | "About";

/**
 * Default options for each module
 */
const defaultOptions: {
	[_key in ModuleTypes]: {
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
const moduleList: { [_key in ModuleTypes]: any } = {
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
	module: ModuleTypes;
	options?: { [key: string]: any };
	[key: string]: any;
}

/**
 * Loads a component dynamically as a modal popup.
 * Used in the main Layout component to load & show RaiseIssue, ImageCapture, FileViewer, etc components in any page.
 *
 * @component
 * @param {object} prop - Properties passed to the component
//  * @param {ModuleTypes} prop.module - The module to show as a modal popup
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
	const [module, setModule] = useState<ModuleTypes>(null); // The module type to load
	const [options, setOptions] = useState<any>(null); // Options to pass to the module
	const [result, setResult] = useState<any>(null); // The result returned by the module
	const [resultTopic, setResultTopic] = useState<string>(null); // The topic to publish the result to
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { publish, subscribe, TOPICS } = usePubSub();

	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.SHOW_DIALOG_FEATURE, (data) => {
			if (!(data && data.feature)) {
				return;
			}

			setOptions(data.options);
			setModule(data.feature);
			setResultTopic(data.resultTopic);
			onOpen();
		});

		return unsubscribe; // Unsubscribe on component unmount
	}, []);

	/**
	 * Callback function to handle the result from the module.
	 */
	const onResult = (data) => {
		setResult(data);
	};

	/**
	 * Callback function to close the modal popup.
	 */
	const onPopupClose = () => {
		onClose(); // Close the Chakra modal
		if (resultTopic) {
			publish(resultTopic, result);
		}
	};

	if (!module) {
		return null;
	}

	// Get the dynamic component to load
	const Component = moduleList[module];
	const { props, styles, hideCloseIcon } = defaultOptions[module] || {};

	if (!Component) {
		return null;
	}

	console.log("DynamicPopupModuleLoader: ", {
		module,
		options,
		props,
		styles,
	});

	// MARK: JSX
	return (
		<Modal isOpen={isOpen} onClose={onPopupClose} {...rest}>
			<ModalOverlay bg="blackAlpha.600" backdropBlur="10px" />
			<ModalContent {...{ ...{ maxW: "100%" }, ...styles }}>
				{hideCloseIcon ? null : (
					<ModalCloseButton _hover={{ color: "error" }} />
				)}
				{/* <ModalBody> */}
				<Component
					{...{ ...props, ...options }}
					onClose={onClose}
					onResult={onResult}
				/>
				{/* </ModalBody> */}
			</ModalContent>
		</Modal>
	);
};

export default DynamicPopupModuleLoader;
