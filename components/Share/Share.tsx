import {
	Button,
	Grid,
	Icon,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Portal,
	Text,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { IconType } from "react-icons";
import { FaSms, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FiCopy, FiMail, FiMoreHorizontal, FiShare2 } from "react-icons/fi";

/**
 * Type definition for the Share component properties.
 */
interface ShareProps {
	title?: string;
	text?: string;
	url?: string;
	mobile?: string;
	email?: string;
	label?: string;
	hideLabel?: boolean;
	hideIcon?: boolean;
	labelProps?: any;
	iconProps?: any;
	size?: "xs" | "sm" | "md" | "lg";
	variant?: "solid" | "outline" | "ghost" | "link" | "unstyled";
	children?: ReactNode;
	rest?: any;
}
// Define the required props for the Share component.
type RequiredSharePropsTextOrUrl = Required<
	Pick<ShareProps, "title" | "text" | "url">
>;
type SharePropsWithRequiredProps = ShareProps &
	Partial<RequiredSharePropsTextOrUrl>;

/**
 * Type definition for the share options.
 */
interface ShareOption {
	label: string; // Label for the share option
	icon: IconType; // Icon for the share option
	color?: string; // Optional brand color for the icon
	secondary?: boolean; // Optional flag to show the share option as a secondary option
	onClick: () => void; // Click handler for the share option
	condition?: () => boolean; // Optional condition to show the share option
}

// Detect if the user is on a mobile or tablet device
const isMobileOrTablet = () =>
	/(android|iphone|ipad|mobile)/i.test(navigator.userAgent);

/**
 * This component shows a web-share button. It is used to share any text or URL to WhatsApp, Telegram, Email, etc.
 * It shows a grid of icons for different social media platforms.
 * On mobile browsers that support WebShare API, it also shows a "more" icon with native share feature.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.title Title of the shared message.
 * @param	{string}	prop.text	Text message to share.
 * @param	{string}	prop.url	URL to share.
 * @param	{string}	prop.mobile	Optional mobile number to share with. Used with Telegram, WhatsApp, etc share options.
 * @param	{string}	prop.email	Optional email to share with. Used with the Email share option.
 * @param	{string}	prop.label	Optional label to show with the share button.
 * @param	{boolean}	prop.hideLabel	Optional flag to hide the label.
 * @param	{boolean}	prop.hideIcon	Optional flag to hide the share icon.
 * @param	{object}	prop.labelProps	Optional props to pass to the label.
 * @param	{object}	prop.iconProps	Optional props to pass to the icon.
 * @param	{string}	prop.size	Optional size of the share button. Default is "md". Accepts "xs", "sm", "md", & "lg".
 * @param	{string}	prop.variant	Optional variant of the share button. Default is "outline". Accepts "solid", "outline", "ghost", "link" & "unstyled".
 * @param	{object}	prop.children	Optional children to show with the share button.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Share text="Click this link to signup" url="https://abc.com/signup" size="sm"></Share>`
 */
const Share = ({
	title,
	text,
	url = "",
	mobile,
	email,
	label,
	hideLabel,
	hideIcon,
	labelProps,
	iconProps,
	size = "md",
	variant = "outline",
	children,
	...rest
}: SharePropsWithRequiredProps) => {
	// State to store the selected mobile number. User can opt to not use the mobile number for sharing with WhatsApp, SMS, etc.
	const [selectedMobile, setSelectedMobile] = useState(mobile);

	// List of social media platforms to share, mapped with label, icon, click handler, and the condition to show it.
	// This can be extended to include more social media platforms
	const shareOptions: ShareOption[] = [
		{
			label: "WhatsApp",
			icon: FaWhatsapp,
			color: "#075E54",
			onClick: () => {
				console.log("Share to WhatsApp: ", text, url, selectedMobile);

				const whatsAppUrl = `https://${
					isMobileOrTablet() ? "api" : "web"
				}.whatsapp.com/send?`;

				openUrlTab(
					whatsAppUrl +
						"text=" +
						window.encodeURIComponent(shareMessage) +
						(selectedMobile
							? "&phone=" +
							  window.encodeURIComponent(selectedMobile)
							: "")
				);
			},
		},
		{
			// Share to SMS
			label: "Message",
			icon: FaSms,
			color: "#2253bf",
			condition: isMobileOrTablet,
			onClick: () => {
				console.log("Share to SMS: ", text, selectedMobile);

				// Limit text such that text+url is within 160 characters limit
				const smsLimit = 160;
				const _url = url || "";
				let _text = text || "";
				const textLimit = smsLimit - _url.length - 3;
				_text =
					_text.length > textLimit
						? _text.slice(0, textLimit) + "…"
						: _text;

				const smsText = `${text}\n\n${url}`;
				openUrlTab(
					`sms:${selectedMobile || ""}` +
						"?body=" +
						window.encodeURIComponent(smsText)
				);
			},
		},
		{
			// Share to Telegram with the message and URL (works only when sharing a URL)
			label: "Telegram",
			icon: FaTelegramPlane,
			color: "#24A1DE",
			condition: () => !!url,
			onClick: () => {
				console.log("Share to Telegram: ", text, url);

				const telegramUrl = `https://telegram.me/share/url?`;
				openUrlTab(
					telegramUrl +
						"text=" +
						window.encodeURIComponent(shareMessage) +
						(url ? "&url=" + window.encodeURIComponent(url) : "")
				);
			},
		},
		{
			label: "Email",
			icon: FiMail,
			color: "#BB001B",
			onClick: () => {
				console.log("Share to Email: ", text, url, email);
				// URLEncode the body text
				let body = encodeURIComponent(`${text}\n\n${url}`);
				window.location.href = `mailto:${
					email || ""
				}?subject=${encodeURIComponent(title || "")}&body=${body}`;
			},
		},
		{
			// Copy full message to the clipboard
			label: "Copy",
			icon: FiCopy,
			secondary: true,
			onClick: () => {
				console.log("Copy to Clipboard: ", shareMessage);
				navigator.clipboard.writeText(shareMessage);
			},
		},
		{
			// Native share feature for mobile browsers using WebShare API
			label: "More",
			icon: FiMoreHorizontal,
			secondary: true,
			condition: () => !!navigator.share,
			onClick: () => {
				console.log("Native Share: ", title, text, url);
				navigator.share &&
					navigator.share({
						title: title || "",
						text: text,
						url: url,
					});
			},
		},
	];

	// Return the full message to share
	const shareMessage: string = [title || "", text || "", url || ""]
		.filter(
			(text) =>
				typeof text !== "undefined" && text !== null && text !== ""
		)
		.join("\n\n");

	// Function to open a URL in new tab
	const openUrlTab = (url: string) => {
		const a = document.createElement("a");
		a.setAttribute("target", "_blank");
		a.href = url;
		a.click();
	};

	// If nothing to share, return null
	if (!shareMessage) {
		return null;
	}

	// Return the share button with the list of share options
	return (
		<Menu closeOnSelect={true} isLazy={true} autoSelect={true}>
			{/* Share menu button... */}
			<MenuButton
				as={Button}
				leftIcon={!hideIcon && <FiShare2 {...iconProps} />}
				variant={variant}
				borderRadius="full"
				size={size}
				{...rest}
			>
				{/* Show the label if it is not hidden */}
				{!hideLabel && <Text {...labelProps}>{label || "Share"}</Text>}

				{children}
			</MenuButton>

			{/* Share dropdown... */}
			<Portal>
				<MenuList p="0.5em" boxShadow="dark-lg">
					<Text
						marginBottom={{ base: "0.1em", md: "0.3em" }}
						fontSize={{ base: "0.85em", md: "0.95em" }}
						fontWeight="bold"
						w="100%"
						textAlign="center"
					>
						Share
					</Text>
					{url || title ? (
						<Text
							fontSize="9px"
							w="100%"
							textAlign="center"
							noOfLines={1}
							// paddingBottom={2}
						>
							{url || title}
						</Text>
					) : null}

					<MenuDivider marginBottom={3} />

					{/* Mobile number selector... */}
					{mobile && (
						<>
							<MenuOptionGroup
								defaultValue={mobile}
								title="Share with…"
								type="radio"
								onChange={(value) =>
									setSelectedMobile(value as string)
								}
							>
								<MenuItemOption
									value={mobile}
									closeOnSelect={false}
									fontSize={{ base: "0.8em", md: "0.85em" }}
								>
									{mobile}
								</MenuItemOption>
								<MenuItemOption
									value=""
									closeOnSelect={false}
									fontSize={{ base: "0.8em", md: "0.85em" }}
								>
									Others…
								</MenuItemOption>
							</MenuOptionGroup>
							<MenuDivider marginBottom={3} />
						</>
					)}

					<Grid
						templateColumns="repeat(3, 1fr)"
						gap={{ base: 1, md: 2 }}
					>
						{/* Show the list of share options */}
						{shareOptions.map(
							({
								label,
								icon,
								color,
								secondary,
								onClick,
								condition,
							}) =>
								(!condition || condition()) && (
									<MenuItem
										display="flex"
										flexDirection="column"
										alignItems="center"
										borderRadius={6}
										key={label}
										onClick={onClick}
									>
										<Icon
											boxSize={{ base: 6, md: 8 }}
											as={icon}
											marginBottom={1}
											p={secondary ? 1 : 0}
											color={
												color
													? color
													: secondary
													? "#666"
													: "inherit"
											}
										/>
										<Text
											fontSize={{
												base: "0.7em",
												md: "0.8em",
											}}
										>
											{label}
										</Text>
									</MenuItem>
								)
						)}
					</Grid>
				</MenuList>
			</Portal>
		</Menu>
	);
};

export default Share;
