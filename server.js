import dotenv from 'dotenv'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mysql from 'mysql2/promise';
// import { createPool } from 'mariadb'
import jwt from 'jsonwebtoken';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
// import { XMLBuilder } from 'fast-xml-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './server/src/config/env.js';
import { logger } from './server/src/config/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use(express.static('dist')); // or your frontend path

const isProdOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const pool = mysql.createPool({
  host: isProdOrStaging ? process.env.DB_HOST : 'switchback.proxy.rlwy.net',
  user: isProdOrStaging ? process.env.DB_USER : 'root',
  password: isProdOrStaging ? process.env.DB_PASSWORD : 'IxKdGZxqcyhIGFkwgBHdNGFarKPqYEvS',
  database: isProdOrStaging ? process.env.DB_DATABASE : 'nebasjoa-blog',
  port: isProdOrStaging ? process.env.DB_PORT : 10236
});

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

// Test database connection
pool.getConnection()
  .then(conn => {
    const isProdLike = ['production', 'staging'].includes(process.env.NODE_ENV);
    console.log(
      new Date().toLocaleString('de-DE') +
      (isProdLike ? ": Connected to Carvestigate production database." : ": Connected to MariaDB on TEST DB!")
    );
    conn.release();
  })
  .catch(err => {
    console.error("Unable to connect to MariaDB:", err)
  });

const sanitize = (html) =>
    sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'pre', 'code']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'loading', 'decoding']
        }
    });

// ---------- Health ----------
app.get('/healthz', (req, res) => res.json({ ok: true }));

// ---------- Static (serve Vue dist) ----------
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*root', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`nebasjoa-blog API listening on :${port}`);
});