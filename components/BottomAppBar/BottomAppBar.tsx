import { Flex, Text, useToken } from "@chakra-ui/react";
import { usePlatform } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import { BottomAppBarItem } from ".";
import { Icon } from "..";

type BottomAppBarProps = {
	items: BottomAppBarItem[];
	isFixedBottomAppBar?: boolean;
	isSideBarMode?: boolean;
	[key: string]: any;
};

/**
 * BottomAppBar component.
 * @component
 * @param {BottomAppBarProps} props - The props of the component.
 * @param {BottomAppBarItem[]} props.items - Array of items for the bottom app bar.
 * @param {boolean} [props.isFixedBottomAppBar] - Flag to fix bottom app bar. Otherwise, it will hide on scroll down and show on scroll up.
 * @param {boolean} [props.isSideBarMode] - Flag to show bottom app bar in sidebar mode (compact side-bar on the left hand side of the screen for medium to large screens).
 * @param {...object} rest - Additional properties passed to the component.
 * @returns {React.Element} The rendered BottomAppBar component.
 */
const BottomAppBar = ({
	items,
	isFixedBottomAppBar = false,
	isSideBarMode = false,
	...rest
}: BottomAppBarProps) => {
	const router = useRouter();

	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const { isMac } = usePlatform();

	// Get theme color values
	const [contrast_color] = useToken("colors", ["navbar.dark"]);

	// Visible after a delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	// Hide on scroll down, show on scroll up
	useEffect(() => {
		if (isFixedBottomAppBar !== true && isSideBarMode !== true) {
			const handleScroll = () => {
				const st = document.documentElement.scrollTop;
				if (st > lastScrollTop) {
					setIsVisible(false);
				} else {
					setIsVisible(true);
				}
				setLastScrollTop(st <= 0 ? 0 : st);
			};

			window.addEventListener("scroll", handleScroll);
			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, [lastScrollTop, router.asPath]);

	// If there are no bottom bar items, return null
	if (items?.length <= 0) return null;

	return (
		<Flex
			className="bottom-app-bar"
			bg={isSideBarMode ? "sidebar.bg" : "white"}
			justify="center"
			w="100%"
			minH={isMac ? "64px" : "56px"}
			boxShadow="0px -3px 10px #0000001A"
			pb={isMac ? "16px" : "0px"}
			transition={
				isFixedBottomAppBar || isSideBarMode
					? "none"
					: "transform 0.3s ease-in-out"
			}
			transform={
				isFixedBottomAppBar || isSideBarMode
					? "none"
					: isVisible
						? "translateY(0)"
						: "translateY(100%)"
			}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
			{...rest}
		>
			<Flex
				w="100%"
				h="100%"
				maxW="400px"
				direction={isSideBarMode ? "column" : "row"}
				gap={isSideBarMode ? "25px" : 0}
			>
				{items.map(
					(
						{
							name,
							label,
							icon,
							path,
							action,
							component: BottomBarComponentProp,
							visible,
							disabled,
							hideInSideBar,
						},
						index
					) => {
						if (!visible) return null;
						if (isSideBarMode && hideInSideBar) return null;

						const isActive = router.pathname === path;
						return (
							<Flex
								className={`bottom-app-bar-${name}`}
								key={`${index}-${name}`}
								direction="column"
								align="center"
								w="100%"
								h="100%"
								py="8px"
								gap="1"
								bg={
									isSideBarMode && isActive
										? "#00000033"
										: "transparent"
								}
								color={
									isSideBarMode
										? "sidebar.text"
										: isActive
											? "primary.dark"
											: "light"
								}
								_active={{
									background: "transparent",
									transform: isActive ? null : "scale(0.8)",
									transition: isActive
										? null
										: "transform 0.5s ease-in",
								}}
								cursor={
									isActive || disabled ? "default" : "pointer"
								}
								opacity={disabled ? 0.5 : 1}
								onClick={() =>
									isActive || disabled
										? null
										: path
											? router.push(`${path}`)
											: action
												? action()
												: null
								}
							>
								{icon ? (
									<Icon key={name} name={icon} size="sm" />
								) : null}

								{BottomBarComponentProp ? (
									<BottomBarComponentProp />
								) : null}

								{label ? (
									<Text
										fontSize="10px"
										fontWeight="medium"
										noOfLines={2}
										userSelect="none"
									>
										{label}
									</Text>
								) : null}
							</Flex>
						);
					}
				)}
			</Flex>
		</Flex>
	);
};

export default BottomAppBar;
