import { Transition } from 'solid-transition-group';
import { categories, store } from '../store';
import BookmarkFilled from '../svgs/BookmarkFilled';
import BookmarkOutline from '../svgs/BookmarkOutline';

export default function ChartButton({ chart }) {
	return (
		<Transition name="slide-fade">
			<button
				onClick={() => store.setActiveChart(chart)}
				class="relative transition-all duration-150 w-full"
			>
				<div
					class={`absolute h-full w-2 rounded-l-md  ${
						store.activeChart.id == chart.id
							? `${categories[chart.category].bg}`
							: ''
					}`}
				></div>
				<div class="p-4 text-left w-full flex justify-between items-center border border-neutral-600 bg-neutral-700 hover:bg-neutral-600 rounded-md">
					{chart.title}
					<div
						title="Bookmark Chart"
						class="hover:text-neutral-400"
						onClick={(e) => {
							e.stopPropagation();
							if (
								!store.savedCharts
									.map((c) => c.id)
									.includes(chart.id)
							) {
								store.saveChart(chart);
							} else {
								store.removeChart(chart);
							}
						}}
					>
						<Show
							when={store.savedCharts
								.map((c) => c.id)
								.includes(chart.id)}
							fallback={<BookmarkOutline />}
						>
							<BookmarkFilled />
						</Show>
					</div>
				</div>
			</button>
		</Transition>
	);
}
