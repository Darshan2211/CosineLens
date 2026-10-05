import React, { useEffect, useState } from "react";

const FilterPanel = ({
  isOpen,
  onFilterCountChange,
  onFilterChange,
  brands = [],
}) => {
  const [activeBrand, setActiveBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filterCount = (activeBrand ? 1 : 0) + (minPrice || maxPrice ? 1 : 0);

  useEffect(() => {
    onFilterCountChange?.(filterCount);
  }, [filterCount, onFilterCountChange]);

  const handleBrand = (brand) => {
    const nextBrand = activeBrand === brand ? "" : brand;

    setActiveBrand(nextBrand);

    onFilterChange?.({
      brand: nextBrand,
      minPrice,
      maxPrice,
    });
  };

  const handleMinPrice = (e) => {
    const value = e.target.value;

    setMinPrice(value);

    onFilterChange?.({
      brand: activeBrand,
      minPrice: value,
      maxPrice,
    });
  };

  const handleMaxPrice = (e) => {
    const value = e.target.value;

    setMaxPrice(value);

    onFilterChange?.({
      brand: activeBrand,
      minPrice,
      maxPrice: value,
    });
  };

  const clearFilters = () => {
    setActiveBrand("");
    setMinPrice("");
    setMaxPrice("");

    onFilterChange?.({
      brand: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div
      className={`overflow-hidden tarnsition-[max-heigh,opacity] duration-220 ease-in-out ${isOpen ? "max-h-105 opacity-100 max-[640px]:max-h-160" : "max-h-0 opacity-0"}`}
    >
      <div className="my-4 mb-6.5 flex flex-col gap-2.5 border-y border-[#E7E8EC] bg-transparent px-0.5 py-3">
        {/* brand */}
        <div
          className="
            flex
            items-start
            gap-3
            max-[640px]:flex-col
            max-[640px]:gap-2
          "
        >
          <span
            className="
              min-w-16.5
              shrink-0
              pt-1.75
              font-mono
              text-[10.5px]
              uppercase
              tracking-[0.09em]
              text-[#9A9CA5]
              max-[640px]:pt-0
            "
          >
            Brand
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleBrand("")}
              className={`rounded-[20px] border px-2.75 py-1.25 font-mono text-[11.5px] transition-[border-color,color,background] duration-150
                  ${
                    activeBrand === ""
                      ? "border-[#AFC1F5] bg-[#E5EBFC] text-[#2954E3]"
                      : "border-[#E7E8EC] bg-white text-[#63666F] hover:border-[#2954E3] hover:text-[#2954E3]"
                  }
                `}
            >
              All
            </button>

            {brands.map((brand) => {
              const isActive = activeBrand === brand;

              const displayBrand =
                brand.charAt(0).toUpperCase() + brand.slice(1);

              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrand(brand)}
                  className={`
                    rounded-[20px]
                    border
                    px-2.75
                    py-1.25
                    font-mono
                    text-[11.5px]
                    transition-[border-color,color,background]
                    duration-150
                    ${
                      isActive
                        ? "border-[#AFC1F5] bg-[#E5EBFC] text-[#2954E3]"
                        : "border-[#E7E8EC] bg-white text-[#63666F] hover:border-[#2954E3] hover:text-[#2954E3]"
                    }
                  `}
                >
                  {displayBrand}
                </button>
              );
            })}
          </div>
        </div>
        {/* divider */}
        <div className="h-px bg-[#E7E8EC] opacity-55" />

        {/* price + clear */}
        <div className="flex flex-wrap items-center gap-3.5 max-[640px]:gap:2.5:">
          {/* price */}
          <div className="flex items-center gap-3">
            <span
              className="min-w-16.5 font-mono text-[10.5px] uppercase tracking-[0.09em]
                text-[#9A9CA5]"
            >
              Price
            </span>

            <div className="flex items-center gap-2">
              {/* minPrice */}
              <input
                type="number"
                id="minId"
                min="0"
                value={minPrice}
                onChange={handleMinPrice}
                placeholder="Min $"
                className="
                    w-21.5
                    rounded-lg
                    border
                    border-[#E7E8EC]
                  bg-white
                  px-2.5
                  py-1.75
                  font-mono
                  text-xs
                  text-[#0A0A0C]
                  outline-none
                  transition-colors
                  duration-150
                  focus:border-[#2954E3]
                    "
              />
              <span className="font-mono text-xs text-[#9A9CA5]">–</span>

              <input
                type="number"
                id="maxId"
                min="0"
                value={maxPrice}
                onChange={handleMaxPrice}
                placeholder="Max $"
                className="
                  w-21.5
                  rounded-lg
                  border
                  border-[#E7E8EC]
                  bg-white
                  px-2.5
                  py-1.75
                  font-mono
                  text-xs
                  text-[#0A0A0C]
                  outline-none
                  transition-colors
                  duration-150
                  focus:border-[#2954E3]
                "
              />
            </div>
          </div>
          

          {/* clear */}
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto inline-flex items-center gap-1.75 rounded-[20px] border border-[#E7E8EC]
              bg-white
              px-3.25
              py-1.75
              font-mono
              text-[11.5px]
              text-[#63666F]
              transition-[border-color,color]
              duration-150
              hover:border-[#2954E3]
              hover:text-[#2954E3]"
          >
            × Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
