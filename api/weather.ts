import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const {
      base_date,
      base_time,
      nx,
      ny,
      numOfRows = "10",
      pageNo = "1",
    } = req.query;

    if (!base_date || !base_time || !nx || !ny) {
      return res.status(400).json({
        message: "Missing required query parameters",
      });
    }

    const SERVICE_KEY = process.env.WEATHER_API_KEY;
    if (!SERVICE_KEY) {
      return res.status(500).json({
        message: "WEATHER_API_KEY is not set",
      });
    }

    const response = await axios.get(
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
      {
        params: {
          serviceKey: SERVICE_KEY,
          dataType: "JSON",
          base_date,
          base_time,
          nx,
          ny,
          numOfRows,
          pageNo,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (e: any) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Weather API request failed" });
  }
}
