import { useApp } from "../context/AppContext";

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite, openRecipe } = useApp();
  const fav = isFavorite(recipe.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
        )}
        <button
          onClick={() => toggleFavorite(recipe)}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl shadow backdrop-blur transition hover:scale-110"
        >
          {fav ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 min-h-[3rem] font-semibold leading-snug">{recipe.title}</h3>

        <div className="flex flex-wrap gap-2 text-xs text-stone-600">
          {recipe.category && (
            <span className="rounded-full bg-stone-100 px-2.5 py-1">🍽 {recipe.category}</span>
          )}
          {recipe.area && (
            <span className="rounded-full bg-stone-100 px-2.5 py-1">🌍 {recipe.area}</span>
          )}
        </div>

        <button
          onClick={() => openRecipe(recipe.id)}
          className="mt-auto rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          View recipe
        </button>
      </div>
    </article>
  );
}
