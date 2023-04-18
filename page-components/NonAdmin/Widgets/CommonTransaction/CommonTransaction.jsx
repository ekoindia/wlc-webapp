/**
 * A <CommonTransaction> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<CommonTransaction></CommonTransaction>`
 */
const CommonTransaction = ({ className = "", ...props }) => {
	return (
		<div className={`${className}`} {...props}>
			CommonTransaction
		</div>
	);
};

export default CommonTransaction;
