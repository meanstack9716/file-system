import express from 'express';
import dotenv from 'dotenv';
import fileRouter from "./routes/files.js"
const app = express()
dotenv.config();

app.use(express.json());
app.use('/files', fileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});