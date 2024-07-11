import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());

let prev = [],
  curr = [],
  numsReceived = [],
  result = 0,
  windowSize = 5;

const updateNums = async (endpoint) => {
  numsReceived = await fetch(`http://20.244.56.144/test/${endpoint}`);
  prev = curr;
  curr = curr.concat(numsReceived);
  curr = curr.slice(-windowSize);
};

app.get(
  "/e",
  () => updateNums("even"),
  (req, res) => {
    console.log("Hello World!");
    return res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
  }
);

app.get(
  "/p",
  () => updateNums("primes"),
  (req, res) => {
    console.log("Hello World!");
    return res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
  }
);

app.get(
  "/f",
  () => updateNums("fibo"),
  (req, res) => {
    console.log("Hello World!");
    return res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
  }
);

app.get(
  "/r",
  () => updateNums("rand"),
  (req, res) => {
    console.log("Hello World!");
    res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
  }
);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listnening on por̉̉t ${process.env.PORT}!`);
}
);

const resp = await fetch(`http://20.244.56.144/test/primes`);
console.log(await resp.json());