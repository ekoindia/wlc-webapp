import { Table } from "components";
const data = {
    "response_status_id": 1,
    "data": {
        "client_ref_id": "202301031354123456",
        "OrgId": 1,
        "user_code": "99029899",
        "TotalRecords": 214,
        "source": "WLC",
        "agent_details": [
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "AKHILESH KUMAR",
                "eko_code": "99010001",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99010001",
                    "wallet_balance": "1000000",
                    "shop_name": "Abhilash Enterprise limted",
                    "plan_name": "Money Transfer @ 0.50%"
                },
                "onboarded_on": "2018-04-10",
                "address_details": {
                    "address": "S/O- RAMESH CHAND H NO- 192 WARD NO- 4  NEAR CANARA BANK HAILY MANDI PATAUDI GURGAON, HAILY MANDI PATAUDI, , South West Delhi, Delhi, 110070",
                    "lattitude": "28.45471470",
                    "ownership_type": "NA",
                    "longitude": "77.07370370"
                },
                "personal_information": {
                    "marital_status": "Single",
                    "gender": "Male",
                    "date_of_birth": "2018-06-26",
                    "shop_type": "shop",
                    "monthly_income": "NA",
                    "shop_name": "testing testing"
                },
                "contact_information": {
                    "mobile_number": "9999912525",
                    "email": null
                },
                "location": "South West Delhi, Delhi",
                "agent_mobile": "9999912525",
                "account_status": "Inactive"
            },
            {
                "agent_type": "CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Abhinav Sinha",
                "eko_code": "99065022",
                "profile": {
                    "account_type": "Seller",
                    "eko_code": "99065022",
                    "wallet_balance": "1000000",
                    "shop_name": "New Tea",
                    "plan_name": "IMPS Super Saver"
                },
                "onboarded_on": "2018-07-16",
                "address_details": {
                    "address": "502 TOWER 2 THE PALMS, SOUTH CITY PHASE - I,  Delhi Subdistrict Delhi, Gurgaon, Harayana, 122002",
                    "lattitude": "28.64134400",
                    "ownership_type": "NA",
                    "longitude": "77.37479300"
                },
                "personal_information": {
                    "marital_status": "Married",
                    "gender": "Male",
                    "date_of_birth": "",
                    "monthly_income": "NA"
                },
                "contact_information": {
                    "mobile_number": "9300489856",
                    "email": "abhinav@xyz.com"
                },
                "location": "Gurgaon, Harayana",
                "agent_mobile": "9300489856",
                "account_status": "Pending"
            },
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Amayra",
                "eko_code": "99065056",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99065056",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": ""
                },
                "onboarded_on": "2018-09-05",
                "address_details": {
                    "address": "Mr. Rohit,  Institutional Area,  Shgb Subdistrict Gurgaon, Sector -45, Haryana, 122003",
                    "lattitude": "28.58352640",
                    "ownership_type": "NA",
                    "longitude": "77.27022070"
                },
                "personal_information": {
                    "marital_status": "Married",
                    "gender": "Female",
                    "date_of_birth": "2000-12-31",
                    "shop_type": "Money Transfer Agent",
                    "monthly_income": "NA",
                    "shop_name": "Vikas electronics"
                },
                "contact_information": {
                    "mobile_number": "8783294732",
                    "email": "abc@gmail.com"
                },
                "location": "Sector -45, Haryana",
                "agent_mobile": "8783294732",
                "account_status": "Active"
            },
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Uidai Testing",
                "eko_code": "99064939",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99064939",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Premium"
                },
                "onboarded_on": "2020-06-08",
                "address_details": {
                    "address": "UIDAI Testing,  Village-Belauna Purab,  Delhi Subdistrict Delhi, North Delhi, Delhi, 110006",
                    "lattitude": "28.45818730",
                    "ownership_type": "NA",
                    "longitude": "77.07601930"
                },
                "personal_information": {
                    "marital_status": "Single",
                    "gender": "Male",
                    "date_of_birth": "2018-06-26",
                    "shop_type": "Money Transfer Agent",
                    "monthly_income": "NA",
                    "shop_name": "UIDAI Testing"
                },
                "contact_information": {
                    "mobile_number": "9557115060",
                    "email": null
                },
                "location": "North Delhi, Delhi",
                "agent_mobile": "9557115060",
                "account_status": "Active"
            },
            {
                "agent_type": "Sub-Merchant",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Gautam",
                "eko_code": "99070034",
                "profile": {
                    "account_type": "Sub-Merchant",
                    "eko_code": "99070034",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Money Transfer @ 0.55%"
                },
                "onboarded_on": "2018-09-05",
                "address_details": {
                    "address": "UIDAI Testing,  Village-Belauna Purab, null, North Delhi, Delhi, 110006",
                    "lattitude": "28.45471470",
                    "ownership_type": "NA",
                    "longitude": "77.07370370"
                },
                "personal_information": {
                    "marital_status": "",
                    "gender": "",
                    "date_of_birth": "",
                    "shop_type": "",
                    "monthly_income": "NA",
                    "shop_name": "UIDAI Testing"
                },
                "contact_information": {
                    "mobile_number": "9874613132",
                    "email": null
                },
                "location": "North Delhi, Delhi",
                "agent_mobile": "9874613132",
                "account_status": "Active"
            },
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Naushad Saifi",
                "eko_code": "99060200",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99060200",
                    "wallet_balance": "1000000",
                    "shop_name": "Gupta Store",
                    "plan_name": "Premium"
                },
                "onboarded_on": "2017-08-03",
                "address_details": {
                    "address": "Sector 43, Huda, , Central Delhi, Delhi, 110001",
                    "lattitude": "28.74616910",
                    "ownership_type": "NA",
                    "longitude": "77.29348990"
                },
                "personal_information": {
                    "marital_status": "Married",
                    "gender": "Male",
                    "date_of_birth": "2018-06-26",
                    "shop_type": "",
                    "monthly_income": "NA",
                    "shop_name": "Gupta Store"
                },
                "contact_information": {
                    "mobile_number": "9898494714",
                    "email": "naushad.saifi@eko.co.in"
                },
                "location": "Central Delhi, Delhi",
                "agent_mobile": "9898494714",
                "account_status": "Active"
            },
            {
                "agent_type": "CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "RAHUL KUMAR",
                "eko_code": "99010036",
                "profile": {
                    "account_type": "Seller",
                    "eko_code": "99010036",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Premium"
                },
                "onboarded_on": "2018-05-03",
                "address_details": {
                    "address": "S/O- RAMESH CHAND H NO- 192 WARD NO- 4  NEAR CANARA BANK HAILY MANDI PATAUDI GURGAON, HAILY MANDI PATAUDI, null, South West Delhi, Delhi, 110070",
                    "lattitude": "28.45571610",
                    "ownership_type": "NA",
                    "longitude": "77.07239840"
                },
                "personal_information": {
                    "marital_status": "Single",
                    "gender": "Female",
                    "date_of_birth": "2018-06-26",
                    "shop_type": "Chemist & Pharmacy",
                    "monthly_income": "NA",
                    "shop_name": "abc private ltdyrrrrgsdgsdfg"
                },
                "contact_information": {
                    "mobile_number": "9999912725",
                    "email": "testekomerchant@gmail.com"
                },
                "location": "South West Delhi, Delhi",
                "agent_mobile": "9999912725",
                "account_status": "Active"
            },
            {
                "agent_type": "CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "RAHUL KUMAR",
                "eko_code": "99010036",
                "profile": {
                    "account_type": "Seller",
                    "eko_code": "99010036",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Premium"
                },
                "onboarded_on": "2018-05-03",
                "address_details": {
                    "address": "S/O- RAMESH CHAND H NO- 192 WARD NO- 4  NEAR CANARA BANK HAILY MANDI PATAUDI GURGAON, HAILY MANDI PATAUDI, null, South West Delhi, Delhi, 110070",
                    "lattitude": "28.45571610",
                    "ownership_type": "NA",
                    "longitude": "77.07239840"
                },
                "personal_information": {
                    "marital_status": "Single",
                    "gender": "Female",
                    "date_of_birth": "2018-06-26",
                    "shop_type": "Chemist & Pharmacy",
                    "monthly_income": "NA",
                    "shop_name": "abc private ltdyrrrrgsdgsdfg"
                },
                "contact_information": {
                    "mobile_number": "9999912725",
                    "email": "testekomerchant@gmail.com"
                },
                "location": "South West Delhi, Delhi",
                "agent_mobile": "9999912725",
                "account_status": "Active"
            },
            
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Deepak",
                "eko_code": "99070066",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99070066",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Money Transfer @ 0.50%"
                },
                "onboarded_on": "2018-10-10",
                "address_details": {
                    "address": "Deepak,  Institutional Area,  Shgb Subdistrict Gurgaon, Gurgaon, Haryana, 122003",
                    "lattitude": "28.45471470",
                    "ownership_type": "NA",
                    "longitude": "77.07370370"
                },
                "personal_information": {
                    "marital_status": "Single",
                    "gender": "Male",
                    "date_of_birth": "",
                    "shop_type": "Grocery & Kirana Store",
                    "monthly_income": "NA",
                    "shop_name": "Deepak"
                },
                "contact_information": {
                    "mobile_number": "9874655456",
                    "email": null
                },
                "location": "Gurgaon, Haryana",
                "agent_mobile": "9874655456",
                "account_status": "Active"
            },
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Mr. Rohit",
                "eko_code": "99070068",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99070068",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Premium"
                },
                "onboarded_on": "2018-10-11",
                "address_details": {
                    "address": "Mr. Rohit,  Institutional Area,  Shgb Subdistrict Gurgaon, Gurgaon, Haryana, 122003",
                    "lattitude": "0.00000000",
                    "ownership_type": "NA",
                    "longitude": "0.00000000"
                },
                "personal_information": {
                    "marital_status": "",
                    "gender": "",
                    "date_of_birth": "",
                    "shop_type": "",
                    "monthly_income": "NA",
                    "shop_name": "Mr. Rohit"
                },
                "contact_information": {
                    "mobile_number": "9879844564",
                    "email": null
                },
                "location": "Gurgaon, Haryana",
                "agent_mobile": "9879844564",
                "account_status": "Active"
            },
            {
                "agent_type": "I-CSP",
                "document_details": {
                    "e_sign_agreement": "e_sign_agreement",
                    "customer_photo": "customer_photo",
                    "post_dated_cheque": "post_dated_cheque",
                    "aadhaar_back": "aadhaar_back",
                    "pan_card": "pan_card",
                    "aadhaar_front": "aadhaar_front"
                },
                "agent_name": "Abhinav Sinha",
                "eko_code": "99070069",
                "profile": {
                    "account_type": "I-Merchant",
                    "eko_code": "99070069",
                    "wallet_balance": "1000000",
                    "shop_name": "",
                    "plan_name": "Money Transfer @ 0.50%"
                },
                "onboarded_on": "2018-10-11",
                "address_details": {
                    "address": "Abhinav Sinha,  Institutional Area,  Shgb Subdistrict Gurgaon, Gurgaon, Haryana, 122003",
                    "lattitude": "0.00000000",
                    "ownership_type": "NA",
                    "longitude": "0.00000000"
                },
                "personal_information": {
                    "marital_status": "",
                    "gender": "",
                    "date_of_birth": "",
                    "shop_type": "",
                    "monthly_income": "NA"
                },
                "contact_information": {
                    "mobile_number": "8976564654",
                    "email": null
                },
                "location": "Gurgaon, Haryana",
                "agent_mobile": "8976564654",
                "account_status": "Active"
            }
        ]
    },
    "response_type_id": 1802,
    "message": "Success! Network Found!",
    "status": 1802
}
/**
 * A <NetworkTable> component
 * TODO: This is my network table with clickable rows
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkTable></NetworkTable>`
 */

const NetworkTable = () => {
	// const recordCound = 10;

	const renderer = [
		{ name: "", field: "Sr. No." },
    { name: "agent_name", field: "Name", sorting: true, show: "Avatar" },
    { name: "agent_mobile", field: "Mobile Number", sorting: true },
    { name: "agent_type", field: "Type", sorting: true },
    { name: "onboarded_on", field: "Onboarded On", sorting: true },
    { name: "account_status", field: "Account Status", sorting: true, show: "Tag" },
    { name: "eko_code", field: "Eko Code", sorting: true },
    { name: "location", field: "Location", sorting: true, show: "IconButton" },
    { name: "", field: "", show: "Modal" },
    { name: "", field: "", show: "Arrow" },

	];
    const agentDetails = data?.data?.agent_details ?? [];
	return (
		<>
			<Table
				pageLimit="10"
				renderer={renderer}
				data={agentDetails}
				variant="evenStripedClickableRow"
				tableName="Network"
			/>
		</>
	);
};

export default NetworkTable;
