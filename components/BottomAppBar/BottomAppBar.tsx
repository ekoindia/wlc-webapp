import { Flex, Text, useToken } from "@chakra-ui/react";
import { BottomBarItem } from "components/BottomAppBar/useBottomBarItems";
import { usePlatform } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import { Icon } from "..";

type BottomAppBarProps = {
	bottomBarItems: BottomBarItem[];
	isFixedBottomAppBar?: boolean;
};

/**
 * BottomAppBar component.
 * @component
 * @param {BottomAppBarProps} props - The props of the component.
 * @param {BottomBarItem[]} props.bottomBarItems - Array of items for the bottom app bar.
 * @param {boolean} [props.isFixedBottomAppBar] - Flag to fix bottom app bar.
 * @returns {React.Element} The rendered BottomAppBar component.
 */
const BottomAppBar = ({
	bottomBarItems,
	isFixedBottomAppBar = false,
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
		if (!isFixedBottomAppBar) {
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
	if (bottomBarItems?.length <= 0) return null;

	return (
		<Flex
			className="bottom-app-bar"
			bg="white"
			justify="center"
			w="100%"
			minH={isMac ? "64px" : "56px"}
			boxShadow="0px -3px 10px #0000001A"
			pb={isMac ? "16px" : "0px"}
			transition={
				isFixedBottomAppBar ? "none" : "transform 0.3s ease-in-out"
			}
			transform={
				isFixedBottomAppBar
					? "none"
					: isVisible
						? "translateY(0)"
						: "translateY(100%)"
			}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Flex w="100%" h="100%" maxW="400px">
				{bottomBarItems.map(
					(
						{
							name,
							label,
							icon,
							path,
							action,
							component: BottomBarComponentProp,
							visible,
						},
						index
					) => {
						if (!visible) return null;
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
								color={isActive ? "primary.dark" : "light"}
								_active={{
									background: "transparent",
									transform: isActive ? null : "scale(0.8)",
									transition: isActive
										? null
										: "transform 0.5s ease-in",
								}}
								onClick={() =>
									isActive
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
