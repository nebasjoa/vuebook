# vuebook

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Strapi (Railway) Integration

This project can now load blog posts from a Strapi API through the local `Express` server proxy (`/api/posts`), so your Strapi token stays on the server.

### 1. Add environment variables

Add these to your `.env` (and Railway service envs for this app if deployed):

```env
STRAPI_BASE_URL=https://your-strapi-app.up.railway.app
STRAPI_API_TOKEN=your_strapi_api_token
STRAPI_COLLECTION=posts
```

Notes:
- `STRAPI_COLLECTION` should match your Strapi collection type API ID (default is `posts`).
- `STRAPI_API_TOKEN` can be omitted only if your Strapi `Public` role is allowed to read posts.

### 2. Expected Strapi fields (collection: `posts`)

The app maps Strapi entries into the current UI shape. Recommended fields in Strapi:

- `title` (Text)
- `slug` (UID or Text)
- `content` (Rich text / Markdown-capable text)
- `date` (Date) optional, otherwise `publishedAt` is used
- `category` (Text) or `categories` relation (optional)

### 3. Run with the proxy enabled

The Vue dev server (`npm run dev`) does not start the Express proxy. To test the full integration locally, use:

```sh
npm start
```

That builds the frontend and starts `server.js`, which serves the app and proxies requests to Strapi.
