import { NewsApiResponse } from "@/types/news";
import { NewsCard } from "./NewsCard";

export function NewsList({ data }: { data: NewsApiResponse }) {
  if (!data.articles || data.articles.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10">
        <p className="text-muted-foreground">No news articles found at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {data.articles.map((article, i) => (
        <NewsCard key={`${article.url}-${i}`} article={article} />
      ))}
    </div>
  );
}
