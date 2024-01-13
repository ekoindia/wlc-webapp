import { Flex, Text } from "@chakra-ui/react";
import { Headings } from "components";
import dynamic from "next/dynamic";

/**
 * A <PricingForm> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PricingForm></PricingForm>` TODO: Fix example
 */
const PricingForm = ({ label, comp }) => {
	const _pageComponent = comp;

	const DynamicPageComponent = dynamic(
		() =>
			import(`../${_pageComponent}`).then((mod) => {
				return mod[_pageComponent];
			}),
		{
			ssr: false,
		}
	);

	return (
		<div>
			<Headings title={label} />
			<Flex direction="column" mx={{ base: "4", md: "0" }}>
				<Text mb="20px" fontSize={{ base: "xs", sm: "sm" }}>
					<span
						style={{
							backgroundColor: "#FFD93B",
							fontWeight: "700",
						}}
					>
						Note:
					</span>
					&nbsp; The revised cost structure will come into effect from
					tomorrow (12:00 AM midnight).
				</Text>
				<Flex
					direction="column"
					px={{ base: "6", md: "8" }}
					pt="6"
					pb="8"
					bg="white"
					border="card"
					boxShadow="basic"
					borderRadius="10px"
				>
					<DynamicPageComponent />
				</Flex>
			</Flex>
		</div>
	);
};

export default PricingForm;
