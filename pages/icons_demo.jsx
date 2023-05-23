import {
	Box,
	Center,
	Circle,
	Flex,
	Radio,
	RadioGroup,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Icon } from "components";
import { IconCategories, IconLibrary } from "constants/IconLibrary";
import { Fragment, useEffect, useState } from "react";

const IconsDemo = () => {
	const [sortType, setSortType] = useState("");
	const [icons, setIcons] = useState([]);
	const [sortedIcons, setSortedIcons] = useState([]);
	const [iconCount, setIconCount] = useState(0);
	const [iconsSize, setIconsSize] = useState(0);

	// Convert IconLibrary object to an array.
	// Calculate individual & total sizes of all icons.
	// Define category for each icon.
	useEffect(() => {
		// Process IconCategories
		const _cat = {};
		Object.keys(IconCategories).forEach((cat) => {
			IconCategories[cat].forEach((ico) => {
				_cat[ico] = cat;
			});
		});

		let _size = 0;
		let _count = 0;
		const _icons = Object.keys(IconLibrary).map((ico) => {
			const i = IconLibrary[ico];
			const icoSize = JSON.stringify(i).length - 2 + ico.length;
			// (i.path ? i.path?.length || 0) +
			// (i.viewBox?.length || 0) +
			// (i.link?.length || 0);
			_size += icoSize;
			_count += i.link ? 0 : 1;
			return {
				name: ico,
				size: icoSize,
				category: ico in _cat ? _cat[ico] : "Uncategorized",
				...i,
			};
		});
		setIcons(_icons);
		setIconCount(_count);
		setIconsSize(_size);
	}, [IconLibrary]);

	// Get sorted icons array
	useEffect(() => {
		const _sortedIcons = sortType
			? [...icons].sort((a, b) => {
					if (sortType === "name") {
						return a.name.localeCompare(b.name);
					}
					if (sortType === "link") {
						const aLink = a.link ? a.link + a.name : a.name;
						const bLink = b.link ? b.link + b.name : b.name;
						return aLink.localeCompare(bLink);
					}
					if (sortType === "category") {
						const aLink = a.link ? a.link + a.name : a.name;
						const bLink = b.link ? b.link + b.name : b.name;
						return a.category === b.category
							? aLink.localeCompare(bLink)
							: a.category.localeCompare(b.category);
					}
					return (a.size || 0) - (b.size || 0);
			  })
			: icons;
		setSortedIcons(_sortedIcons);
	}, [icons, sortType]);

	return (
		<>
			<Box p="20px">
				<Text as="b" fontSize="2xl">
					Icon Library
				</Text>
				<Text>
					{iconCount} Icons{" "}
					<small>({Math.trunc(iconsSize / 1024)} KB bundle)</small>
				</Text>
				<br />

				<RadioGroup onChange={setSortType} value={sortType}>
					<Stack direction="row" gap={2}>
						<Text as="b">Sort by: </Text>
						<Radio value="">Default</Radio>
						<Radio value="name">Name</Radio>
						<Radio value="link">Linked Icons</Radio>
						<Radio value="size">Size</Radio>
						<Radio value="category">Category</Radio>
					</Stack>
				</RadioGroup>
			</Box>

			<Flex
				height={"auto"}
				wrap="wrap"
				gap="2px"
				// rowGap={"10px"}
				// columnGap="11px"
				padding={"20px"}
			>
				{sortedIcons.map((ele, index) => {
					return (
						<Fragment key={ele.name}>
							{/* Show Category */}
							{sortType === "category" &&
								(index === 0 ||
									ele.category !==
										sortedIcons[index - 1].category) && (
									<Box w="100%" pt={5}>
										<Text as="b" fontSize="lg">
											{ele.category}
										</Text>
									</Box>
								)}

							{/* Show Icon */}
							<Center
								width={"103px"}
								h="80px"
								p="2px 5px"
								bg={ele.link ? "#99000050" : "blackAlpha.300"}
								flexDir="column"
								position="relative"
							>
								<Circle
									p="2"
									m="1"
									bg="white"
									borderRadius="50%"
								>
									<Icon name={ele.name} size="20px" />
								</Circle>
								<Text fontSize=".5rem" textAlign="center">
									{ele.name +
										(ele.link
											? "  (→  " + ele.link + ")"
											: "")}
								</Text>
								{sortType === "size" && (
									<Text
										fontSize=".4rem"
										position="absolute"
										right="2px"
										top="2px"
									>
										{ele.size} B
									</Text>
								)}
							</Center>
						</Fragment>
					);
				})}
			</Flex>
		</>
	);
};

export default IconsDemo;
