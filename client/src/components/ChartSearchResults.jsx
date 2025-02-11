import { categories, store } from "../store";
import ChartButton from "./ChartButton";

export default function ChartSearchResults() {
  return (
    <div class="h-full w-full overflow-auto rounded-md border border-neutral-700 bg-neutral-800">
      <div class="p-4 text-center">Search results for: {store.search}</div>
      <div class="flex flex-col gap-4 px-4 pb-4">
        <For each={Object.keys(store.searchResults)}>
          {(key) => (
            <div class="flex flex-col gap-4">
              <h1
                class={`rounded-md border-b border-b-neutral-700 p-2 text-center ${categories[key].bg}`}
              >
                {categories[key].name}
              </h1>
              <ul class="flex flex-col gap-4">
                <For each={store.searchResults[key]}>
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
      </div>
    </div>
  );
}
