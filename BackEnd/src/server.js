require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const listEndpoints = require('express-list-endpoints');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Registered routes:", listEndpoints(app));
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();