import { useEffect, useState } from "react";
import { getRecipe } from "../api/mealdb";
import { DAYS, MEALS, useApp } from "../context/AppContext";
import { ErrorMessage, Spinner } from "./Feedback";

function AddToPlan({ recipe }) {
  const { addToPlan } = useApp();
  const [day, setDay] = useState(DAYS[0]);
  const [meal, setMeal] = useState(MEALS[2]);
  const [added, setAdded] = useState(false);

  const add = () => {
    addToPlan(recipe, day, meal);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const sel = "rounded-lg border border-stone-300 bg-white px-2 py-2 text-sm";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200">
      <span className="text-sm font-medium">📅 Add to meal plan:</span>
      <select value={day} onChange={(e) => setDay(e.target.value)} className={sel} aria-label="Day">
        {DAYS.map((d) => <option key={d}>{d}</option>)}
      </select>
      <select value={meal} onChange={(e) => setMeal(e.target.value)} className={sel} aria-label="Meal">
        {MEALS.map((m) => <option key={m}>{m}</option>)}
      </select>
      <button onClick={add} className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700">
        {added ? "✓ Added" : "Add"}
      </button>
    </div>
  );
}

export default function RecipeModal() {
  const { openRecipeId, closeRecipe, isFavorite, toggleFavorite } = useApp();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!openRecipeId) return;
    let cancelled = false;
    setRecipe(null);
    setError("");
    setLoading(true);
    getRecipe(openRecipeId)
      .then((data) => !cancelled && setRecipe(data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [openRecipeId]);

  useEffect(() => {
    if (!openRecipeId) return;
    const onKey = (e) => e.key === "Escape" && closeRecipe();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openRecipeId, closeRecipe]);

  if (!openRecipeId) return null;

  const fav = recipe && isFavorite(recipe.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center"
      onClick={closeRecipe}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <button
          onClick={closeRecipe}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow hover:bg-white"
        >
          ✕
        </button>

        {loading && <Spinner label="Loading recipe…" />}
        {error && <div className="p-6"><ErrorMessage message={error} /></div>}

        {recipe && (
          <>
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="h-64 w-full object-cover" />
            )}
            <div className="space-y-6 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{recipe.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-stone-600">
                    {recipe.category && (
                      <span className="rounded-full bg-stone-100 px-3 py-1">🍽 {recipe.category}</span>
                    )}
                    {recipe.area && (
                      <span className="rounded-full bg-stone-100 px-3 py-1">🌍 {recipe.area}</span>
                    )}
                    {recipe.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-green-100 px-3 py-1 text-green-700">{t}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(recipe)}
                  className="shrink-0 rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50"
                >
                  {fav ? "❤️ Saved" : "🤍 Save"}
                </button>
              </div>

              <AddToPlan recipe={recipe} />

              <section>
                <h3 className="mb-2 font-semibold">Ingredients</h3>
                <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={`${ing.name}-${i}`} className="flex gap-2">
                      <span className="text-brand-500">•</span>
                      <span>
                        <span className="font-medium">{ing.measure}</span> {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">Instructions</h3>
                {recipe.steps.length ? (
                  <ol className="space-y-3">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-stone-500">No instructions available.</p>
                )}
              </section>

              {(recipe.youtube || recipe.source) && (
                <div className="flex flex-wrap gap-3 text-sm">
                  {recipe.youtube && (
                    <a href={recipe.youtube} target="_blank" rel="noreferrer"
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700">
                      ▶ Watch video
                    </a>
                  )}
                  {recipe.source && (
                    <a href={recipe.source} target="_blank" rel="noreferrer"
                      className="rounded-lg border border-stone-300 px-4 py-2 font-medium hover:bg-stone-50">
                      Original source
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
