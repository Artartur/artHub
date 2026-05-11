import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_URL = process.env.GITHUB_API_URL as string;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { order, page, per_page, q, sort } = req.query;

  try {
    const { data } = await axios.get(`${API_URL}/search/repositories`, {
      params: { q, sort, order, per_page, page },
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    res.json(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({ message: err.message });
    }
  }
}
