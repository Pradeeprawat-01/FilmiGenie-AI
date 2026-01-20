export interface Movie {
  title: string;
  year: number;
  genre: string;
  description: string;
}

export interface RecommendationResponse {
  id: number;
  movies: Movie[];
}
export interface PreviousRecommendationResponse {
  id: number;
  user_input: string;
  recommended_movies: Movie[];
}
