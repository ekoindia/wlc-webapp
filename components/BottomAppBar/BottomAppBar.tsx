import { Avatar, Flex } from "@chakra-ui/react";
import { BottomBarItem } from "components/Layout/useBottomBarItems";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

	useEffect(() => {
		// Slide up after a delay
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

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
						{ icon, name, avatar, label, action, path, src },
						index
					) => {
						//if path is undefined, and action is undefined, and avatar is undefined return
						if (!path && !action && !avatar) return;

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
									path ? router.push(`${path}`) : action()
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
								{avatar ? (
									<Avatar
										src={src}
										name={avatar}
										size="sm"
										onClick={action}
									/>
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
