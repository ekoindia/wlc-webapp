import JSEncrypt from "jsencrypt";

/**
 * RSA-encrypts (PKCS#1 v1.5) a plaintext value using a public key served by
 * connect-api's interaction/parameter metadata (`enc_pub_key` — a base64
 * X.509 SubjectPublicKeyInfo blob, no PEM header/footer). Confirmed against
 * connect-api's DB: the `aadhar` parameter on catalog interactions 483
 * (AePS Cashout), 994 (AePS Daily Authentication), and 614 (Complete Your
 * KYC) all carry this same key; `piddata` does not (it has its own UIDAI
 * PID-block encryption, unrelated).
 * @param value
 * @param publicKeyBase64
 */
export function rsaEncrypt(value: string, publicKeyBase64: string): string {
	const pem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`;
	const encryptor = new JSEncrypt();
	encryptor.setPublicKey(pem);

	const encrypted = encryptor.encrypt(value);
	if (!encrypted) {
		throw new Error(
			"Failed to RSA-encrypt value — invalid public key or input."
		);
	}
	return encrypted;
}

export default rsaEncrypt;
