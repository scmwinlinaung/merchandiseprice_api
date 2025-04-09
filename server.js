const express = require("express");
const dotenv = require("dotenv");
const { connectDB, sequelize } = require("./api/util/database"); // Updated database utility
const marketRoute = require("./api/route/market_route");
const locationRoute = require("./api/route/location_route");
const itemRoute = require("./api/route/item_route");
const itemPriceRoute = require("./api/route/item_price_route");
const jwtRoute = require("./api/route/jwt_route");
const Market = require("./api/model/market");
const Item = require("./api/model/item");
const Location = require("./api/model/location");
const { validateToken } = require("./api/controller/jwt_controller");
const { v4: uuidv4 } = require("uuid");
const { MARKETS_CONSTANT } = require("./api/constant/market_constant");
const { CURRENCY_CONSTANT, OIL_CONSTANT, GOLD_CONSTANT, VEGETABLE_CONSTANT, CURRENCY_UNIT, OIL_UNIT, GOLD_UNIT, VEGETABLE_UNIT } = require("./api/constant/item_constant");
const { STATE_CONSTANT } = require("./api/constant/location_constant");

// Swagger dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import the Swagger configuration

const app = express();
const port = 7000;

async function main() {
  dotenv.config();

  try {
    // Initialize database connection and ensure it exists
    await connectDB();

    // Create default markets, items, and locations
    await createDefaultMarketAndItems();
    await createLocation();

    // Middleware to parse JSON bodies
    app.use(express.json());

    // JWT middleware
	app.use(async (req, res, next) => {
		const generateTokenRouteName = "/api/v1/generateToken";
		const swaggerApiRoutePrefix = "/api-docs";
	  
		if (
		  req.originalUrl !== generateTokenRouteName &&
		  !req.originalUrl.startsWith(swaggerApiRoutePrefix)
		) {
		  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || 'authorization';
		  const headerKey = tokenHeaderKey.toLowerCase(); // All headers in req.headers are lowercase
		  const token = req.headers[headerKey];
	
		  const tokenStatus = await validateToken(token);
		  console.log("Token Status: ", tokenStatus);
		  if (!tokenStatus) {
			return res.status(401).send("Unauthorized Exception");
		  }
		}
		next();
	  });
	  
    // Routes
	   // Serve Swagger UI at /api-docs
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use("/api/v1/", marketRoute);
    app.use("/api/v1/", locationRoute);
    app.use("/api/v1/", itemRoute);
    app.use("/api/v1/", itemPriceRoute);
    app.use("/api/v1/", jwtRoute);

    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
    });

    // Handle process termination
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, closing database connection...");
      await sequelize.close();
      console.log("Database connection closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit with failure code
  }
}

async function createDefaultMarketAndItems() {
  const marketCount = await Market.count();
  const itemCount = await Item.count();

  if (marketCount === 0 && itemCount === 0) {
    for (let i = 0; i < MARKETS_CONSTANT.length; i++) {
      const marketId = uuidv4();
      await Market.create({
        id: marketId,
        name: MARKETS_CONSTANT[i].name,
        description: MARKETS_CONSTANT[i].description,
        created_datetime: new Date(),
        modified_datetime: new Date(),
      });

      const allItems = [CURRENCY_CONSTANT, OIL_CONSTANT, GOLD_CONSTANT, VEGETABLE_CONSTANT];
      const allUnits = [CURRENCY_UNIT, OIL_UNIT, GOLD_UNIT, VEGETABLE_UNIT];

      for (let j = 0; j < allItems[i].length; j++) {
        const item = {
          id: uuidv4(),
          name: allItems[i][j],
          marketId: marketId,
          unit: allUnits[i][j] ?? allUnits[i][0], // Fallback to first unit if null
          created_datetime: new Date(),
          modified_datetime: new Date(),
        };
        await Item.create(item);
      }
    }
    console.log("Default markets and items created successfully.");
  } else {
    console.log("Default markets or items already exist, skipping creation.");
  }
}

async function createLocation() {
  const locationCount = await Location.count();
  if (locationCount === 0) {
    for (let i = 0; i < STATE_CONSTANT.length; i++) {
      const location = {
        id: uuidv4(),
        state: STATE_CONSTANT[i],
        district: '',
        subdistrict: '',
        city: '',
        created_datetime: new Date(),
        modified_datetime: new Date(),
      };
      await Location.create(location);
    }
    console.log("Default locations created successfully.");
  } else {
    console.log("Default locations already exist, skipping creation.");
  }
}

main();