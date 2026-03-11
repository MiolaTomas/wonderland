export type Genre =
  | "mystery"
  | "adventure"
  | "romance"
  | "fantasy"
  | "drama"
  | "sci-fi"
  | "horror"
  | "comedy"
  | "thriller"
  | "historical";

export const genres: Genre[] = [
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
  "historical",
];

export type GenreStyle = {
  color: string;
  badge: string;
  accent: string;
};

export const genreColors: Record<Genre, GenreStyle> = {
  mystery: {
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-500",
    accent: "bg-violet-200",
  },
  adventure: {
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-600",
    accent: "bg-amber-200",
  },
  romance: {
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-500",
    accent: "bg-rose-200",
  },
  fantasy: {
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-500",
    accent: "bg-teal-200",
  },
  drama: {
    color: "bg-stone-50 border-stone-200",
    badge: "bg-stone-100 text-stone-500",
    accent: "bg-stone-200",
  },
  "sci-fi": {
    color: "bg-cyan-50 border-cyan-200",
    badge: "bg-cyan-100 text-cyan-600",
    accent: "bg-cyan-200",
  },
  horror: {
    color: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-500",
    accent: "bg-slate-200",
  },
  comedy: {
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-600",
    accent: "bg-yellow-200",
  },
  thriller: {
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-500",
    accent: "bg-orange-200",
  },
  historical: {
    color: "bg-lime-50 border-lime-200",
    badge: "bg-lime-100 text-lime-600",
    accent: "bg-lime-200",
  },
};

const fallbackColors = {
  color: "bg-gray-50 border-gray-200",
  badge: "bg-gray-100 text-gray-500",
  accent: "bg-gray-200",
};

export function getGenreColors(genre: string) {
  return genreColors[genre.toLowerCase()] ?? fallbackColors;
}
