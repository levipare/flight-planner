import { createStore } from "solid-js/store";

export function groupBy(arr, key) {
  return arr.reduce(function (acc, x) {
    (acc[x[key]] = acc[x[key]] || []).push(x);
    return acc;
  }, {});
}

function compareKeys(a, b) {
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

export const categories = {
  TAXI: {
    name: "Taxiway",
    bg: "bg-emerald-600",
  },
  SID: {
    name: "Standard Instrument Departure",
    bg: "bg-amber-600",
  },
  STAR: {
    name: "Standard Terminal Arrival",
    bg: "bg-sky-600",
  },
  APP: {
    name: "Approach Procedure",
    bg: "bg-indigo-600",
  },
  REF: {
    name: "Reference",
    bg: "bg-purple-600",
  },
};

// A schema of sorts to ensure savedCharts localstorage is valid
const exampleChart = {
  id: 0,
  icao: "",
  title: "",
  category: "",
  nightMode: true,
};

// Loads localStorage > savedCharts into array and sanitizes
function loadSavedCharts() {
  try {
    let arr = JSON.parse(localStorage.getItem("savedCharts") ?? []);
    for (let obj of arr) if (!compareKeys(exampleChart, obj)) return [];

    return arr;
  } catch {
    localStorage.setItem("savedCharts", "[]");
    return [];
  }
}

export const initialStore = {
  icao: "",
  airport: { name: "", charts: [] },
  activeChart: {},
  savedCharts: loadSavedCharts(),
  chartNightMode: false,
  chartExpanded: false,
  selectedCategory: "TAXI",
  search: "",
  searchResults: {},
  setActiveChart(chart) {
    setStore({
      chartNightMode: false,
      chartRotation: 0,
      activeChart: chart,
    });
  },
  saveChart(chart) {
    setStore("savedCharts", [...store.savedCharts, chart]);
    localStorage.setItem("savedCharts", JSON.stringify([...store.savedCharts]));
  },
  removeChart(chart) {
    let copy = [...store.savedCharts];
    copy.splice(copy.map((c) => c.id).indexOf(chart.id), 1);
    setStore("savedCharts", copy);
    localStorage.setItem("savedCharts", JSON.stringify(copy));
  },
};

export const [store, setStore] = createStore({ ...initialStore });
