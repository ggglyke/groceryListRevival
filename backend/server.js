require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();

// Trust proxy - OBLIGATOIRE sur Render.com et autres plateformes hébergées
// Permet à Express de faire confiance aux headers X-Forwarded-* ajoutés par le reverse proxy
app.set('trust proxy', 1);

// Security headers avec Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Pour les styles inline en dev
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Éviter les conflits avec CORS
  })
);

const allowlist = new Set([
  "http://localhost:3000",
  "https://www.guillaumejarry.com",
  "https://guillaumejarry.com",
]);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://www.guillaumejarry.com",
    "https://guillaumejarry.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // ⬇️ ajoute X-XSRF-TOKEN (Axios peut l'envoyer) + X-Requested-With + x-csrf-token
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-XSRF-TOKEN",
    "x-csrf-token",
  ],
  optionsSuccessStatus: 200, // évite les 204 problématiques
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting général - Désactivé en développement
if (process.env.NODE_ENV === "production") {
  const { generalLimiter } = require("./middlewares/rateLimiter.middleware");
  app.use("/api/", generalLimiter);
}

// CSRF Protection - TEMPORAIREMENT DÉSACTIVÉ EN PRODUCTION
// TODO: Implémenter correctement le CSRF côté frontend avant de réactiver
// Le frontend doit récupérer le token via /api/csrf-token et l'envoyer dans les headers
const ENABLE_CSRF = process.env.ENABLE_CSRF === "true";

if (process.env.NODE_ENV === "production" && ENABLE_CSRF) {
  const { doubleCsrfProtection } = require("./middlewares/csrf.middleware");
  app.use(doubleCsrfProtection);
  console.log("[PROD] CSRF protection enabled");

  // Route to get CSRF token (production uniquement)
  app.get("/api/csrf-token", (req, res) => {
    const { generateToken } = require("./middlewares/csrf.middleware");
    const token = generateToken(req, res);
    res.json({ csrfToken: token });
  });
} else {
  if (process.env.NODE_ENV === "production") {
    console.log("[PROD] CSRF protection is DISABLED - Set ENABLE_CSRF=true to enable");
  } else {
    console.log("[DEV] CSRF protection is disabled in development mode");
  }

  // Route dummy
  app.get("/api/csrf-token", (_req, res) => {
    res.json({ csrfToken: "csrf-disabled" });
  });
}

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
  process.env.SELF_URL || "https://grocerylistrevival.onrender.com";
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
