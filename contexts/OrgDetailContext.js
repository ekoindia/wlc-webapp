import { createContext, useContext, useEffect, useState } from "react";

const OrgDetailContext = createContext();

const OrgDetailProvider = ({ children }) => {
	const [orgDetail, setOrgDetail] = useState({});

	useEffect(() => {
		if (sessionStorage.getItem("org_detail")) {
			setOrgDetail(JSON.parse(sessionStorage.getItem("org_detail")));
		} else {
			if (orgDetail?.app_name) {
				sessionStorage.setItem("org_detail", JSON.stringify(orgDetail));
			}
		}
	}, [orgDetail?.app_name]);

	useEffect(() => {
		window.addEventListener("unload", () => {
			sessionStorage.removeItem("org_detail");
		});
	}, []);

	return (
		<OrgDetailContext.Provider value={{ orgDetail, setOrgDetail }}>
			{children}
		</OrgDetailContext.Provider>
	);
};

const useOrgDetailContext = () => {
	const context = useContext(OrgDetailContext);
	return context;
};
export { OrgDetailProvider, useOrgDetailContext };
