import { useEffect, useState } from "react";
import { listAreas, listCategories } from "../api/mealdb";

function Select({ label, value, onChange, options, anyLabel }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-stone-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <option value="">{anyLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function SearchBar({ onSearch, loading }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("ingredients");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
    listAreas().then(setAreas).catch(() => {});
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() && !category && !area) return;
    onSearch({ text: text.trim(), mode, category, area });
  };

  const modeBtn = (m, label) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        mode === m ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="flex gap-2">
        {modeBtn("ingredients", "By ingredients")}
        {modeBtn("name", "By recipe name")}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === "ingredients" ? "e.g. chicken, garlic (use English names)" : "e.g. pasta, curry, pie"}
          aria-label="Search recipes"
          className="flex-1 rounded-xl border border-stone-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Searching…" : "🔍 Search"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Category" value={category} onChange={setCategory} options={categories} anyLabel="Any category" />
        <Select label="Cuisine" value={area} onChange={setArea} options={areas} anyLabel="Any cuisine" />
      </div>
    </form>
  );
}
