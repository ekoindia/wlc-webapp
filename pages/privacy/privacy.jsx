import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { useOrgDetailContext } from "contexts";
import { LayoutLogin } from "layout-components";
import { useRouter } from "next/router";

const ZOHO_FORM_URL =
	"https://forms.zohopublic.in/ekoindiafinancialservicespvtlt/form/Reachouttous/formperma/zlHNZZ7Kyaw0S-8SpVtUMZLZ_bMHYLMjlzXeP12FRoc";

const PrivacyPage = () => {
	const { orgDetail } = useOrgDetailContext();
	const router = useRouter();
	const { app_name, org_name, org_id } = orgDetail;
	const currentUrl = window.location.href;
	const baseUrl = currentUrl.split("/").slice(0, 3).join("/");
	const reach_out_form_url = `${ZOHO_FORM_URL}?org_id=${org_id}&org_url=${baseUrl}`;
	const delete_my_account_form_url = `${baseUrl}/delete_my_account`;

	// Is Google Login available?
	const showGoogle =
		orgDetail?.login_types?.google?.default ||
		orgDetail?.login_types?.google?.client_id
			? true
			: false;

	return (
		<Box borderTop="10px solid" borderTopColor="primary.DEFAULT">
			<Flex gap="2" mt="8" pl="1.5" pr="8">
				<IcoButton
					mt="1.5"
					iconName="arrow-back"
					position="sticky"
					top="2"
					size="sm"
					onClick={() => router.back()}
				/>

				<Box
					maxW={{ base: "100%", md: "600px" }}
					w="full"
					mx="auto"
					sx={{
						"ul ul": {
							marginLeft: "2em",
						},
					}}
				>
					<H1
						color="primary.DEFAULT"
						mb="8"
						w="full"
						textAlign="center"
					>
						Privacy Policy
					</H1>

					<P>
						Eko India Financial Services Pvt. Ltd. built the{" "}
						{app_name} app as a Commercial app. This SERVICE is
						provided by {org_name} and is intended for use as is.
					</P>
					<P>
						This page is used to inform the app users regarding our
						policies with the collection, use, and disclosure of
						Personal Information if anyone decided to use our
						SERVICE.
					</P>
					<P>
						If you choose to use our SERVICE, then you agree to the
						collection and use of information in relation to this
						policy. The Personal Information that we collect is used
						for providing and improving the SERVICE. We will not use
						or share your information with anyone except as
						described in this Privacy Policy.
					</P>

					<H2>Information Collection, Sharing, and Usage</H2>
					<P>
						This app collects certain types of information to
						provide and improve its functionality, ensure security,
						and deliver a seamless user experience. Below, we
						outline the types of information we collect, the
						purposes for which they are used, and any instances of
						sharing:
					</P>

					<H3>1. Personal Information</H3>
					<P pl={8}>
						<ul>
							<li>
								<strong>Name:</strong>
								<ul>
									<li>
										<em>Purpose:</em> app functionality,
										fraud prevention, KYC, account
										management.
									</li>
									<li>
										<em>Sharing:</em> optionally shared only
										with trusted providers of 3rd party
										services that you opt to use, for KYC
										purposes.
									</li>
								</ul>
							</li>
							<li>
								<strong>Email Address:</strong> (optional)
								<ul>
									<li>
										<em>Purpose:</em> app functionality,
										developer communication, fraud
										prevention, account management.
									</li>
									<li>
										<em>Sharing:</em> optional and shared
										only when necessary with providers of
										trusted services that you opt to use,
										for KYC or communication purposes.
									</li>
								</ul>
							</li>
							<li>
								<strong>User ID:</strong>
								<ul>
									<li>
										<em>Purpose:</em> app functionality,
										fraud prevention, KYC, account
										management.
									</li>
									<li>
										<em>Sharing:</em> optionally shared with
										providers of trusted services that you
										opt to use, for account identification
										purposes.
									</li>
								</ul>
							</li>
							<li>
								<strong>Address:</strong>
								<ul>
									<li>
										<em>Purpose:</em> fraud prevention, KYC,
										account management.
									</li>
									<li>
										<em>Sharing:</em> not shared externally
										unless required for fraud-related
										investigations.
									</li>
								</ul>
							</li>
							<li>
								<strong>Phone Number:</strong>
								<ul>
									<li>
										<em>Purpose:</em> app functionality,
										developer communication, fraud
										prevention, account management.
									</li>
									<li>
										<em>Sharing:</em> optionally shared with
										providers of trusted services that you
										opt to use, for KYC and communication
										purposes.
									</li>
								</ul>
							</li>
							<li>
								<strong>Date of Birth (DOB):</strong>
								<ul>
									<li>
										<em>Purpose:</em> KYC, fraud prevention,
										account management.
									</li>
									<li>
										<em>Sharing:</em> not shared externally
										unless required for fraud-related
										investigations
									</li>
								</ul>
							</li>
						</ul>
					</P>

					<H3>2. Financial Information</H3>
					<P pl={8}>
						<ul>
							<li>
								<strong>User Payment Information:</strong>
								<ul>
									<li>
										<em>Purpose:</em> app functionality
										(e.g., enabling purchases or
										settlements)
									</li>
									<li>
										<em>Sharing:</em> optional and used only
										as required for transactions via secure
										payment gateways.
									</li>
								</ul>
							</li>
						</ul>
					</P>

					<H3>3. Location Information</H3>
					<P pl={8}>
						<ul>
							<li>
								<strong>Precise Location:</strong>
								<ul>
									<li>
										<em>Purpose:</em> app functionality,
										fraud prevention, analytics.
									</li>
									<li>
										<em>Sharing:</em> not shared externally
										unless required for fraud-related
										investigations.
									</li>
								</ul>
							</li>
						</ul>
					</P>

					<H3>4. Photos</H3>
					<P pl={8}>
						<ul>
							<li>
								<em>Purpose:</em> KYC, fraud prevention, account
								management.
							</li>
							<li>
								<em>Sharing:</em> not shared externally unless
								required for fraud-related investigations
							</li>
						</ul>
					</P>

					<H3>5. App Information & Performance</H3>
					<P pl={8}>
						<ul>
							<li>
								<strong>Crash Logs:</strong>
								<ul>
									<li>
										<em>Purpose:</em> analytics (to improve
										app stability and functionality).
									</li>
									<li>
										<em>Sharing:</em> required and securely
										shared with analytics providers.
									</li>
								</ul>
							</li>
							<li>
								<strong>Diagnostics:</strong>
								<ul>
									<li>
										<em>Purpose:</em> analytics (to identify
										and fix issues).
									</li>
									<li>
										<em>Sharing:</em> required and securely
										shared with analytics providers for
										troubleshooting.
									</li>
								</ul>
							</li>
						</ul>
					</P>

					<H3>6. Files & Documents</H3>
					<P pl={8}>
						<ul>
							<li>
								<em>Purpose:</em> processed ephemerally for app
								functionality, KYC, fraud prevention, etc.
							</li>
							<li>
								<em>Sharing:</em> not stored or shared
								externally.
							</li>
						</ul>
					</P>

					<H3>7. App Activity</H3>
					<P pl={8}>
						<ul>
							<li>
								<strong>App Interactions:</strong>
								<ul>
									<li>
										<em>Purpose:</em> analytics (to
										understand user behavior and improve app
										experience).
									</li>
									<li>
										<em>Sharing:</em> required and securely
										shared with analytics providers.
									</li>
								</ul>
							</li>
						</ul>
					</P>

					<H3>8. Device or Other Identifiers</H3>
					<P pl={8}>
						<ul>
							<li>
								<em>Purpose:</em> fraud prevention, developer
								communication.
							</li>
							<li>
								<em>Sharing:</em> may be shared externally for
								developer communication (eg, push notification)
								or for fraud-related investigations.
							</li>
						</ul>
					</P>

					{showGoogle ? (
						<>
							<H3>9. Data Collected by Third Party Services</H3>
							<P>
								The app does use third party services that may
								collect information used to identify you. Link
								to privacy policy of third party service
								providers used by the app:
							</P>
							<P pl={8}>
								<ul>
									<li>
										<Link
											color="accent.DEFAULT"
											href="https://www.google.com/policies/privacy/"
											target="_blank"
										>
											Google
										</Link>
									</li>
								</ul>
							</P>
						</>
					) : null}

					<P>
						The app is built and hosted by Eko India Financial
						Services Pvt. Ltd. and is responsible for collecting and
						using the data as described in this policy.
					</P>

					<H2>Log Data</H2>
					<P>
						Whenever you use our SERVICE, in a case of an error in
						the app we collect data and information (through third
						party products) called Log Data. This Log Data may
						include information such as your device Internet
						Protocol (“IP”) address, device name, operating system
						version, the configuration of the app when utilizing our
						SERVICE, the time and date of your use of the SERVICE,
						and other statistics.
					</P>
					<H2>Cookies</H2>
					<P>
						Cookies are files with small amount of data that is
						commonly used an anonymous unique identifier. These are
						sent to your browser from the website that you visit and
						are stored on your device internal memory.
					</P>
					<P>
						This SERVICE does not use these “cookies” explicitly.
						However, the app may use third party code and libraries
						that use “cookies” to collection information and to
						improve their services. You may choose to refuse these
						cookies via your device settings. If you choose to
						refuse these cookies, you may not be able to use some
						parts of this SERVICE.
					</P>
					<H2>Service Providers</H2>
					<P>
						We may employ third-party companies and individuals due
						to the following reasons:
					</P>
					<P pl={8}>
						<ul>
							<li>To facilitate our SERVICE</li>
							<li>
								To provide their service for you to use
								optionally
							</li>
							<li>To provide the SERVICE on our behalf</li>
							<li>To perform SERVICE-related services</li>
							<li>
								To assist us in analyzing how our SERVICE is
								used
							</li>
						</ul>
					</P>
					<P>
						We want to inform users of this SERVICE that these third
						parties may have access to your Personal Information.
						The reason is to perform the tasks assigned to them or
						required by the services that they may provide to you.
						However, they are obligated not to disclose or use the
						information for any other purpose.
					</P>
					<H2>Security</H2>
					<P>
						We value your trust in providing us your Personal
						Information, thus we are striving to use commercially
						acceptable means of protecting it. But remember that no
						method of transmission over the internet, or method of
						electronic storage is 100% secure and reliable, and we
						cannot guarantee its absolute security.
					</P>
					<H2>Links to Other Sites</H2>
					<P>
						This SERVICE may contain links to other sites. If you
						click on a third-party link, you will be directed to
						that site. Note that these external sites are not
						operated by us. Therefore, we strongly advise you to
						review the Privacy Policy of these websites. We have no
						control over and assume no responsibility for the
						content, privacy policies, or practices of any
						third-party sites or services.
					</P>
					<H2>Children’s Privacy</H2>
					<P>
						This SERVICE does not address anyone under the age of
						18. We do not knowingly collect personally identifiable
						information from children under 18. In the case we
						discover that a child under 18 has provided us with
						personal information, we immediately delete this from
						our servers. If you are a parent or guardian and you are
						aware that your child has provided us with personal
						information, please contact us using the form below so
						that we will be able to take necessary actions.
					</P>
					<H2>Changes to This Privacy Policy</H2>
					<P>
						We may update our Privacy Policy from time to time.
						Thus, you are advised to review this page periodically
						for any changes. We will notify you of any changes by
						posting the new Privacy Policy on this page. These
						changes are effective immediately after they are posted
						on this page.
					</P>
					<H2>Personal Data and Account Deletion</H2>
					<P>
						Your privacy is important to us. If you wish to delete
						any of your personal data or completely close your
						account, please submit your request{" "}
						<Link
							color="accent.DEFAULT"
							href={delete_my_account_form_url}
						>
							here
						</Link>
						.
					</P>

					<H2>Contact Us</H2>
					<P>
						If you have any questions or suggestions about our
						Privacy Policy, please reach out to us by filling in the
						details below:
						{/* {metadata?.support_contacts?.email ? (
							Email us at at{" "}
							<Link
								color="accent.DEFAULT"
								href={
									"mailto:" +
									metadata?.support_contacts?.email
								}
								target="_blank"
							>
								{metadata?.support_contacts?.email}
							</Link>, or fill in the form below:
						) : null} */}
						<iframe
							allow="fullscreen"
							src={reach_out_form_url}
							marginheight="0"
							marginwidth="0"
							style={{
								border: "none",
								width: "100%",
								height: "880px",
							}}
						></iframe>
					</P>
				</Box>
			</Flex>
		</Box>
	);
};

/**
 * Paragraph component
 * @param root0
 * @param root0.mb
 * @param root0.children
 */
const P = ({ mb = 5, children, ...rest }) => {
	return (
		<Text mb={mb} textAlign="justify" {...rest}>
			{children}
		</Text>
	);
};

/**
 * Heading 1 component
 * @param root0
 * @param root0.mb
 * @param root0.children
 */
const H1 = ({ mb = 6, children, ...rest }) => {
	return (
		<Text as="h1" fontSize="3xl" fontWeight="semibold" mb={mb} {...rest}>
			{children}
		</Text>
	);
};

/**
 * Heading 2 component
 * @param root0
 * @param root0.mb
 * @param root0.children
 */
const H2 = ({ mb = 2, children, ...rest }) => {
	return (
		<Text as="h2" fontSize="xl" fontWeight="bold" mb={mb} {...rest}>
			{children}
		</Text>
	);
};

/**
 * Heading 3 component
 * @param root0
 * @param root0.mb
 * @param root0.children
 */
const H3 = ({ mb = 2, children, ...rest }) => {
	return (
		<Text as="H3" fontSize="17px" fontWeight="bold" mb={mb} {...rest}>
			{children}
		</Text>
	);
};

PrivacyPage.pageMeta = {
	title: "Privacy Policy",
};

// Custom simple layout...
PrivacyPage.getLayout = LayoutLogin;

export default PrivacyPage;
