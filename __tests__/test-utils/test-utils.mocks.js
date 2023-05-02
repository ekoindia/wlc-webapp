/**
 * This file contains the common session (user and organization) mock data for the test cases
 */

// Mock data for the organization
export const MockOrg = {
	org_id: 2,
	app_name: "WLC Test",
	app_logo: "",
	org_name: "WLC Test",
};

// Mock data for the standard user (agent, distributor, retailer)
export const MockUser = {
	loggedIn: true,
	is_org_admin: 0,
	userId: "6333331126",
	sessionKey: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ...",
	userDetails: {
		name: "Kumar Abhishek",
		login_id: "12345678912",
		org_id: "1",
		date_of_joining: "2020-03-16 15:26:06",
		shop_name: "",
		shopaddress: "212, Main Road, Gali 6, Chandni Chowk, New Delhi-110006",
		user_type: "3",
		email: "testuser@eko.co.in",
		code: "20810282",
		mobile: "6333331126",
	},
	profileDetails: {
		personal_details: {
			qualification: "",
			marital_status: "",
			gender: "",
			dob: "1986-01-01",
			name: "Kumar Abhishek",
		},
		shop_details: {
			shop_name: "",
			shop_type: "",
			shop_address:
				"212, Main Bazaar Road, Gali No. 6, Chandni Chowk, New Delhi-110006",
			state: "",
			city: "",
			pincode: "",
			shop_location: "",
		},
	},
};

// Mock data for the admin user
export const MockAdminUser = {
	...MockUser,
	is_org_admin: 1,
};
