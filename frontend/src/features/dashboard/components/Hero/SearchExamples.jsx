const SearchExamples = ({ onExampleClick }) => {
  const examples = [
    "a powerful workstation for AI experiments, rendering, and other GPU-heavy tasks",

    "phone for night photography" ,
    "breathable shoes with arch support",
  ];

  return (
    <div
      className="
        mt-3
        flex
        flex-wrap
        items-center
        gap-2
        font-mono
        text-[11.5px]
        text-[#9A9CA5]
      "
    >
      <span>try:</span>

      {examples.map((example) => (
        <button
          key={example}
          onClick={() => onExampleClick?.(example)}
          type="button"
          className="
            cursor-pointer
            rounded-[20px]
            border
            border-[#E7E8EC]
            bg-white
            px-2.75
            py-1.25
            font-mono
            text-[11.5px]
            text-[#3b3e46]
            transition-[border-color,color]
            duration-150
            hover:border-[#2954E3]
            hover:text-[#2954E3]
          "
        >
          {example}
        </button>
      ))}
    </div>
  );
};

export default SearchExamples;
