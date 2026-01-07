import express from "express";
import type { Request, Response } from "express";
import axios from "axios";

const app = express();

app.get("/weather", async (req: Request, res: Response) => {
  try {
    const {
      serviceKey,
      numOfRows,
      pageNo,
      base_date,
      base_time,
      nx,
      ny,
    } = req.query;

    const api_url =
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";

    const response = await axios.get<string>(api_url, {
      params: {
        serviceKey,
        numOfRows,
        pageNo,
        base_date,
        base_time,
        nx,
        ny,
      },
      responseType: "text",
    });

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Weather API request failed");
  }
});

app.listen(3000, () => {
  console.log(
    "http://127.0.0.1:3000/weather?serviceKey=9dd8a360e4b64fcc14d84e5ddafe0a9ed8a7888ca5a61940678edee1722607ae&numOfRows=10&pageNo=1&base_date=20260107&base_time=0600&nx=61&ny=125"
  );
});
