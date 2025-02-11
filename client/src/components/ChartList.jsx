import { Show, createMemo } from "solid-js";
import { categories, setStore, store } from "../store";
import ChartButton from "./ChartButton";

export default function ChartList() {
  const selectedCategoryCharts = createMemo(() => {
    return store.airport.charts.filter(
      (c) => c.category === store.selectedCategory,
    );
  });

  const groupedApproachCharts = createMemo(() => {
    if (store.selectedCategory !== "APP") return;
    const rwyRegex = /(RWYS? [0-9]+L?R?C?\/?L?R?C?)/g;
    let result = selectedCategoryCharts().reduce(function (acc, chart) {
      let rwyNum = chart.title.match(rwyRegex) ?? "*";
      (acc[rwyNum] = acc[rwyNum] || []).push(chart);
      return acc;
    }, {});

    return result;
  });

  let pseudoStyles =
    "before:absolute after:absolute before:z-10 after:z-10 before:bottom-0 after:bottom-0 before:w-4 after:w-4 before:h-4 after:h-4 before:rounded-full after:rounded-full before:right-full after:left-full";

  return (
    <div class="flex h-full min-h-0 flex-col">
      <nav class="flex">
        <For each={Object.keys(categories)}>
          {(cat, i) => (
            <button
              class="w-full"
              onClick={() => setStore({ selectedCategory: cat })}
            >
              <div
                class={`h-1 w-full rounded-t-md ${categories[cat].bg}`}
              ></div>
              <div
                class={`relative w-full border-neutral-700 p-2 ${
                  store.selectedCategory == cat
                    ? `bg-neutral-800 ${pseudoStyles}`
                    : "bg-neutral-700"
                } ${
                  i() === 0
                    ? "border-l before:shadow-none"
                    : "before:shadow-[0.5em_0.5em_0_0_rgb(38,38,38)] "
                } ${
                  i() === Object.keys(categories).length - 1
                    ? "border-r after:shadow-none"
                    : "after:shadow-[-0.5em_0.5em_0_0_rgb(38,38,38)]"
                }`}
              >
                {cat}
              </div>
            </button>
          )}
        </For>
      </nav>
      <div class="border-x border-neutral-700 bg-neutral-800 p-4 text-center">
        {categories[store.selectedCategory].name}
      </div>
      <div class="relative min-h-0 grow">
        <div class="h-full overflow-y-auto rounded-b-md border-x border-b border-neutral-700 bg-neutral-800">
          <Show
            when={selectedCategoryCharts()?.length > 0}
            fallback={
              <div class="p-4 text-center text-neutral-400">
                No {store.selectedCategory} charts
              </div>
            }
          >
            <Show
              when={store.selectedCategory === "APP"}
              fallback={
                <ul class="flex flex-col gap-4 px-4 pb-4">
                  <For each={selectedCategoryCharts()}>
                    {(chart) => (
                      <li>
                        <ChartButton chart={chart} />
                      </li>
                    )}
                  </For>
                </ul>
              }
            >
              <For each={Object.keys(groupedApproachCharts())}>
                {(k) => (
                  <div class="px-4 pb-4">
                    <h1
                      class={`rounded-md p-2 text-center ${categories["APP"].bg}`}
                    >
                      {k}
                    </h1>
                    <ul class="mt-4 flex flex-col gap-4">
                      <For each={groupedApproachCharts()[k]}>
                        {(chart) => (
                          <li>
                            <ChartButton chart={chart} />
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>
    </div>
  );
}
