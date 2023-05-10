import { createContext, useContext, useEffect, useState } from "react";

const OrgDetailSessionStorageKey = "org_detail";

// Creating context
const OrgDetailContext = createContext();

// Creating context provider for providing Organization details
const OrgDetailProvider = ({ initialData, children }) => {
	const [orgDetail, setOrgDetail] = useState({});

	// Set mock data for testing
	useEffect(() => {
		if (initialData && initialData.org_id) {
			setOrgDetail(initialData);
		}
	}, [initialData]);

	useEffect(() => {
		if (sessionStorage.getItem(OrgDetailSessionStorageKey)) {
			setOrgDetail(
				JSON.parse(sessionStorage.getItem(OrgDetailSessionStorageKey))
			);
		} else {
			if (orgDetail?.app_name) {
				sessionStorage.setItem(
					OrgDetailSessionStorageKey,
					JSON.stringify(orgDetail)
				);
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

export { OrgDetailProvider, useOrgDetailContext, OrgDetailSessionStorageKey };
