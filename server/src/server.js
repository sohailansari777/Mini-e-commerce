import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
await connectDB();
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

