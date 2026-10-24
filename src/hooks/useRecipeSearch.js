import { useCallback, useState } from "react";
import { searchRecipes } from "../api/mealdb";

export const PAGE_SIZE = 12;

export default function useRecipeSearch() {
  const [results, setResults] = useState([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      setResults(await searchRecipes(params));
      setVisible(PAGE_SIZE);
      setHasSearched(true);
    } catch (e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results: results.slice(0, visible),
    total: results.length,
    loading,
    error,
    hasSearched,
    canLoadMore: visible < results.length,
    search,
    loadMore: () => setVisible((v) => v + PAGE_SIZE),
  };
}
