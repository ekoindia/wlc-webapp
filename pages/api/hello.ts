// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

/**
 *
 * @param _req
 * @param res
 */
export default function handler(
	_req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(200).json({ name: "Sync" });
}
