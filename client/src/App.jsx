import ChartList from "./components/ChartList";
import ChartSearch from "./components/ChartSearch";
import ChartSearchResults from "./components/ChartSearchResults";
import IcaoSearch from "./components/IcaoSearch";
import PdfButtons from "./components/PdfButtons";
import PdfViewer from "./components/PdfViewer";
import SavedCharts from "./components/SavedCharts";
import { store } from "./store";

export default function App(props) {
  return (
    <>
      <main class="hidden h-full min-h-0 min-w-0 grow gap-4 bg-neutral-900 p-4 md:flex">
        <Show when={!store.chartExpanded}>
          <aside class="flex h-full w-full max-w-md flex-col gap-4 ">
            <IcaoSearch />
            <ChartSearch />
            <Show when={!store.search} fallback={<ChartSearchResults />}>
              <ChartList />
            </Show>
          </aside>
        </Show>
        <div class="flex min-w-0 grow flex-col gap-4">
          <div class="relative grow rounded-md border border-neutral-700 bg-neutral-800">
            <Show when={store.activeChart.id}>
              <PdfViewer
                source={`/api/chart/${store.activeChart.icao.toUpperCase()}/${
                  store.activeChart.id
                }-${store.chartNightMode ? "night" : "day"}.pdf`}
                rotation={store.chartRotation}
              />
            </Show>

            <PdfButtons />
          </div>
          <SavedCharts />
        </div>
      </main>
      <div class="m-auto md:hidden">
        Sorry, we don't support small screens.
        <svg
          class="mx-auto mt-4 w-16"
          fill="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.323 8.616l-4.94-4.94a1.251 1.251 0 0 0-1.767 0l-10.94 10.94a1.251 1.251 0 0 0 0 1.768l4.94 4.94a1.25 1.25 0 0 0 1.768 0l10.94-10.94a1.251 1.251 0 0 0 0-1.768zM14 5.707L19.293 11 11.5 18.793 6.207 13.5zm-4.323 14.91a.25.25 0 0 1-.354 0l-1.47-1.47.5-.5-2-2-.5.5-1.47-1.47a.25.25 0 0 1 0-.354L5.5 14.207l5.293 5.293zm10.94-10.94l-.617.616L14.707 5l.616-.616a.25.25 0 0 1 .354 0l4.94 4.94a.25.25 0 0 1 0 .353zm1.394 6.265V18a3.003 3.003 0 0 1-3 3h-3.292l1.635 1.634-.707.707-2.848-2.847 2.848-2.848.707.707L15.707 20h3.304a2.002 2.002 0 0 0 2-2v-2.058zM4 9H3V7a3.003 3.003 0 0 1 3-3h3.293L7.646 2.354l.707-.707 2.848 2.847L8.354 7.34l-.707-.707L9.28 5H6a2.002 2.002 0 0 0-2 2z" />
        </svg>
      </div>
    </>
  );
}
