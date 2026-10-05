
import { features, metrics } from "../data/productPanelData";

const ProductPanel = () => {
  return (
   <section className="relative mx-auto flex w-full max-w-140 flex-col">
      <div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          AI PRODUCT SEARCH PLATFORM
        </p>
        <h1 className="mt-5 max-w text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
          Search products by
          <br />
          <span className="text-primary"> meaning</span>, not keywords.
        </h1>
        <p className="mt-6 max-w text-base leading-7 text-muted">
          Deliver accurate product discovery using vector embeddings, hybrid
          ranking, Redis caching, and semantic understanding.
        </p>
        <div className="mt-10 flex flex-col gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-2 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-4xl bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="my-2 border-t border-border" />
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex flex-col">
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {metric.label}
                </p>
                <h3 className="text-sm font-light text-foreground">
                  {metric.value}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPanel;
