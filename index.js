const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
 
let db = new sqlite3.Database("mydatabase.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite.");
  }
});

const PORT = 4003;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

if (db) {
  db.run(
    `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price INTEGER,
      description TEXT,
      category TEXT,
      image TEXT,
      sold TEXT,
      dateOfSale DATE
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log('Table "sales" created or already exists.');
      }
    }
  );
}

const fetchAndInsert = async () => {
  if (!db) {
    console.error("No database connection available.");
    return;
  }

  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;

    for (const item of data) {
      const queryData = `SELECT id FROM sales WHERE id = ?`;
      db.get(queryData, [item.id], (err, existingData) => {
        if (err) {
          console.error("Error querying the database:", err.message);
        } else if (!existingData) {
          const insertQuery = `
            INSERT INTO sales (id, title, price, description, category, image, sold, dateOfSale) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          db.run(
            insertQuery,
            [
              item.id,
              item.title,
              item.price,
              item.description,
              item.category,
              item.image,
              item.sold,
              item.dateOfSale,
            ],
            (err) => {
              if (err) {
                console.error("Error inserting data:", err.message);
              }
            }
          );
        }
      });
    }

    console.log("Transactions added.");
  } catch (error) {
    console.error("Error during fetch and insert:", error.message);
  }
};

if (db) {
  fetchAndInsert();
} else {
  console.error("Database connection is null. Cannot fetch and insert data.");
}

app.get("/getSales", (req, res) => {
  if (!db) {
    return res.status(500).send("Database connection is not available.");
  }

  db.all("SELECT * FROM sales", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving sales data:", err.message);
      return res.status(500).send("Error retrieving sales data.");
    } else if (rows.length === 0) {
      return res.status(404).send("No sales data found.");
    } else {
      return res.json(rows);
    }
  });
});

process.on("SIGINT", () => {
  console.log("Closing SQLite connection...");
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("Error closing SQLite:", err.message);
      }
    });
  }
  process.exit();
});
