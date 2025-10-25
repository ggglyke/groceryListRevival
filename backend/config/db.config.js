require("dotenv").config();

if (!process.env.MONGODB_URI) {
  console.error("❌ [DATABASE] MONGODB_URI is missing in .env file");
  process.exit(1);
}

module.exports = {
  url: process.env.MONGODB_URI,
};
