import { useEffect, useState } from "react";
import { search } from "../services/searchApi.js";
import { useToast } from "../../../context/ToastContext.jsx";

const DEMO_QUERY =
  "a powerful workstation for AI experiments and GPU-heavy tasks";
const INITIAL_STAGES = {
  "understand-query": {
    status: "idle",
    detail: "—",
  },

  "check-cache": {
    status: "idle",
    detail: "—",
  },

  "generate-embedding": {
    status: "idle",
    detail: "—",
  },

  "rank-results": {
    status: "idle",
    detail: "—",
  },

  "merge-results": {
    status: "idle",
    detail: "—",
  },

  "return-results": {
    status: "idle",
    detail: "—",
  },
};

const useSearchPipeline = () => {
  const { showToast } = useToast();


  const [query, setQuery] = useState("");

  const [status, setStatus] = useState("ready");

  const [stages, setStages] = useState(INITIAL_STAGES);

  const [totalTime, setTotalTime] = useState(null);

  const [isDemo, setIsDemo] = useState(true);

  const [brands, setBrands] = useState([]);

  const [keywordResults, setKeywordResults] = useState([]);
  const [vectorResults, setVectorResults] = useState([]);
  const [hybridResults, setHybridResults] = useState([]);

  const [coldTime, setColdTime] = useState(null);
  const [cacheHitTime, setCacheHitTime] = useState(null);

  // update pipeline stage

  const updateStage = (stageId, stageStatus, detail) => {
    setStages((currentStages) => ({
      ...currentStages,

      [stageId]: {
        status: stageStatus,
        detail,
      },
    }));
  };

  // reset pipeline

  const resetPipeline = () => {
    setStatus("ready");
    setStages(INITIAL_STAGES);
    setTotalTime(null);
  };

  // helper

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  // query change

  const handleUserQueryChange = (value) => {
    setIsDemo(false);
    setQuery(value);
    resetPipeline();
    setBrands([]);
    setKeywordResults([]);
    setVectorResults([]);
    setHybridResults([]);
  };

  // demo Pipeline

  useEffect(() => {
    let typingInterval;

    const timers = [];

    let characterIndex = 0;

    const startPipeline = () => {
      setStatus("active");

      // Stage 1
      updateStage("understand-query", "active", "6 tokens");

      // Stage 2
      timers.push(
        setTimeout(() => {
          updateStage("understand-query", "complete", "6 tokens");

          updateStage("check-cache", "active", "checking...");
        }, 200),
      );

      // Stage 3
      timers.push(
        setTimeout(() => {
          updateStage("check-cache", "complete", "miss");

          updateStage("generate-embedding", "active", "1536 dims");
        }, 400),
      );

      // Stage 4
      timers.push(
        setTimeout(() => {
          updateStage("generate-embedding", "complete", "1536 dims");

          updateStage("rank-results", "active", "vector + keyword");
        }, 700),
      );

      // Stage 5
      timers.push(
        setTimeout(() => {
          updateStage("rank-results", "complete", "vector + keyword");

          updateStage("merge-results", "active", "RRF merge");
        }, 900),
      );

      // Stage 6
      timers.push(
        setTimeout(() => {
          updateStage("merge-results", "complete", "RRF merge");

          updateStage("return-results", "active", "sending...");
        }, 1100),
      );

      // Complete demo
      timers.push(
        setTimeout(() => {
          updateStage("return-results", "complete", "3 results");

          setStatus("complete");

          setTotalTime("312ms");
        }, 1400),
      );
    };

    // Start typewriter
    const startTypingTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        characterIndex += 1;

        setQuery(DEMO_QUERY.slice(0, characterIndex));

        if (characterIndex >= DEMO_QUERY.length) {
          clearInterval(typingInterval);

          startPipeline();
        }
      }, 35);
    }, 200);

    // Cleanup demo timers
    return () => {
      clearTimeout(startTypingTimeout);

      clearInterval(typingInterval);

      timers.forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // Search

  const startSearch = async (filters = {}) => {
    if (!query.trim()) return;

    resetPipeline();

    setStatus("active");

    try {
      const response = await search({
        query,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStock: filters.inStock,
        limit: filters.limit,
      });

      const availableBrands = [
        ...new Set(
          response.products.map((product) => product.brand).filter(Boolean),
        ),
      ];

      console.log("SEARCH RESPONSE:", response);

      setBrands(availableBrands);

      // understand query
      const tokenCount = query.trim().split(/\s+/).length;

      updateStage("understand-query", "complete", `${tokenCount} tokens`);

      await wait(300);

      // check cache

      updateStage("check-cache", "complete", response.cached ? "hit" : "miss");

      await wait(250);

      // cache hit

      if (response.cached) {
        updateStage("generate-embedding", "skipped", "cache hit");

        updateStage("rank-results", "skipped", "cache hit");

        updateStage("merge-results", "skipped", "cache hit");

        await wait(200);
      }

      //cache miss
      else {
        updateStage(
          "generate-embedding",
          "complete",
          response.embeddedCached
            ? "cache hit · 1536 dims"
            : "generated · 1536 dims",
        );

        await wait(300);

        updateStage("rank-results", "complete", "vector + keyword");

        await wait(300);

        updateStage("merge-results", "complete", "RRF merge");

        await wait(250);
      }
      // display results

      updateStage("return-results", "complete", `${response.total} results`);

      // Real backend total time
      setTotalTime(`${response.responseTimeMs}ms`);

      setStatus("complete");

      setKeywordResults(response.keywordResults || []);
      setVectorResults(response.vectorResults || []);
      setHybridResults(response.products || []);

      // how it works times

      const responseTime = response.responseTimeMs;

      setTotalTime(`${responseTime}ms`);

      if (response.cached) {
        setCacheHitTime(responseTime);
      } else {
        setColdTime(responseTime);
      }

      showToast({
        type: "SUCCESS",
        title: "Search Complete",
        message: `Found ${response.total} products matching your query`,
      });
      return response;

    } catch (error) {
      console.error("Search failed:", error);

      setStatus("error");
      showToast({
        type: "Error",
        title: "No Products Found",
        message:
        error.response?.data?.message || 
        "Internal Server Error"
      })
    }
  };

  return {
    query,
    status,
    stages,
    totalTime,
    isDemo,
    coldTime,
    cacheHitTime,
    handleUserQueryChange,
    startSearch,
    brands,
    keywordResults,
    vectorResults,
    hybridResults,
  };
};

export default useSearchPipeline;
