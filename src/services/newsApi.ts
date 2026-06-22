import { NewsApiResponse } from "@/types/news";

const NEWS_API_KEY = "NEWS_API_KEY";
const NEWS_API_URL = "NEWS_API_URL";

export async function getWeatherNews(): Promise<NewsApiResponse | null> {
  const query = "weather OR climate OR environment OR storms";
  
  try {
    const res = await fetch(
      `${NEWS_API_URL}?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      console.error("Failed to fetch news:", await res.text());
      // Return mock data for development if the API key is invalid or not set
      return getMockNews();
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return getMockNews();
  }
}

// Fallback mock data
function getMockNews(): NewsApiResponse {
  return {
    status: "ok",
    totalResults: 3,
    articles: [
      {
        source: { id: "1", name: "Climate Daily" },
        author: "Jane Doe",
        title: "Record Breaking Heatwaves Expected This Summer Across Europe",
        description: "Meteorologists are predicting unprecedented temperature spikes in the upcoming months, urging citizens to prepare for extreme heat.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=1000&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        content: "Full content here...",
      },
      {
        source: { id: "2", name: "Weather Network" },
        author: "John Smith",
        title: "New Satellite Tech Improves Hurricane Tracking Accuracy by 40%",
        description: "The latest launch of weather satellites brings a massive leap in our ability to predict severe storm paths and save lives.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1000&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        content: "Full content here...",
      },
      {
        source: { id: "3", name: "Eco News" },
        author: "Alice Johnson",
        title: "Ocean Temperatures Reach Highest Recorded Levels",
        description: "Scientists warn that rising ocean temperatures are accelerating coral bleaching and altering marine ecosystems fundamentally.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=1000&auto=format&fit=crop",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        content: "Full content here...",
      }
    ]
  };
}
