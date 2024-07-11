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
  result = 0;

const updateNums = () => {
  
}

app.get("/e", (req, res) => {
  console.log("Hello World!")
  return res.status(200).json({
    "number": numsReceived,
    "windowPrevState": prev,
    "windowCurrState": curr,
    "avg": result
  });
})

app.get("/p", (req, res) => {
  console.log("Hello World!");
    return res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
});

app.get("/f", (req, res) => {
  console.log("Hello World!");
    return res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
});

app.get("/r", (req, res) => {
  console.log("Hello World!");
    res.status(200).json({
      number: numsReceived,
      windowPrevState: prev,
      windowCurrState: curr,
      avg: result,
    });
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listnening on por̉̉t ${process.env.PORT}!`);
}
);