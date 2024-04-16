import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { LayoutLogin } from "components/Layout";
import { useOrgDetailContext } from "contexts";
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

				<Box maxW={{ base: "100%", md: "600px" }} w="full" mx="auto">
					<H1 color="primary.DEFAULT" mb="4">
						{app_name} Privacy Policy
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
					{/* <P>
					The terms used in this Privacy Policy have the same meanings
					as in our Terms and Conditions, which is accessible at
					Connect unless otherwise defined in this Privacy Policy.
				</P> */}
					<H2>Information Collection and Use</H2>
					<P>
						For a better experience, while using our SERVICE, we may
						require you to provide us with certain personally
						identifiable information, including but not limited to
						email, & profile picture. The information that we
						request may be retained by us and used as described in
						this privacy policy. We do not share these information
						with any third party.
					</P>
					<P pl={8}>
						<ol>
							<li>
								<strong>Email:</strong> We store and use your
								email-ID to identify you when you login again to
								the app. We do not share your email with any
								third party.
							</li>
							<li>
								<strong>Profile Picture:</strong> We do not
								store or process your profile picture in any
								manner and only use it to show your picture in
								the app during a session when you login using
								your social identity.
							</li>
						</ol>
					</P>
					<P>
						The app is built and hosted by Eko India Financial
						Services Pvt. Ltd. and is responsible for collecting and
						using the data as described in this policy.
					</P>
					<P>
						The app does use third party services that may collect
						information used to identify you.
					</P>
					<P>
						Link to privacy policy of third party service providers
						used by the app:
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
					<H2>Log Data</H2>
					<P>
						We want to inform you that whenever you use our SERVICE,
						in a case of an error in the app we collect data and
						information (through third party products) called Log
						Data. This Log Data may include information such as your
						device Internet Protocol (“IP”) address, device name,
						operating system version, the configuration of the app
						when utilizing our SERVICE, the time and date of your
						use of the SERVICE, and other statistics.
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
						improve their services. You have the option to either
						accept or refuse these cookies and know when a cookie is
						being sent to your device. If you choose to refuse our
						cookies, you may not be able to use some portions of
						this SERVICE.
					</P>
					<H2>Service Providers</H2>
					<P>
						We may employ third-party companies and individuals due
						to the following reasons:
					</P>
					<P pl={8}>
						<ul>
							<li>To facilitate our SERVICE</li>
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
						parties have access to your Personal Information. The
						reason is to perform the tasks assigned to them on our
						behalf. However, they are obligated not to disclose or
						use the information for any other purpose.
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
						These Services do not address anyone under the age of
						13. We do not knowingly collect personally identifiable
						information from children under 13. In the case we
						discover that a child under 13 has provided us with
						personal information, we immediately delete this from
						our servers. If you are a parent or guardian and you are
						aware that your child has provided us with personal
						information, please contact us so that we will be able
						to do necessary actions.
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

					{/* {metadata?.support_contacts?.email ? ( */}
					{/* <> */}
					<H2>Reach out to us</H2>
					<P>
						If you have any questions or suggestions about our
						Privacy Policy, please reach out to us by filling in the
						details below:
						{/* <Link
								color="accent.DEFAULT"
								href={
									"mailto:" +
									metadata?.support_contacts?.email
								}
								target="_blank"
							>
								{metadata?.support_contacts?.email}
							</Link> */}
					</P>
					{/* </> */}
					{/* ) : null} */}

					<iframe
						allow="fullscreen"
						src={reach_out_form_url}
						height={1000}
						width="100%"
						frameborder="0"
						marginheight="0"
						marginwidth="0"
					></iframe>
				</Box>
			</Flex>
		</Box>
	);
};

/**
 * Paragraph component
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
 */
const H2 = ({ mb = 2, children, ...rest }) => {
	return (
		<Text as="h2" fontSize="xl" fontWeight="bold" mb={mb} {...rest}>
			{children}
		</Text>
	);
};

PrivacyPage.pageMeta = {
	title: "Privacy Policy",
};

// Custom simple layout...
PrivacyPage.getLayout = (page) => <LayoutLogin>{page}</LayoutLogin>;

export default PrivacyPage;
