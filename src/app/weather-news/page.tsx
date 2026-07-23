import { getWeatherNews } from "@/services/newsApi";
import { NewsList } from "@/features/news/components/NewsList";
import { Newspaper } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function WeatherNewsPage() {
  const newsData = await getWeatherNews();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Newspaper className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather News</h1>
          <p className="text-muted-foreground">
            Latest updates on climate, environment, and global weather patterns.
          </p>
        </div>
      </div>
      
      {newsData ? (
        <NewsList data={newsData} />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10">
          <p className="text-muted-foreground">Failed to load news articles.</p>
        </div>
      )}
    </div>
  );
}
