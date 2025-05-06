/**
 * Admin user mock data for test cases
 */

import { MockUser, User } from "./user.mock";

export interface AdminUser extends User {
	is_org_admin: 1;
	user_type: "22";
}

export const MockAdminUser: AdminUser = {
	...MockUser,
	is_org_admin: 1,
	user_type: "22",
};
