import { useState } from "react";

const ProductThumb = () => {
  return (
    <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[9px] bg-[#E5EBFC]">
      <svg
        viewBox="0 0 20 20"
        className="h-4.75 w-4.75 fill-none stroke-[#2954E3]"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="14" height="12" rx="1.5" />
        <path d="M6 8h8M6 11h5" />
      </svg>
    </div>
  );
};

const SourceBadge = ({ source }) => {
  if (!source) return null;

  if (source === "both") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full border border-[#A3DFC9] bg-[#E6F9F3] px-1.75 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[#0A7A52]">
        vector + keyword
      </span>
    );
  }

  if (source === "vector") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full border border-[#AFC1F5] bg-[#E5EBFC] px-1.75 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[#2954E3]">
        vector only
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-[#F3D98B] bg-[#FEF9EC] px-1.75 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[#92620A]">
      keyword only
    </span>
  );
};

const CosineBadge = ({ score }) => {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-[#AFC1F5] bg-[#E5EBFC] px-2 py-0.75 font-mono text-[10px] font-semibold leading-none text-[#2954E3]">
      <span className="mr-1 opacity-60">cos</span>
      {score !== undefined && score !== null ? score.toFixed(2) : "—"}
    </span>
  );
};

const ProductItem = ({ product, type, index }) => {
  const [open, setOpen] = useState(false);

  const isVector = type === "vector";
  const isHybrid = type === "hybrid";

  const score =
    type === "keyword"
      ? product.textScore
      : type === "vector"
        ? product.vectorScore
        : product.hybridScore;

  const scoreText =
    score !== undefined && score !== null
      ? type === "hybrid"
        ? score.toFixed(6)
        : score.toFixed(3)
      : "—";

  /*
   * This bar is only a visual representation of the
   * returned score. It is NOT used for ranking.
   */
  const scoreBar =
    type === "hybrid"
      ? Math.min(score * 1000, 100)
      : type === "vector"
        ? Math.min(score * 100, 100)
        : Math.min(score * 10, 100);

  return (
    <div
      onClick={() => setOpen((value) => !value)}
      className={`mb-2 cursor-pointer rounded-[11px] border bg-white px-3.5 py-3 transition ${
       
          open
            ? "border-[#AFC1F5] bg-[#F8FAFF]"
            : "border-[#AFC1F5] bg-white"
      }`}
    >
      {/* PRODUCT HEADER */}

      <div className="flex items-start gap-2.5">
        <ProductThumb />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] leading-[1.35] text-[#0A0A0C]">
            {/* Hybrid ranking */}
            {isHybrid && (
              <span className="shrink-0 font-mono text-[11px] text-[#9A9CA5]">
                #{index + 1}
              </span>
            )}

            {/* Product name */}
            <span className="wrap-break-word">{product.name}</span>

            {/* Cosine badge */}
            {(isVector || isHybrid) && (
              <CosineBadge score={product.vectorScore} />
            )}

            {/* Right side */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              {/* Hybrid source */}
              {isHybrid && <SourceBadge source={product.source} />}

              {/* Price */}
              <span className="font-mono text-[11px] text-[#9A9CA5]">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY THIS RESULT */}

      <div className="ml-12 mt-2 text-[11px] text-[#9A9CA5]">
        {type === "keyword" && "Matched through keyword search"}

        {type === "vector" && "Matched through semantic similarity"}

        {type === "hybrid" &&
          (product.source === "both"
            ? "Matched by both keyword and vector search"
            : product.source === "vector"
              ? "Matched through vector search"
              : "Matched through keyword search")}
      </div>

      {/* SCORE */}

      <div className="ml-12 mt-2 flex items-center justify-between gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded bg-[#F6F6F9]">
          <div
            className="h-full rounded bg-[#2954E3] transition-all"
            style={{
              width: `${Math.max(0, Math.min(scoreBar, 100))}%`,
            }}
          />
        </div>

        <span className="shrink-0 font-mono text-[10px] text-[#9A9CA5]">
          {type === "hybrid" ? "RRF" : "score"} {scoreText}
        </span>
      </div>

      {/* EXPANDED DETAILS */}

      <div
        className={`ml-12 overflow-hidden font-mono text-[10.5px] text-[#63666F] transition-all ${
          open ? "mt-3 max-h-25" : "max-h-0"
        }`}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>category: {product.category}</span>

          {product.textScore !== undefined && (
            <span>keyword: {product.textScore.toFixed(3)}</span>
          )}

          {product.vectorScore !== undefined && (
            <span>semantic: {product.vectorScore.toFixed(3)}</span>
          )}

          {product.hybridScore !== undefined && (
            <span>RRF: {product.hybridScore.toFixed(6)}</span>
          )}

          <span>rating: {product.rating ?? "—"}</span>

          <span>stock: {product.stock ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

const ResultBlock = ({ title, badge, products = [], type, hybrid = false }) => {
  return (
    <div
      className={`min-h-65 rounded-xl border p-4 ${
        hybrid ? "border-[#AFC1F5] bg-[#E5EBFC]" : "border-[#E7E8EC] bg-[#F6F6F9]"
      }`}
    >
      {/* BLOCK HEADER */}

      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-[14px] font-bold text-[#0A0A0C]">{title}</h4>

          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              type === "keyword"
                ? "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280]"
                : type === "vector"
                  ? "border-[#AFC1F5] bg-[#E5EBFC] text-[#2954E3]"
                  : "border-[#A3DFC9] bg-[#E6F9F3] text-[#0A7A52]"
            }`}
          >
            {badge}
          </span>
        </div>

        <span
          className={`font-mono text-[11px] ${
            hybrid ? "text-[#2954E3]" : "text-[#9A9CA5]"
          }`}
        >
          {products.length}
        </span>
      </div>

      {/* PRODUCTS */}

      {products.length === 0 ? (
        <div className="py-10 text-center font-mono text-[10px] text-[#9A9CA5]">
          No matches with current filters
        </div>
      ) : (
        products.map((product, index) => (
          <ProductItem
            key={product._id}
            product={product}
            type={type}
            index={index}
            
          />
        ))
      )}
    </div>
  );
};

const SkeletonLine = ({ className = "" }) => {
  return <div className={`animate-plus rounded bg-[#E7E8EC] ${className}`} />;
};

const ProductSkeleton = () => {
  return (
    <div className="mb-2 rounded-[11px] border border-[#E7E8EC] bg-white px-3.5 py-3">
      <div className="flex items-start gap-2.5">
        {/* thumbnail */}
        <SkeletonLine className="h-9.5 w-9.5 shrink-0 rounded-[9px]" />

        {/* product information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="h-3 w-[65%]" />
            <SkeletonLine className="h-2.5 w-12 shrink-0" />
          </div>

          <SkeletonLine className="mt-2 h-2.5 w-[40%]" />
        </div>
      </div>

      {/* match explanation */}
      <div className="ml-12 mt-2">
        <SkeletonLine className="h-2.5 w-[55%]" />
      </div>

      {/* score */}
      <div className="ml-12 mt-2">
        <SkeletonLine className="h-1 w-full rounded" />
      </div>
    </div>
  );
};

const PanelSkeleton = ({ hybrid = false }) => {
  return (
    <div
      className={`min-h-65 rounded-xl border p-4 ${
        hybrid
          ? "border-[#AFC1F5] bg-[#E5EBFC]"
          : "border-[#E7E8EC] bg-[#F6F6F9]"
      }`}
    >
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonLine className="h-3.5 w-16" />
          <SkeletonLine className="h-4 w-20 rounded-full" />
        </div>

        <SkeletonLine className="h-2.5 w-5" />
      </div>

      {/* product skeletons */}
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
    </div>
  );
};

const ResultsSkeleton = () => {
  return (
    <section className="w-full pb-12">
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1fr_1fr_1.35fr]">
        <PanelSkeleton />

        <PanelSkeleton />

        <PanelSkeleton hybrid />
      </div>
    </section>
  );
};

const SearchResults = ({
  keywordResults = [],
  vectorResults = [],
  hybridResults = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return <ResultsSkeleton />;
  }

  return (
    <section className="mt-8 w-full pb-12">
      {/* RESULT PANELS */}

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1fr_1fr_1.35fr]">
        {/* Keyword */}
        <ResultBlock
          title="Keyword"
          badge="exact match"
          products={keywordResults}
          type="keyword"
        />

        {/* Vector */}
        <ResultBlock
          title="Vector"
          badge="semantic"
          products={vectorResults}
          type="vector"
        />

        {/* Hybrid */}
        <ResultBlock
          title="Hybrid (RRF)"
          badge="best of both"
          products={hybridResults}
          type="hybrid"
          hybrid
        />
      </div>

      {/* BOTTOM STATS */}

      <div className="mx-auto mt-3 flex max-w-190 border-t border-[#E7E8EC] text-center">
        <div className="flex-1 border-r border-[#E7E8EC] px-2 pt-4">
          <div className="font-mono text-[20px] font-semibold text-[#2954E3]">
            {hybridResults.length}
          </div>

          <div className="mt-1 font-mono text-[10px] text-[#9A9CA5]">
            PRODUCTS
          </div>
        </div>

        <div className="flex-1 border-r border-[#E7E8EC] px-2 pt-4">
          <div className="font-mono text-[20px] font-semibold text-[#2954E3]">
            1536
          </div>

          <div className="mt-1 font-mono text-[10px] text-[#9A9CA5]">
            EMBEDDING DIMS
          </div>
        </div>

        <div className="flex-1 border-r border-[#E7E8EC] px-2 pt-4">
          <div className="font-mono text-[20px] font-semibold text-[#2954E3]">
            ~300ms
          </div>

          <div className="mt-1 font-mono text-[10px] text-[#9A9CA5]">COLD</div>
        </div>

        <div className="flex-1 px-2 pt-4">
          <div className="font-mono text-[20px] font-semibold text-[#2954E3]">
            &lt;5ms
          </div>

          <div className="mt-1 font-mono text-[10px] text-[#9A9CA5]">
            CACHED
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
