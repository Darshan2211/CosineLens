import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import SearchExamples from "./SearchExamples";
import FilterPanel from "./FilterPanel";
import SearchPipeline from "./SearchPipeline";
import SearchResults from "./SearchResults";

const Hero = ({ searchPipeline }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterCount, setFilterCount] = useState(0);

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleQueryChange = (value) => {
    setFilters({
      brand: "",
      minPrice: "",
      maxPrice: "",
    });

    setFilterCount(0);

    handleUserQueryChange(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (products, filters) => {
    return products.filter((product) => {
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      if (filters.minPrice && product.price < Number(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  };

  const {
    query,
    status,
    stages,
    totalTime,
    brands,
    handleUserQueryChange,
    startSearch,
    keywordResults,
    vectorResults,
    hybridResults,
  } = searchPipeline;

  const filteredKeywordResults = applyFilters(keywordResults, filters);

  const filteredVectorResults = applyFilters(vectorResults, filters);

  const filteredHybridResults = applyFilters(hybridResults, filters);

  const isFilterEnabled = status === "complete";

  useEffect(() => {
    if (status !== "complete") {
      setIsFilterOpen(false);
    }
  }, [status]);

  return (
    <header id="features" className="scroll-mt-22.5 pt-16">
      {/* container */}
      <div className="mx-auto w-full max-w-280 px-5">
        {/*  upper  */}
        <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-14 pb-11 max-[900px]:grid-cols-1">
          {/* left */}
          <div className="text-left">
            {/* heading */}
            <h1 className="m-0 mb-4 max-w-162.5 font-display text-[clamp(32px,4.6vw,50px)] font-bold leading-[1.06] tracking-[-0.02em]">
              Search that
              <br /> understands what you <br />
              <span className="text-[#2954E3]">meant</span>.
            </h1>

            {/* descritpion */}
            <p className="m-0 mb-8 max-w-120 text-base leading-normal text-[#494b52]">
              CosineLens — type a real query. It runs against 10 indexed
              products three ways at once — keyword, vector, and the hybrid
              merge — live, in your browser.
            </p>

            {/* search */}
            <div id="live-demo" className="scroll-mt-80">
              <SearchBox
                query={query}
                onQueryChange={handleQueryChange}
                onSearch={() => startSearch(filters)}
              />

              <SearchExamples onExampleClick={handleQueryChange} />
            </div>

            {/* filter bar */}
            <div className="mt-4 flex items-center justify-between">
              {/* left */}
              <div className="flex items-center gap-3">
                {/* filter */}
                <button
                  type="button"
                  disabled={!isFilterEnabled}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  aria-expanded={isFilterOpen}
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3.5
                    py-1.75
                    font-mono
                    text-[10.5px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    transition-[border-color,color,background]
                    duration-180
                    ${
                      !isFilterEnabled
                        ? "cursor-not-allowed border-[#E7E8EC] bg-[#F6F6F9] text-[#C2C3C8]"
                        : isFilterOpen || filterCount > 0
                          ? "border-[#AFC1F5] bg-[#E5EBFC] text-[#2954E3]"
                          : "border-[#E7E8EC] bg-white text-[#63666F] hover:border-[#2954E3] hover:bg-[#F6F6F9] hover:text-[#2954E3]"
                    }
                  `}
                >
                  {/* FILTER ICON */}
                  <span className="text-[11px] leading-none">⇵</span>

                  <span>Filters</span>

                  {/* FILTER COUNT */}
                  {filterCount > 0 && (
                    <span
                      className="
                        flex
                        h-4
                        min-w-4
                        items-center
                        justify-center
                        rounded-full
                        bg-[#2954E3]
                        px-1.5
                        py-1.5
                        text-[9px]
                        font-medium
                        text-white
                      "
                    >
                      {filterCount}
                    </span>
                  )}
                </button>

                {/* FILTER SUMMARY */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.08em]
                    text-[#000000]
                  "
                >
                  <span>Brand</span>

                  <span className="font-bold text-[#1c1e27]">·</span>

                  <span>Price</span>
                </div>
              </div>

              
            </div>

            {/* filter panel */}
            <FilterPanel
              isOpen={isFilterOpen}
              onFilterCountChange={setFilterCount}
              onFilterChange={handleFilterChange}
              brands={brands}
              
            />
          </div>

          {/* pipeline */}
          <div>
            <SearchPipeline
              status={status}
              stages={stages}
              totalTime={totalTime}
            />
          </div>
        </div>

        {/* {results} */}
        <SearchResults
          keywordResults={filteredKeywordResults}
          vectorResults={filteredVectorResults}
          hybridResults={filteredHybridResults}
          isLoading={status === "active"}
        />
      </div>
    </header>
  );
};

export default Hero;
