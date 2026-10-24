import { useState } from "react";
import { useApp } from "./context/AppContext";
import SearchPage from "./components/SearchPage";
import FavoritesPage from "./components/FavoritesPage";
import MealPlanner from "./components/MealPlanner";
import RecipeModal from "./components/RecipeModal";

const TABS = [
  { id: "search", label: "🔍 Find recipes" },
  { id: "favorites", label: "❤️ Favorites" },
  { id: "plan", label: "📅 Meal plan" },
];

export default function App() {
  const [tab, setTab] = useState("search");
  const { favorites } = useApp();

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-brand-500 to-amber-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">🍳 Recipe Finder &amp; Meal Planner</h1>
          <p className="mt-1 text-brand-100">Search by ingredients, save favorites and plan your week.</p>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t.id
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {t.label}
              {t.id === "favorites" && favorites.length > 0 && (
                <span className="ml-1.5 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                  {favorites.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Keep SearchPage mounted so results survive switching tabs */}
        <div hidden={tab !== "search"}><SearchPage /></div>
        {tab === "favorites" && <FavoritesPage />}
        {tab === "plan" && <MealPlanner />}
      </main>

      <RecipeModal />
    </div>
  );
}
