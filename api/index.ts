import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import "dotenv/config";

console.log("API KEY:", process.env.WEATHER_API_KEY);

const app = express();

// 🔑 1️⃣ 서버에 API 키 고정 (환경변수 권장)


const SERVICE_KEY =
  process.env.WEATHER_API_KEY ??
  "여기에_임시로_넣어도_되지만_배포시엔_환경변수로";

app.get("/weather", async (req: Request, res: Response) => {
  try {
    const {
      numOfRows = "10",
      pageNo = "1",
      base_date,
      base_time,
      nx,
      ny,
    } = req.query;

    // 필수 파라미터 체크 (안 하면 기상청이 400 줌)
    if (!base_date || !base_time || !nx || !ny) {
      return res.status(400).json({
        message: "Missing required query parameters",
      });
    }

    const api_url =
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

    const response = await axios.get(api_url, {
      params: {
        serviceKey: SERVICE_KEY, // ✅ 여기서만 사용
        numOfRows,
        pageNo,
        dataType: "JSON", // JSON 권장 (GPT 처리 쉬움)
        base_date,
        base_time,
        nx,
        ny,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Weather API request failed",
    });
  }
});

app.listen(3000, () => {
  console.log(
    "http://127.0.0.1:3000/weather?&numOfRows=10&pageNo=1&base_date=20260107&base_time=0600&nx=61&ny=125"
  );
});