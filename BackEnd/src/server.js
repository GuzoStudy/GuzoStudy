require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const listEndpoints = require("express-list-endpoints");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    // Print all registered routes
    console.log("Registered routes:", listEndpoints(app));

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
