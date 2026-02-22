import dotenv from 'dotenv'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
// import mysql from 'mysql2/promise';
// import { createPool } from 'mariadb'
// import jwt from 'jsonwebtoken';
// import MarkdownIt from 'markdown-it';
// import sanitizeHtml from 'sanitize-html';
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

const isProdOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

// const pool = mysql.createPool({
//   host: isProdOrStaging ? process.env.DB_HOST : 'switchback.proxy.rlwy.net',
//   user: isProdOrStaging ? process.env.DB_USER : 'root',
//   password: isProdOrStaging ? process.env.DB_PASSWORD : 'IxKdGZxqcyhIGFkwgBHdNGFarKPqYEvS',
//   database: isProdOrStaging ? process.env.DB_DATABASE : 'nebasjoa-blog',
//   port: isProdOrStaging ? process.env.DB_PORT : 10236
// });

// const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

// Test database connection not needed for now
// pool.getConnection()
//   .then(conn => {
//     const isProdLike = ['production', 'staging'].includes(process.env.NODE_ENV);
//     console.log(
//       new Date().toLocaleString('de-DE') +
//       (isProdLike ? ": Connected to Carvestigate production database." : ": Connected to MariaDB on TEST DB!")
//     );
//     conn.release();
//   })
//   .catch(err => {
//     console.error("Unable to connect to MariaDB:", err)
//   });

// const sanitize = (html) =>
//     sanitizeHtml(html, {
//         allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'pre', 'code']),
//         allowedAttributes: {
//             ...sanitizeHtml.defaults.allowedAttributes,
//             img: ['src', 'alt', 'title', 'loading', 'decoding']
//         }
//     });

// ---------- Health ----------
app.get('/healthz', (req, res) => res.json({ ok: true }));

const STRAPI_BASE_URL = (process.env.STRAPI_BASE_URL || '').replace(/\/+$/, '');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const STRAPI_COLLECTION = process.env.STRAPI_COLLECTION || 'posts';

const formatDisplayDate = (value) => {
  if (!value) return '';
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);

  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const unwrapEntity = (value) => (value?.attributes ? { id: value.id, ...value.attributes } : value);
const unwrapRelation = (value) => {
  if (!value) return null;
  if (Object.prototype.hasOwnProperty.call(value, 'data')) return value.data;
  return value;
};

const getRelationEntity = (value) => unwrapEntity(unwrapRelation(value));

const toAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (!STRAPI_BASE_URL) return value;
  return `${STRAPI_BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
};

const getMediaUrl = (value) => {
  const media = unwrapEntity(unwrapRelation(value));
  if (!media) return '';
  const preferred =
    media.formats?.medium?.url ||
    media.formats?.small?.url ||
    media.formats?.thumbnail?.url ||
    media.url;
  return toAbsoluteUrl(preferred);
};

const richTextBlocksToMarkdown = (nodes) => {
  if (!Array.isArray(nodes)) return '';

  const readNodeText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(readNodeText).join('');
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) return node.children.map(readNodeText).join('');
    return '';
  };

  return nodes
    .map((node) => {
      const text = readNodeText(node).trim();
      if (!text) return '';

      switch (node?.type) {
        case 'heading': {
          const level = Math.min(Math.max(Number(node.level) || 2, 1), 6);
          return `${'#'.repeat(level)} ${text}`;
        }
        case 'list':
          return Array.isArray(node.children)
            ? node.children
                .map((item) => {
                  const itemText = readNodeText(item).trim();
                  return itemText ? `- ${itemText}` : '';
                })
                .filter(Boolean)
                .join('\n')
            : text;
        case 'quote':
          return `> ${text}`;
        default:
          return text;
      }
    })
    .filter(Boolean)
    .join('\n\n');
};

const blockToMarkdown = (block) => {
  if (!block || typeof block !== 'object') return '';

  const componentName = block.__component || '';
  const richTextCandidate =
    block.body || block.content || block.text || block.richText || block.value || '';

  if (Array.isArray(richTextCandidate)) {
    return richTextBlocksToMarkdown(richTextCandidate);
  }

  if (typeof richTextCandidate === 'string' && richTextCandidate.trim()) {
    if (componentName.includes('quote')) return `> ${richTextCandidate.trim()}`;
    return richTextCandidate.trim();
  }

  if (componentName.includes('quote')) {
    const quoteText = [block.quote, block.caption, block.author].filter(Boolean).join(' — ');
    return quoteText ? `> ${quoteText}` : '';
  }

  if (componentName.includes('media')) {
    const url = getMediaUrl(block.file || block.image || block.media);
    const alt = block.alt || block.caption || 'Media';
    return url ? `![${alt}](${url})` : '';
  }

  if (componentName.includes('slider')) {
    const images = toArray(unwrapRelation(block.files || block.images || block.media))
      .map((item) => getMediaUrl(item))
      .filter(Boolean);
    return images.map((url) => `![](${url})`).join('\n\n');
  }

  return '';
};

const blocksToMarkdown = (blocks) =>
  toArray(blocks)
    .map(blockToMarkdown)
    .filter(Boolean)
    .join('\n\n');

const mapStrapiPost = (raw) => {
  const src = unwrapEntity(raw);
  if (!src) return null;

  const categoryEntity = getRelationEntity(src.category);
  const authorEntity = getRelationEntity(src.author);
  const categoryValue =
    typeof src.category === 'string'
      ? src.category
      : categoryEntity?.name || categoryEntity?.title || '';

  const coverUrl = getMediaUrl(src.cover);
  const blocksMarkdown = blocksToMarkdown(src.blocks);
  const contentValue = src.content ?? src.body ?? src.markdown ?? blocksMarkdown;
  const description = src.description || '';

  return {
    id: src.id ?? src.documentId ?? src.slug,
    title: src.title ?? src.name ?? 'Untitled post',
    slug: src.slug ?? src.documentId ?? '',
    date: formatDisplayDate(src.date ?? src.publishedAt ?? src.createdAt ?? ''),
    category: categoryValue || '',
    description,
    author: authorEntity?.name || authorEntity?.fullName || '',
    coverUrl,
    content: contentValue || description,
  };
};

async function fetchFromStrapi(searchParams) {
  if (!STRAPI_BASE_URL) {
    const err = new Error('STRAPI_BASE_URL is not configured');
    err.statusCode = 500;
    throw err;
  }

  const url = new URL(`/api/${STRAPI_COLLECTION}`, STRAPI_BASE_URL);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const headers = {};
  if (STRAPI_API_TOKEN) headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    const err = new Error(`Strapi request failed: ${response.status}`);
    err.statusCode = 502;
    err.details = body;
    throw err;
  }

  return response.json();
}

const isInvalidQueryKeyError = (error, key) =>
  typeof error?.details === 'string' &&
  error.details.includes('"ValidationError"') &&
  error.details.includes(`"key":"${key}"`);

async function fetchStrapiPostsWithFallback(baseParams = {}) {
  try {
    return await fetchFromStrapi({
      'populate[0]': 'cover',
      'populate[1]': 'author',
      'populate[2]': 'category',
      'populate[3]': 'blocks',
      ...baseParams,
    });
  } catch (error) {
    if (
      !isInvalidQueryKeyError(error, 'cover') &&
      !isInvalidQueryKeyError(error, 'author') &&
      !isInvalidQueryKeyError(error, 'category') &&
      !isInvalidQueryKeyError(error, 'blocks')
    ) {
      throw error;
    }
    return fetchFromStrapi(baseParams);
  }
}

app.get('/api/posts', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 100);
    const strapi = await fetchStrapiPostsWithFallback({
      'sort[0]': 'publishedAt:desc',
      'pagination[pageSize]': limit,
    });

    const posts = (strapi?.data || []).map(mapStrapiPost).filter(Boolean);
    res.json({ posts });
  } catch (error) {
    logger.error({ err: error, details: error?.details }, 'Failed to load posts from Strapi');
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to load posts' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    let strapi;
    try {
      strapi = await fetchStrapiPostsWithFallback({
        'filters[slug][$eq]': req.params.slug,
        'pagination[pageSize]': 1,
        'sort[0]': 'publishedAt:desc',
      });
    } catch (error) {
      // Some Strapi schemas use documentId and do not define a slug field.
      if (!isInvalidQueryKeyError(error, 'slug')) throw error;
      strapi = await fetchStrapiPostsWithFallback({
        'filters[documentId][$eq]': req.params.slug,
        'pagination[pageSize]': 1,
        'sort[0]': 'publishedAt:desc',
      });
    }

    const post = mapStrapiPost(strapi?.data?.[0]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (error) {
    logger.error({ err: error, details: error?.details }, 'Failed to load post from Strapi');
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to load post' });
  }
});

// ---------- Static (serve Vue dist) ----------
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^(?!\/api|\/healthz).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`nebasjoa-blog API listening on :${config.port} (${config.env})`);
});
