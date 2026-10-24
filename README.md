# CosineLens — Hybrid Semantic Search Engine

> Search by meaning, not just keywords.

## 🌐 Live Demo

**Frontend:** https://cosine-lens.vercel.app/

---

## What is CosineLens?

CosineLens is a production-grade semantic search engine that understands natural language queries beyond exact keyword matching. Type *"something lightweight for long flights"* and it finds relevant laptops — even without those exact words in any product description.

It combines two independent search methods — vector similarity and full-text keyword search — and merges them using Reciprocal Rank Fusion (RRF) to produce a single relevance-ranked result set.

---

## Demo

![Application Preview](./screenshots/cosine_lens_img)

---

## Architecture

> Add system design diagram here

---

## How the search pipeline works

```
User types query
      ↓
Query converted to 1536-dimensional vector via Gemini Embedding API
      ↓
Redis checked — embedding cached 24hr (cache hit → skip API call)
      ↓
Two searches run in parallel via Promise.allSettled()
  ├── $vectorSearch  →  finds products by semantic meaning (cosine similarity)
  └── $search        →  finds products by exact keyword match (fuzzy, Atlas full-text)
      ↓
RRF merge — rank positions from both lists summed per product
Products appearing in both lists naturally rank highest
      ↓
Results cached in Redis for 5 minutes
      ↓
Response returned — ~1500ms cold · ~200ms cached
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · Tailwind CSS · Vercel |
| Backend | Node.js · Express · REST API · Render |
| Database | MongoDB Atlas |
| Search indexes | Atlas Vector Search · Atlas Full-Text Search · Atlas Autocomplete |
| Embeddings | Gemini Embedding API (1536 dims) |
| Cache | Upstash Redis (serverless) |
| Auth | JWT · HTTP-only cookies |

---

## Key Technical Decisions

**Why hybrid search over vector-only?**
Vector search understands meaning but misses exact product name matches. Keyword search catches exact matches but fails on natural language. Hybrid uses both — neither alone is sufficient.

**Why RRF over weighted averaging?**
Vector scores (0–1 cosine similarity) and keyword scores (unbounded Atlas relevance) exist on incompatible scales. Adding them directly is mathematically meaningless. RRF converts both to rank positions first — no scale mismatch, no manual weight tuning required.

**Why two-layer Redis caching with different TTLs?**
Query embeddings never change — *"gaming laptop"* always maps to the same vector. So embedding cache TTL is 24 hours. Search results might change as products update, so result cache TTL is 5 minutes. Different data, different volatility, different TTLs.

**Why service layer architecture?**
`search.service` → `embedding.service` → `hybridSearch.service` → `cache.service` — each with one responsibility. When Redis breaks only `cache.service` changes. When the embedding model changes only `embedding.service` changes. Nothing else is touched.

---

## Caching Strategy

```
emb:{md5(query)}              TTL: 24 hours   query embedding
search:{q}:{filters}:{page}   TTL: 5 minutes  full search result
auto:{prefix}                 TTL: 1 hour     autocomplete suggestions
```

**Result:** 86% reduction in response time — ~1500ms cold → ~200ms on cache hit.

---

## Search Indexes

| Index | Type | Purpose |
|---|---|---|
| `product_vector_index` | Atlas Vector Search | Cosine similarity on 1536-dim embeddings |
| `product_search_index` | Atlas Full-Text Search | Fuzzy keyword matching on name, description, brand, tags |
| `product_autocomplete_index` | Atlas Autocomplete | Prefix-based typeahead on name, brand, category |

---

## Service Layer Architecture

CosineLens backend is structured around a strict service layer pattern. Every service has exactly one responsibility and one reason to change. No service calls upward — dependencies only flow downward.

### Dependency graph

```
search.route.js
      │
      ▼
search.controller.js        ← HTTP only: reads req, calls service, sends res
      │
      ▼
search.service.js           ← orchestrator: coordinates the full pipeline
      │
      ├──────────────────────────────────┐
      ▼                                  ▼
embedding.service.js            hybridSearch.service.js
      │                                  │
      ▼                          ┌───────┴───────┐
cache.service.js                 ▼               ▼
      │                   vectorSearch     keywordSearch
      ▼                  (Product static) (Product static)
Upstash Redis
```

### Why each service has one reason to change

**`cache.service.js`**
Owns all Redis logic — `getCache`, `setCache`, `deleteCache`. If Upstash changes their client API or you switch to `ioredis` — only this file changes. Nothing else in the codebase knows Redis exists.

```
Reason to change: Redis client or caching library changes
Called by: search.service · embedding.service
Calls: Upstash Redis directly
```

**`embedding.service.js`**
Owns query embedding — checks Redis first, calls Gemini on miss, saves with 24hr TTL. If you switch from Gemini to OpenAI — only this file changes. The cache layer it uses stays identical.

```
Reason to change: embedding model or provider changes
Called by: search.service
Calls: cache.service · Gemini Embedding API
```

**`hybridSearch.service.js`**
Owns the RRF merge algorithm — runs `vectorSearch` and `keywordSearch` in parallel via `Promise.allSettled()`, applies RRF, returns ranked products. If the ranking algorithm changes — only this file changes.

```
Reason to change: ranking algorithm or merge strategy changes
Called by: search.service
Calls: Product.vectorSearch() · Product.keywordSearch()
```

**`search.service.js`**
Orchestrates the full pipeline — checks search result cache, calls embedding service, calls hybrid search, caches result. It coordinates but owns nothing itself. If the pipeline order changes — only this file changes.

```
Reason to change: pipeline order or response shape changes
Called by: search.controller
Calls: cache.service · embedding.service · hybridSearch.service
```

**`search.controller.js`**
Owns HTTP — reads `req.query`, validates input, calls `search.service`, sends `res.json()`. Zero business logic. If Express is replaced with Fastify — only this file changes.

```
Reason to change: HTTP framework or request/response shape changes
Called by: Express router
Calls: search.service only
```

### No circular dependencies — enforced by direction

```
✓ search.service     → cache.service       (downward)
✓ embedding.service  → cache.service       (downward)
✓ hybridSearch       → Product model       (downward)

✗ cache.service      → search.service      (never — circular)
✗ embedding.service  → search.service      (never — circular)
✗ Product model      → any service         (never — circular)
```

`cache.service` is the only service called by multiple others — and it has zero dependencies of its own. It only talks to Redis. This makes it the stable base of the entire dependency tree.

### What this means in practice

When Redis goes down — one file to debug: `cache.service.js`

When embedding model changes — one file to update: `embedding.service.js`

When RRF algorithm needs tuning — one file to change: `hybridSearch.service.js`

When a new filter is added — one file to update: `search.controller.js` + `buildMatchFilter` + `buildVectorFilter`

No change in any single service propagates unexpectedly to another.

### Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Upstash Redis client
│   ├── controllers/
│   │   └── search.controller.js   # HTTP layer only
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + authorize
│   │   ├── errorHandler.js    # global error handler
│   │   └── rateLimiter.js     # express-rate-limit per route
│   ├── models/
│   │   └── product.model.js   # schema + vectorSearch + keywordSearch + autocomplete statics
│   ├── routes/
│   │   ├── search.route.js
│   │   └── product.route.js
│   └── services/
│       ├── search.service.js        # pipeline orchestrator
│       ├── embedding.service.js     # Gemini API + embedding cache
│       ├── hybridSearch.service.js  # RRF merge
│       ├── cache.service.js         # Redis get/set/delete
│       └── autocomplete.service.js  # suggestion + cache
│
client/
└── src/
    ├── components/
    │   ├── SearchResults.jsx   # 3-panel keyword/vector/hybrid
    │   ├── FilterPanel.jsx     # derived filters from results
    │   └── SearchPipeline.jsx  # pipeline animation card
    ├── hooks/
    │   ├── useSearch.js        # query + API call + raw results
    │   ├── useSearchFilters.js # client-side filtering + availableFilters
    │   └── usePipeline.js      # stage animation + cache timings
    └── services/
        └── searchApi.js        # axios wrapper for search endpoint
```

---

## Local Setup

**Prerequisites:** Node.js 18+, MongoDB Atlas account, Upstash Redis account, Gemini API key

```bash
# Clone
git clone https://github.com/<your-username>/cosinelens.git
cd cosinelens
```

**Backend**
```bash
cd server
npm install
cp .env.example .env
# Fill in your env vars
npm run dev
```

**Frontend**
```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

**Generate embeddings** (after importing products to MongoDB)
```bash
cd server
node src/scripts/generateEmbeddings.js
```

---

## Environment Variables

```bash
# server/.env
MONGO_URI=your_mongo_connection_string
GEMINI_API_KEY=your_gemini_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=3000

# client/.env
VITE_API_URL=http://localhost:3000
```

---

## MongoDB Atlas Setup

After running `generateEmbeddings.js`, create three indexes in Atlas UI:

**1. Vector index** — Search → Create Index → JSON Editor

```json
{
  "fields": [{
    "type": "vector",
    "path": "embedding",
    "numDimensions": 1536,
    "similarity": "cosine"
  }]
}
```
Name: `product_vector_index`

**2. Full-text index** — Search → Create Index → JSON Editor

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name":        { "type": "string", "analyzer": "lucene.standard" },
      "description": { "type": "string", "analyzer": "lucene.standard" },
      "brand":       { "type": "string", "analyzer": "lucene.standard" },
      "tags":        { "type": "string", "analyzer": "lucene.standard" },
      "isActive":    { "type": "boolean" },
      "price":       { "type": "number" },
      "stock":       { "type": "number" }
    }
  }
}
```
Name: `product_search_index`

**3. Autocomplete index** — Search → Create Index → JSON Editor

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name":     [{ "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15 }],
      "brand":    [{ "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15 }],
      "category": [{ "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15 }],
      "isActive": { "type": "boolean" }
    }
  }
}
```
Name: `product_autocomplete_index`

---

## License

MIT
