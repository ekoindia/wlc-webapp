import React, { useEffect, useState } from "react";

/**
 * A <SellerDetails> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SellerDetails></SellerDetails>`
 */
const SellerDetails = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<div className={`${className}`} {...props}>
			SellerDetails
		</div>
	);
};

export default SellerDetails;
