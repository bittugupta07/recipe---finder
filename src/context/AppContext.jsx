import { createContext, useCallback, useContext, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const MEALS = ["Breakfast", "Lunch", "Dinner"];

const emptyPlan = () =>
  Object.fromEntries(DAYS.map((d) => [d, Object.fromEntries(MEALS.map((m) => [m, null]))]));

const AppContext = createContext(null);

// Keep only the fields we need so localStorage stays small
const slim = (r) => ({
  id: r.id,
  title: r.title,
  image: r.image,
  category: r.category,
  area: r.area,
});

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage("rf:favorites", []);
  const [plan, setPlan] = useLocalStorage("rf:plan", emptyPlan());
  const [openRecipeId, setOpenRecipeId] = useState(null);

  const isFavorite = useCallback((id) => favorites.some((f) => f.id === id), [favorites]);

  const toggleFavorite = useCallback(
    (recipe) =>
      setFavorites((prev) =>
        prev.some((f) => f.id === recipe.id)
          ? prev.filter((f) => f.id !== recipe.id)
          : [slim(recipe), ...prev]
      ),
    [setFavorites]
  );

  const addToPlan = useCallback(
    (recipe, day, meal) =>
      setPlan((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: slim(recipe) } })),
    [setPlan]
  );

  const removeFromPlan = useCallback(
    (day, meal) => setPlan((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: null } })),
    [setPlan]
  );

  const clearPlan = useCallback(() => setPlan(emptyPlan()), [setPlan]);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      plan,
      addToPlan,
      removeFromPlan,
      clearPlan,
      openRecipeId,
      openRecipe: setOpenRecipeId,
      closeRecipe: () => setOpenRecipeId(null),
    }),
    [favorites, isFavorite, toggleFavorite, plan, addToPlan, removeFromPlan, clearPlan, openRecipeId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
