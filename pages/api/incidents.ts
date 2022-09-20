import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../models/query";
import type { FeatureCollection } from "geojson";

type Response = {
  data: FeatureCollection;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const data = await query();
  res.status(200).json({ data });
}
