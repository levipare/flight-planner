import { setStore, store } from "../store";
import Collapse from "../svgs/Collapse";
import Expand from "../svgs/Expand";
import MoonFilled from "../svgs/MoonFilled";
import MoonOutline from "../svgs/MoonOutline";
import Refresh from "../svgs/Refresh";
import RotateClockwise from "../svgs/RotateClockwise";
import RotateCounterclockwise from "../svgs/RotateCounterclockwise";
import ZoomIn from "../svgs/ZoomIn";
import ZoomOut from "../svgs/ZoomOut";
import {
  PdfRerender,
  PdfRotateClockwise,
  PdfRotateCounterclockwise,
  PdfZoomIn,
  PdfZoomOut,
} from "./PdfViewer";

export default function PdfButtons() {
  return (
    <>
      <div class="absolute left-0 top-0 z-50 m-4 flex rounded-md border border-neutral-600 bg-neutral-700 p-2">
        <button
          onClick={PdfRerender}
          title="Reset chart"
          class="hover:text-neutral-400"
          disabled={store.activeChart.id ? false : true}
        >
          <Refresh />
        </button>
      </div>

      <div class="absolute bottom-0 right-0 top-0 z-50 mx-4 my-auto flex h-24 flex-col gap-4 rounded-md border border-neutral-600 bg-neutral-700 p-2">
        <button
          onClick={PdfRotateClockwise}
          title="Rotate Clockwise"
          class="hover:text-neutral-400"
          disabled={store.activeChart.id ? false : true}
        >
          <RotateClockwise />
        </button>

        <button
          onClick={PdfRotateCounterclockwise}
          title="Rotate Counterclockwise"
          class="hover:text-neutral-400"
          disabled={store.activeChart.id ? false : true}
        >
          <RotateCounterclockwise />
        </button>
      </div>
      <div class="absolute right-0 top-0 z-50 m-4 flex flex-col gap-4 rounded-md border border-neutral-600 bg-neutral-700 p-2">
        <button
          onClick={PdfZoomIn}
          title="Zoom In"
          class="hover:text-neutral-400"
          disabled={store.activeChart.id ? false : true}
        >
          <ZoomIn />
        </button>
        <button
          onClick={PdfZoomOut}
          title="Zoom Out"
          class="hover:text-neutral-400"
          disabled={store.activeChart.id ? false : true}
        >
          <ZoomOut />
        </button>
      </div>
      <div class="absolute bottom-0 right-0 z-50 m-4 flex flex-col gap-4">
        <Show when={store.activeChart.nightMode}>
          <div class="flex flex-col rounded-md border border-neutral-600 bg-neutral-700 p-2">
            <button
              title="Night Mode"
              class="hover:text-neutral-400"
              onClick={() =>
                setStore({
                  chartNightMode: !store.chartNightMode,
                })
              }
            >
              <Show when={store.chartNightMode} fallback={<MoonOutline />}>
                <MoonFilled />
              </Show>
            </button>
          </div>
        </Show>

        <div class="flex flex-col rounded-md border border-neutral-600 bg-neutral-700 p-2">
          <button
            title="Expand Chart"
            class="hover:text-neutral-400"
            onClick={() =>
              setStore({
                chartExpanded: !store.chartExpanded,
              })
            }
            disabled={store.activeChart.id ? false : true}
          >
            <Show when={!store.chartExpanded} fallback={<Collapse />}>
              <Expand />
            </Show>
          </button>
        </div>
      </div>
    </>
  );
}
