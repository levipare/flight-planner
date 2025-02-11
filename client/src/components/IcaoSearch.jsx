import { createSignal } from "solid-js";
import { initialStore, setStore, store } from "../store";

export default function IcaoSearch() {
  const [firstLoad, setFirstLoad] = createSignal(true);
  const [icaoToSearch, setIcaoToSearch] = createSignal("");

  async function handleSubmit(event) {
    event.preventDefault();
    const icao = icaoToSearch().toString().toUpperCase();

    const airportRaw = await fetch(`/api/airport?icao=${icao}`);

    if (airportRaw.status !== 200) {
      setStore({ ...initialStore });
      setFirstLoad(false);
      return;
    }

    const airportBody = await airportRaw.json();

    setStore({
      icao: icao,
      airport: {
        name: airportBody.name,
        charts: airportBody.charts.filter((c) => c.category !== ""),
      },
      activeChart: {},
      chartNightMode: false,
      selectedCategory: "TAXI",
      search: "",
    });
  }

  return (
    <div class="flex items-center justify-between rounded-md border border-neutral-700 bg-neutral-800 p-4">
      <div class="m-auto flex flex-wrap items-baseline">
        <Show
          when={store.icao}
          fallback={
            <h1 class={firstLoad() ? "text-neutral-300" : "text-red-500"}>
              {firstLoad()
                ? "Search for an airport ICAO"
                : "Unsupported Airport"}
            </h1>
          }
        >
          <span class="mr-1 text-2xl">{store.icao}</span>
          <span class="text-neutral-300">{store.airport.name}</span>
        </Show>
      </div>
      <form onSubmit={handleSubmit} class="ml-2 flex">
        <input
          class="h-10 w-20 rounded-md bg-neutral-700 text-center uppercase"
          placeholder="ICAO"
          maxlength="4"
          minlength="4"
          required
          name="icao"
          type="text"
          autocomplete="off"
          onChange={(e) => setIcaoToSearch(e.target.value.toUpperCase())}
        />
        <button
          class="ml-2 h-10 rounded-md bg-sky-600 px-4 hover:bg-sky-700"
          type="submit"
          disabled={icaoToSearch() === store.icao}
        >
          Load
        </button>
      </form>
    </div>
  );
}
