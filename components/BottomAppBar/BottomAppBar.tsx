import { Flex, useToken } from "@chakra-ui/react";
import { BottomBarItem } from "components/Layout/useBottomBarItems";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import { Icon } from "..";

/**
 * BottomAppBar component.
 *
 * @component
 *
 * @param {object} props - Component props.
 * @param {BottomBarItem[]} props.bottomBarItems - Array of items for the bottom app bar.
 *
 * @returns {React.Element} The rendered BottomAppBar component.
 */
const BottomAppBar = ({
	bottomBarItems,
}: {
	bottomBarItems: BottomBarItem[];
}) => {
	const router = useRouter();

	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

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
		const handleScroll = () => {
			const st = window.pageYOffset || document.documentElement.scrollTop;
			if (st > lastScrollTop) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}
			setLastScrollTop(st <= 0 ? 0 : st);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollTop]);

	// If there are no bottom bar items, return null
	if (bottomBarItems?.length <= 0) return null;

	return (
		<Flex
			className="bottom-app-bar"
			bg="white"
			w="100%"
			minH="56px"
			align="center"
			justify="center"
			boxShadow="0px 6px 10px #00000033"
			px="16px"
			transition="transform 0.3s ease-in-out"
			transform={isVisible ? "translateY(0)" : "translateY(100%)"}
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Flex
				w="100%"
				h="100%"
				maxW="400px"
				align="center"
				justify="space-between"
			>
				{bottomBarItems.map(
					(
						{
							name,
							label,
							icon,
							path,
							action,
							component: BottomBarComponentProp,
						},
						index
					) => {
						//if path is undefined, and action is undefined, and BottomBarComponentProp is undefined return
						if (!path && !action && !BottomBarComponentProp) return;

						const isActive = router.pathname === path;
						return (
							<Flex
								className={`bottom-app-bar-${name}`}
								key={`${index}-${label}`}
								align="center"
								justify="center"
								w="100%"
								h="100%"
								py="8px"
								gap="2"
								color={isActive ? "primary.dark" : "gray.500"}
								borderRadius="50px"
								onClick={() =>
									path
										? router.push(`${path}`)
										: action
										? action()
										: null
								}
								// on click transition
							>
								{icon ? (
									<Icon
										key={name}
										name={icon}
										color={
											isActive ? "primary.dark" : "light"
										}
										size="md"
									/>
								) : null}

								{BottomBarComponentProp ? (
									<BottomBarComponentProp />
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
