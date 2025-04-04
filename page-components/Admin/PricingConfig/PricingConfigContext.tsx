import { createContext, useContext, useState } from "react";

const PricingConfigContext = createContext(null);

const PricingConfigProvider = ({ children }) => {
	const [pricingConfig, setPricingConfig] = useState(null);

	return (
		<PricingConfigContext.Provider
			value={{ pricingConfig, setPricingConfig }}
		>
			{children}
		</PricingConfigContext.Provider>
	);
};

const usePricingConfig = () => {
	const context = useContext(PricingConfigContext);
	if (!context) {
		throw new Error(
			"usePricingConfig must be used within a PricingConfigProvider"
		);
	}
	return context;
};

export { PricingConfigProvider, usePricingConfig };
