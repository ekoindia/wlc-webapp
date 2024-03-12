import { Flex, useToken } from "@chakra-ui/react";
import { BottomBarItem } from "components/Layout/useBottomBarItems";
import { motion } from "framer-motion";
import usePlatform from "hooks/usePlatform";
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
			minH={isMac ? "64px" : "56px"}
			align="center"
			justify="center"
			boxShadow="0px 6px 10px #00000033"
			pb={isMac ? "16px" : "0px"}
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
							visible,
						},
						index
					) => {
						if (!visible) return null;
						const isActive = router.pathname === path;
						return (
							<Flex
								as={motion.div}
								className={`bottom-app-bar-${name}`}
								key={`${index}-${label}`}
								align="center"
								justify="center"
								w="100%"
								h="100%"
								py="8px"
								color={isActive ? "primary.dark" : "gray.500"}
								onClick={() =>
									path
										? router.push(`${path}`)
										: action
										? action()
										: null
								}
								whileTap={{
									scale: 0.8,
								}}
								transition="0.5s linear"
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
