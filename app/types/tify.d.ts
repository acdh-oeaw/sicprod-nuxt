declare module "tify" {
	export default class Tify {
		constructor(options: { container: HTMLElement; manifestUrl: string; pages: Array<number> });

		readonly ready: Promise<void>;
		readonly options: { pages: Array<number> };
		readonly viewer: { addHandler(event: "open", handler: () => void): void };

		destroy(): void;
	}
}
