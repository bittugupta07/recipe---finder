# 🍳 Recipe Finder & Meal Planner

React 19 + Tailwind CSS 4 + Vite, powered by the free TheMealDB API.

## Run it locally

1. Install [Node.js](https://nodejs.org) 20 or newer.
2. In this folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173. No API key needed.

## Features

- Search by ingredients (multiple, comma separated) or by recipe name
- Filters: category and cuisine
- Recipe details: ingredients with measures, step-by-step instructions, video and source links
- Favorites saved in localStorage
- Weekly meal planner (7 days x breakfast/lunch/dinner), saved in localStorage
- Responsive layout, loading states and error handling

## Structure

```
src/
  api/mealdb.js          TheMealDB API calls + error handling
  context/AppContext.jsx  favorites, meal plan, open-recipe state
  hooks/                  useLocalStorage, useRecipeSearch
  components/             SearchBar, RecipeCard, RecipeGrid, RecipeModal,
                          SearchPage, FavoritesPage, MealPlanner, Feedback
```

## Deploy (Vercel / Netlify)

`npm run build` creates `dist/`. No environment variables are needed.
