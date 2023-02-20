import React from "react";

/**
 * A <Selects> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Selects></Selects>`
 */
const Selects = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			selects
		</div>
	);
};

export default Selects;
