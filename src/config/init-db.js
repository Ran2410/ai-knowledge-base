const sequelize = require("./database");
require("../models");

async function initDB() {
  try {
    await sequelize.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("pgvector extension enabled");

    await sequelize.sync({ alter: true });
    console.log("Tables created/synced");

    await sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'chunks' AND column_name = 'embedding'
        ) THEN
          ALTER TABLE chunks ADD COLUMN embedding vector(384);
        END IF;
      END $$;
    `);
    console.log("Embedding column verified");

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_chunks_embedding
      ON chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)

    `);
    console.log("Vector index created");

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("DB init failed:", error.message);
  }
  process.exit();
}

initDB();
