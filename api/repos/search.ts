import axios from "axios";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { order, page, per_page, q, sort } = req.query;

  try {
    const { data } = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: { q, sort, order, per_page, page },
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );
    res.json(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status ?? 500).json({ message: err.message });
    }
  }
}
