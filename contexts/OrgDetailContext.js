import { createContext, useContext, useEffect, useState } from "react";

// Creating context
const OrgDetailContext = createContext();

// Creating context provider for providing Organization details
const OrgDetailProvider = ({ orgMockData, children }) => {
	const [orgDetail, setOrgDetail] = useState({});

	// Set mock data for testing
	useEffect(() => {
		if (orgMockData && orgMockData.org_id) {
			setOrgDetail(orgMockData);
		}
	}, [orgMockData]);

	useEffect(() => {
		if (sessionStorage.getItem("org_detail")) {
			setOrgDetail(JSON.parse(sessionStorage.getItem("org_detail")));
		} else {
			if (orgDetail?.app_name) {
				sessionStorage.setItem("org_detail", JSON.stringify(orgDetail));
			}
		}
	}, [orgDetail?.app_name]);

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
