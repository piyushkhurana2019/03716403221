import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let prev = [];
let curr = [];
let numsReceived = [];
let result = 0;
const windowSize = 10;

let bearerToken = process.env.BEARER_TOKEN;
let tokenExpirationTime = parseInt(process.env.TOKEN_EXPIRATION_TIME, 10);

const refreshToken = async () => {
  try {
    const response = await fetch(process.env.REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName: "AK-Estate",
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        ownerName: "Piyush",
        ownerEmail: "piyushkhurana159@gmail.com",
        rollNo: "03716403221"
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    bearerToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw new Error('Token refresh failed');
  }
};

const fetchNumbers = async (endpoint) => {
  try {
    const response = await fetch(`http://20.244.56.144/test/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch numbers: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.numbers;
  } catch (error) {
    console.error('Failed to fetch numbers:', error);
    return [];
  }
};

const updateNums = async (endpoint) => {
  if (Date.now() >= tokenExpirationTime) {
    await refreshToken();
  }

  numsReceived = await fetchNumbers(endpoint);

  prev = [...curr];
  const uniqueNums = numsReceived.filter(num => !curr.includes(num));
  curr = [...curr, ...uniqueNums].slice(-windowSize);
  result = curr.reduce((sum, num) => sum + num, 0) / curr.length;
};

const handleRequest = (endpoint) => async (req, res) => {
  try {
    await updateNums(endpoint);
    res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};

app.get("/e", handleRequest("even"));
app.get("/p", handleRequest("primes"));
app.get("/f", handleRequest("fibo"));
app.get("/r", handleRequest("rand"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
