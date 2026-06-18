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
