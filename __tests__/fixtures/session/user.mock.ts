/**
 * Standard user mock data for test cases (agent, distributor, retailer)
 */

interface UserDetails {
	name: string;
	login_id: string;
	org_id: string;
	date_of_joining: string;
	shop_name: string;
	shopaddress: string;
	user_type: string;
	email: string;
	code: string;
	mobile: string;
}

interface PersonalDetails {
	qualification: string;
	marital_status: string;
	gender: string;
	dob: string;
	name: string;
}

interface ShopDetails {
	shop_name: string;
	shop_type: string;
	shop_address: string;
	state: string;
	city: string;
	pincode: string;
	shop_location: string;
}

interface ProfileDetails {
	personal_details: PersonalDetails;
	shop_details: ShopDetails;
}

export interface User {
	loggedIn: boolean;
	is_org_admin: number;
	userId: string;
	user_type: string;
	access_token: string;
	userDetails: UserDetails;
	profileDetails: ProfileDetails;
}

export const MockUser: User = {
	loggedIn: true,
	is_org_admin: 0,
	userId: "6333331126",
	user_type: "2",
	access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ...",
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
