const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();