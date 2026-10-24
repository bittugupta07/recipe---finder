// TheMealDB - free, no API key required. https://www.themealdb.com/api.php
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function request(path) {
  let res;
  try {
    res = await fetch(BASE_URL + path);
  } catch {
    throw new Error("Network error. Check your internet connection.");
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}). Please try again.`);
  try {
    return await res.json();
  } catch {
    throw new Error("Unexpected response from the recipe server.");
  }
}

const light = (m) => ({
  id: m.idMeal,
  title: m.strMeal,
  image: m.strMealThumb,
  category: m.strCategory,
  area: m.strArea,
});

function parseSteps(text = "") {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^(\d+[.)]\s*)/, ""))
    .filter((l) => l && !/^step\s*\d+\.?$/i.test(l));
}

function normalize(m) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = m[`strIngredient${i}`]?.trim();
    if (name) ingredients.push({ name, measure: m[`strMeasure${i}`]?.trim() || "" });
  }
  return {
    ...light(m),
    tags: m.strTags ? m.strTags.split(",").filter(Boolean) : [],
    steps: parseSteps(m.strInstructions),
    ingredients,
    youtube: m.strYoutube || "",
    source: m.strSource || "",
  };
}

export async function listCategories() {
  const data = await request("/list.php?c=list");
  return (data.meals || []).map((x) => x.strCategory);
}

export async function listAreas() {
  const data = await request("/list.php?a=list");
  return (data.meals || []).map((x) => x.strArea).filter((a) => a !== "Unknown");
}

async function byName(text) {
  const data = await request(`/search.php?s=${encodeURIComponent(text)}`);
  return (data.meals || []).map(light);
}

// Free API filters one ingredient at a time, so we intersect the results ourselves.
async function byIngredients(text) {
  const items = text.split(",").map((s) => s.trim().replace(/\s+/g, "_")).filter(Boolean);
  const lists = await Promise.all(
    items.map(async (i) => {
      const data = await request(`/filter.php?i=${encodeURIComponent(i)}`);
      return (data.meals || []).map(light);
    })
  );
  if (!lists.length) return [];
  const [first, ...rest] = lists;
  return first.filter((m) => rest.every((l) => l.some((x) => x.id === m.id)));
}

async function idsFor(param, value) {
  const data = await request(`/filter.php?${param}=${encodeURIComponent(value)}`);
  return (data.meals || []).map(light);
}

export async function searchRecipes({ text, mode, category, area }) {
  let results = null;
  if (text) results = mode === "name" ? await byName(text) : await byIngredients(text);

  if (category) {
    const list = await idsFor("c", category);
    results = results ? results.filter((m) => list.some((x) => x.id === m.id)) : list;
  }
  if (area) {
    const list = await idsFor("a", area);
    results = results ? results.filter((m) => list.some((x) => x.id === m.id)) : list;
  }
  return results || [];
}

export async function getRecipe(id) {
  const data = await request(`/lookup.php?i=${id}`);
  if (!data.meals?.[0]) throw new Error("Recipe not found.");
  return normalize(data.meals[0]);
}
