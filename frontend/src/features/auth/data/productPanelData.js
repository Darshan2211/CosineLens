import {Search, Layers3, Zap} from 'lucide-react'

export const features = [
  {
    id: 1,
    icon: Search,
    title: "Semantic Search",
    description: "Find products using intent instead of exact keywords.",
  },
  {
    id: 2,
    icon: Layers3,
    title: "Hybrid Ranking",
    description: "Combines vector similarity relevance for better results",
  },
  {
    id: 3,
    icon: Zap,
    title: "Real-Time Performance",
    description: "Redis caching and optimized search pipelines keep responses fast.",
  },
];

export const metrics = [
  {
    id: 1,
    value: "250+",
    label: "Products Indexed",
  },
  {
    id: 2,
    value: "148 ms",
    label: "Average Search",
  },
  {
    id: 3,
    value: "82%",
    label: "Cache Hit Rate",
  },
  {
    id: 4,
    value: "Ready",
    label: "Vector Index",
  },
];



