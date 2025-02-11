import { groupBy, setStore, store } from "../store";

export default function ChartSearch() {
  function runSearchQuery() {
    if (!store.search) return {};
    let results = groupBy(
      store.airport.charts.filter((c) => {
        let args = store.search.split(" ");

        for (let arg of args) if (!c.title.includes(arg.toUpperCase())) return;

        return c;
      }),
      "category",
    );
    setStore({
      searchResults: results,
    });
  }
  return (
    <div class="rounded-md border border-neutral-700 bg-neutral-800 p-4">
      <input
        value={store.search}
        onInput={(event) => {
          setStore({ search: event.target.value });
          runSearchQuery();
        }}
        placeholder="Filter Charts"
        class="w-full rounded-md bg-neutral-700 p-2"
        type="search"
      />
    </div>
  );
}
