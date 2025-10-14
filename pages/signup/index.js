import { PaddingBox } from "components";
import { Onboarding } from "page-components";

/**
 * An Signup page for agent onboarding
 * Uses the Onboarding component with agent onboarding specific configuration
 * @returns {JSX.Element} The rendered Signup component
 * @example
 * ```tsx
 * <Signup />
 * ```
 */
const SignupPage = () => {
	// MARK: JSX
	return (
		<PaddingBox>
			<Onboarding />
		</PaddingBox>
	);
};

SignupPage.pageMeta = {
	title: "Signup",
	hideMenu: true,
};

export default SignupPage;
