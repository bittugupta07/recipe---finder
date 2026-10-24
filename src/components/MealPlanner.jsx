import { DAYS, MEALS, useApp } from "../context/AppContext";

function Slot({ day, meal, entry }) {
  const { openRecipe, removeFromPlan } = useApp();

  if (!entry) {
    return (
      <div className="flex min-h-[4.5rem] items-center justify-center rounded-xl border border-dashed border-stone-300 text-xs text-stone-400">
        Empty
      </div>
    );
  }

  return (
    <div className="group relative flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-stone-200">
      <button onClick={() => openRecipe(entry.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        {entry.image && <img src={entry.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
        <span className="line-clamp-2 text-xs font-medium leading-tight hover:text-brand-600">{entry.title}</span>
      </button>
      <button
        onClick={() => removeFromPlan(day, meal)}
        aria-label={`Remove ${entry.title} from ${day} ${meal}`}
        className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-red-50 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  );
}

export default function MealPlanner() {
  const { plan, clearPlan } = useApp();
  const planned = DAYS.reduce((n, d) => n + MEALS.filter((m) => plan[d]?.[m]).length, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Weekly meal plan</h2>
          <p className="text-sm text-stone-500">
            {planned} of {DAYS.length * MEALS.length} meals planned. Open any recipe and use “Add to meal plan”.
          </p>
        </div>
        {planned > 0 && (
          <button
            onClick={() => window.confirm("Clear the whole week?") && clearPlan()}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
          >
            Clear plan
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-stone-100 p-3 ring-1 ring-stone-200">
        <div className="grid min-w-[56rem] grid-cols-[5rem_repeat(7,minmax(0,1fr))] gap-2">
          <div />
          {DAYS.map((d) => (
            <div key={d} className="rounded-lg bg-brand-500 py-2 text-center text-sm font-semibold text-white">
              {d.slice(0, 3)}
            </div>
          ))}

          {MEALS.map((meal) => (
            <div key={meal} className="contents">
              <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                {meal}
              </div>
              {DAYS.map((day) => (
                <Slot key={day + meal} day={day} meal={meal} entry={plan[day]?.[meal]} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
