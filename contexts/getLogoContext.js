import { createContext, useContext, useEffect, useState } from "react";

const GetLogoContext = createContext();

const GetLogoProvider = ({ children }) => {
	const [logo, setLogo] = useState("");

	useEffect(() => {
		if (sessionStorage.getItem("logo")) {
			setLogo(sessionStorage.getItem("logo"));
		} else {
			if (logo !== "") {
				sessionStorage.setItem("logo", logo);
			}
		}
	}, []);
	return (
		<GetLogoContext.Provider value={{ logo, setLogo }}>
			{children}
		</GetLogoContext.Provider>
	);
};

const useGetLogoContext = () => {
	const context = useContext(GetLogoContext);
	return context;
};
export { GetLogoProvider, useGetLogoContext };
