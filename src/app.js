import express from 'express';
import dotenv from 'dotenv/config';


const PORT = process.env.SERVER_PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log(`app running on  http://localhost:${PORT}`)
})