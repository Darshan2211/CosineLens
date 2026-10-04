import React from "react";

const SearchBox = ({ query, onQueryChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  const handleClear = () => {
    onQueryChange?.("");
  };

  return (
    <div className="relative text-left">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-[#0A0A0C] px-4.5 py-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[#2954E3] focus-within:shadow-[0_0_0_3px_#E5EBFC]">
          <input
            type="text"
            id="searchId"
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="try: comfortable shoes for long office hours"
            autoComplete="off"
            className="min-w-0 flex-1 border-none bg-transparent text-base text-[#0A0A0C] outline-none placeholder:text-[#9A9CA5]"
          />

          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-[#9A9CA5]">
            ⏎ live
          </span>

          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[#F6F6F9] p-0 text-[15px] leading-none text-[#63666F] transition-colors duration-180 hover:bg-[#0a0a0c] hover:text-[#E5EBFC]"
          >
            ×
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;