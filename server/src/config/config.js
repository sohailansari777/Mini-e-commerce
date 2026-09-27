import dotenv from "dotenv";
dotenv.config();


const config ={
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECREAT,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECREAT,
}

export default config