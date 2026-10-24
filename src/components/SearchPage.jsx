import useRecipeSearch from "../hooks/useRecipeSearch";
import SearchBar from "./SearchBar";
import RecipeGrid from "./RecipeGrid";
import { EmptyState, ErrorMessage, Spinner } from "./Feedback";

export default function SearchPage() {
  const { results, total, loading, error, hasSearched, canLoadMore, search, loadMore } = useRecipeSearch();

  return (
    <div className="space-y-6">
      <SearchBar onSearch={search} loading={loading} />
      <ErrorMessage message={error} />

      {!hasSearched && !loading && !error && (
        <EmptyState emoji="🥘" title="What's in your kitchen?">
          Enter ingredients you have (comma separated, in English) or a dish name, then pick any filters.
        </EmptyState>
      )}

      {hasSearched && !error && (
        <p className="text-sm text-stone-500">
          {total ? `${total} recipes found` : ""}
        </p>
      )}

      {hasSearched && !loading && !error && results.length === 0 && (
        <EmptyState emoji="🔎" title="No recipes found">
          Try fewer ingredients or loosen the filters.
        </EmptyState>
      )}

      {results.length > 0 && <RecipeGrid recipes={results} />}
      {loading && <Spinner label="Finding recipes…" />}

      {canLoadMore && !loading && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="rounded-xl border border-stone-300 bg-white px-6 py-2.5 font-medium hover:bg-stone-100"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
