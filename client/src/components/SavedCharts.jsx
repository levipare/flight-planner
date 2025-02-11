import { createMemo, createSignal } from "solid-js";
import { categories, groupBy, store } from "../store";
import BookmarkOutline from "../svgs/BookmarkOutline";

export default function SavedCharts() {
  const [edit, setEdit] = createSignal(false);

  const getGroups = createMemo(() => {
    return groupBy(store.savedCharts, "icao");
  });

  return (
    <div class="flex items-center rounded-md border border-neutral-700 bg-neutral-800">
      <Show
        when={store.savedCharts.length === 0}
        fallback={
          <label class="m-2 cursor-pointer text-center text-sm">
            Edit
            <input
              onClick={() => setEdit(!edit())}
              type="checkbox"
              value=""
              class="peer sr-only"
              checked={edit()}
            />
            <div class="relative h-5 w-10 rounded-md bg-neutral-700 after:absolute after:bottom-0 after:left-[2px] after:top-0 after:my-auto after:h-4 after:w-4  after:rounded-md after:bg-white after:transition-all peer-checked:bg-sky-600  peer-checked:after:left-[calc(100%-1rem-2px)]"></div>
          </label>
        }
      >
        <div class="m-2 flex w-full items-center justify-center text-sm text-neutral-500 ">
          Press the
          <span class="mx-1 inline-block">
            <BookmarkOutline />
          </span>
          to bookmark a chart here.
        </div>
      </Show>
      <div class="flex gap-4 overflow-x-auto p-2">
        <For each={Object.keys(getGroups())}>
          {(icao) => (
            <div class="relative flex gap-2 rounded-md border border-neutral-600 p-2">
              <div class="absolute -top-2 left-2 bg-neutral-800 px-1 text-xs text-neutral-500">
                {icao}
              </div>
              <For each={getGroups()[icao]}>
                {(chart) => (
                  <div class="relative">
                    <button
                      title={chart.title}
                      onClick={() => store.setActiveChart(chart)}
                      class={`max-w-[12rem] transition-all ${
                        edit() ? "brightness-50" : ""
                      }`}
                      disabled={edit()}
                    >
                      <div
                        class={`h-1 w-full rounded-t-md ${
                          categories[chart.category].bg
                        }`}
                      ></div>
                      <div
                        class={`overflow-hidden overflow-ellipsis whitespace-nowrap rounded-b-md border-x border-b border-neutral-600 p-2 text-sm ${
                          edit() ? "" : "hover:bg-neutral-600"
                        } ${
                          store.activeChart.id == chart.id
                            ? "bg-neutral-600"
                            : "bg-neutral-700"
                        }`}
                      >
                        {chart.title}
                      </div>
                    </button>
                    <button
                      title="Unbookmark"
                      class={`absolute bottom-0 left-0 right-0 top-0 m-auto h-min w-min cursor-pointer rounded-md bg-red-700 p-1 transition-all hover:bg-red-900 ${
                        edit() ? "visible opacity-100" : "invisible opacity-0"
                      }`}
                      onClick={() => store.removeChart(chart)}
                    >
                      <svg
                        class="w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
