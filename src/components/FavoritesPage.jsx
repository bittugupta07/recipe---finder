import { useApp } from "../context/AppContext";
import RecipeGrid from "./RecipeGrid";
import { EmptyState } from "./Feedback";

export default function FavoritesPage() {
  const { favorites } = useApp();

  if (!favorites.length) {
    return (
      <EmptyState emoji="🤍" title="No favorites yet">
        Tap the heart on any recipe to save it here. Favorites are stored in your browser.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your favorites ({favorites.length})</h2>
      <RecipeGrid recipes={favorites} />
    </div>
  );
}
