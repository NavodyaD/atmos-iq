import { NewsArticle } from "@/types/news";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export function NewsCard({ article }: { article: NewsArticle }) {
  // Filter out removed articles from NewsAPI
  if (article.title === "[Removed]") return null;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        {article.urlToImage ? (
          // Using regular img tag to avoid Next.js external domain configuration issues for dynamic news sources
          <img
            src={article.urlToImage}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
          {article.source.name}
        </div>
      </div>
      
      <CardHeader className="flex-1 pb-2">
        <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-2 text-sm text-foreground/80">
          {article.description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="border-t bg-muted/20 px-6 py-4 flex items-center justify-between mt-auto">
        <div className="text-xs text-muted-foreground font-medium">
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Read full <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
