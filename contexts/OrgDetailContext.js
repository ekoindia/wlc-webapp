import { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrgDetailSessionStorageKey = "org_detail";

// Creating context
const OrgDetailContext = createContext();

/**
 * Context provider for Organization details (orgDetails & setOrgDetails)
 * @param {object} props
 * @param {object} props.initialData - Initial organization data
 * @param {ReactNode} props.children - Children components
 */
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
			console.log("[OrgDetailContext] got from session:", orgDetail);
			setOrgDetail(
				JSON.parse(sessionStorage.getItem(OrgDetailSessionStorageKey))
			);
		} else {
			if (orgDetail?.app_name) {
				console.log("[OrgDetailContext] set into session:", orgDetail);
				sessionStorage.setItem(
					OrgDetailSessionStorageKey,
					JSON.stringify(orgDetail)
				);
			}
		}
	}, [orgDetail?.app_name]);

	const value = useMemo(() => {
		return {
			orgDetail,
			setOrgDetail,
		};
	}, [orgDetail]);

	return (
		<OrgDetailContext.Provider value={value}>
			{children}
		</OrgDetailContext.Provider>
	);
};

const useOrgDetailContext = () => {
	const context = useContext(OrgDetailContext);
	return context;
};

export { OrgDetailProvider, OrgDetailSessionStorageKey, useOrgDetailContext };
