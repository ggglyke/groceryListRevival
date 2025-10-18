require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const allowlist = new Set([
  "http://localhost:3000",
  "https://www.guillaumejarry.com",
  "https://guillaumejarry.com",
]);

const corsOptions = {
  origin(origin, cb) {
    // autorise aussi Postman/curl (origin null)
    if (!origin || allowlist.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // ⬇️ ajoute X-XSRF-TOKEN (Axios peut l'envoyer) + X-Requested-With
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-XSRF-TOKEN",
  ],
  optionsSuccessStatus: 200, // évite les 204 problématiques
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  // aide caches inverses/CDN et s'assure que l'origine est bien variée
  res.setHeader("Vary", "Origin");
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowlist.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With,X-XSRF-TOKEN"
    );
  }
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to this amazing groceries list app." });
});

require("./routes/product.routes")(app);
require("./routes/rayon.routes")(app);
require("./routes/list.routes")(app);
require("./routes/magasin.routes")(app);
require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
// route santé
app.get("/healthz", (req, res) => res.status(200).send("ok"));

// keep-alive interne
const ENABLE_SELF_PING = process.env.ENABLE_SELF_PING === "1";
const SELF_URL =
  process.env.SELF_URL || "https://grocery-list-app-backend.onrender.com/";
const PING_INTERVAL_MS = Number(process.env.PING_INTERVAL_MS || 14 * 60 * 1000);

if (process.env.NODE_ENV === "production" && ENABLE_SELF_PING) {
  const ping = async () => {
    try {
      const r = await fetch(`${SELF_URL}/healthz`, {
        method: "GET",
        cache: "no-store",
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      console.log("[keepalive] ok");
    } catch (e) {
      console.log("[keepalive] fail:", e.message);
    }
  };
  setTimeout(ping, 10_000);
  const id = setInterval(ping, PING_INTERVAL_MS);
  const stop = () => clearInterval(id);
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
