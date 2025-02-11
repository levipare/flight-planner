import { debounce } from "@solid-primitives/scheduled";
import * as pdfjs from "pdfjs-dist/build/pdf";
import { createMemo, onMount } from "solid-js";
import { createStore } from "solid-js/store";

pdfjs.GlobalWorkerOptions.workerSrc = import(
  "pdfjs-dist/build/pdf.worker.entry"
);

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const initialPdfState = {
  isLoading: false,
  isRendering: false,
  page: null,
  canvas: null,
  context: null,
  origWidth: 0,
  origHeight: 0,
  rotation: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  panStartX: 0,
  panStartY: 0,
  lastPanX: 0,
  lastPanY: 0,
  isPanning: false,
};

const [pdf, setPdf] = createStore();

export function PdfZoomIn() {
  handlePdfZoom(-1);
}

export function PdfZoomOut() {
  handlePdfZoom(1);
}

export function PdfRotateClockwise() {
  setPdf({ rotation: pdf.rotation + 90 });
}

export function PdfRotateCounterclockwise() {
  setPdf({ rotation: pdf.rotation - 90 });
}

export async function PdfRerender() {
  setPdf({
    rotation: 0,
    zoom: 1,
    panX: 0,
    panY: 0,
    panStartX: 0,
    panStartY: 0,
    lastPanX: 0,
    lastPanY: 0,
  });
  await renderPdf();
}

function handlePdfZoom(delta) {
  if (!delta) return;
  const zoomMultiplier = 1.2;
  const newZoom = clamp(
    delta < 0 ? pdf.zoom * zoomMultiplier : pdf.zoom / zoomMultiplier,
    1,
    3,
  );

  setPdf({
    zoom: newZoom,
  });
}

function handleMouseDown(event) {
  event.preventDefault();
  setPdf({ isPanning: true });
  setPdf({
    panStartX: event.clientX,
    panStartY: event.clientY,
  });
}

function handleMouseUp(event) {
  event.preventDefault();
  setPdf({ isPanning: false });
  setPdf({ lastPanX: pdf.panX, lastPanY: pdf.panY });
}

function handleMouseMove(event) {
  event.preventDefault();
  if (!pdf.isPanning) return;

  const rect = event.target.getBoundingClientRect();
  const pRect = event.target.parentElement.getBoundingClientRect();

  let dx = pdf.lastPanX + event.clientX - pdf.panStartX;
  let dy = pdf.lastPanY + event.clientY - pdf.panStartY;

  setPdf({
    panX: dx,
    panY: dy,
  });
}

function handleTouchDown(event) {
  event.preventDefault();

  if (event.targetTouches.length === 1) {
    setPdf({ isPanning: true });

    setPdf({
      panStartX: pdf.panStartX + event.targetTouches[0].clientX,
      panStartY: pdf.panStartY + event.targetTouches[0].clientY,
    });
  }
}

function handleTouchMove(event) {
  event.preventDefault();

  if (pdf.isPanning) {
    let dx = pdf.lastPanX + event.targetTouches[0].clientX - pdf.panStartX;
    let dy = pdf.lastPanY + event.targetTouches[0].clientY - pdf.panStartY;

    setPdf({ panX: dx, panY: dy });
  }
}

function handleTouchEnd(event) {
  event.preventDefault();
  setPdf({ isPanning: false });
  setPdf({ panStartX: 0, panStartY: 0 });
  setPdf({ lastPanX: pdf.panX, lastPanY: pdf.panY });
}

async function renderPdf() {
  if (pdf.isRendering) return;
  setPdf({ isRendering: true });
  const base = 4;

  const viewport = pdf.page.getViewport({ scale: base });
  const rect = pdf.canvas.parentElement.getBoundingClientRect();

  let heightOptimized =
    (rect.height * window.devicePixelRatio) / viewport.height;
  let widthOptimized = (rect.width * window.devicePixelRatio) / viewport.width;

  let optimized =
    heightOptimized * viewport.width > rect.width * window.devicePixelRatio
      ? widthOptimized
      : heightOptimized;

  setPdf({
    origWidth: Math.floor(
      (optimized * viewport.width) / window.devicePixelRatio,
    ),
    origHeight: Math.floor(
      (optimized * viewport.height) / window.devicePixelRatio,
    ),
  });

  pdf.canvas.width = viewport.width;
  pdf.canvas.height = viewport.height;
  pdf.canvas.style.width = pdf.origWidth + "px";
  pdf.canvas.style.height = pdf.origHeight + "px";

  let renderContext = {
    canvasContext: pdf.context,
    viewport: viewport,
  };

  await pdf.page.render(renderContext).promise;
  setPdf({ isRendering: false });
}

export default function PdfViewer(props) {
  createMemo(() => loadPDF(props.source));

  async function loadPDF(source) {
    setPdf({ ...initialPdfState });
    setPdf({ isLoading: true });
    const p = await pdfjs.getDocument(source).promise;
    const page = await p.getPage(1);
    const canvas = document.getElementById("pdf-canvas");
    const context = canvas.getContext("2d");

    setPdf({ page: page, canvas: canvas, context: context });

    await renderPdf();

    setPdf({ isLoading: false });
  }

  onMount(() => {
    const trigger = debounce(PdfRerender, 200);

    window.addEventListener("resize", () => {
      trigger.clear();
      trigger();
    });
  });

  return (
    <div class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md">
      <Show when={pdf.isLoading}>
        <div class="absolute z-10 flex h-full w-full items-center justify-center bg-neutral-800 bg-opacity-80 text-2xl text-neutral-600">
          <svg
            class="h-24 w-24 stroke-neutral-500"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke-width="10"
              r="35"
              stroke-dasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              ></animateTransform>
            </circle>
          </svg>
        </div>
      </Show>
      <canvas
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchDown}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => handlePdfZoom(e.deltaY)}
        class={`absolute touch-none ${
          pdf.isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          width: pdf.origWidth * pdf.zoom + "px",
          height: pdf.origHeight * pdf.zoom + "px",
          transform: `translate(${pdf.panX}px, ${pdf.panY}px) rotate(${pdf.rotation}deg)`,
        }}
        id="pdf-canvas"
      ></canvas>
    </div>
  );
}
