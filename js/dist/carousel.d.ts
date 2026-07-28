/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
import { type BootstrapEvent } from './dom/event-handler.js';
type CarouselConfig = {
    autoplay: boolean;
    ends: string;
    interval: number;
    keyboard: boolean;
    pause: string | boolean;
};
/**
 * Class definition
 */
declare class Carousel extends BaseComponent {
    protected _config: CarouselConfig;
    protected _viewport: HTMLElement;
    protected _indicatorsElement: HTMLElement | null;
    protected _playPauseElement: HTMLElement | null;
    protected _prevControls: HTMLButtonElement[];
    protected _nextControls: HTMLButtonElement[];
    protected _interval: ReturnType<typeof setTimeout> | null;
    protected _observer: IntersectionObserver | null;
    protected _scrollFrame: number | null;
    protected _looping: boolean;
    protected _visibility: Map<Element, number>;
    protected _playing: boolean;
    protected _activeIndex: number;
    constructor(element?: string | Element | null, config?: Partial<CarouselConfig> | null);
    static get Default(): CarouselConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    next(): void;
    nextWhenVisible(): void;
    prev(): void;
    pause(): void;
    cycle(): void;
    to(index: number | string): void;
    dispose(): void;
    protected _configAfterMerge(config: CarouselConfig): CarouselConfig;
    protected _initialActiveIndex(): number;
    protected _addEventListeners(): void;
    protected _keydown(event: BootstrapEvent): void;
    protected _observeItems(): void;
    protected _handleIntersection(entries: IntersectionObserverEntry[]): void;
    protected _navIndex(): number;
    protected _scrollToIndex(index: number): void;
    protected _animateScroll(targetLeft: number, onComplete: () => void): void;
    protected _scrollDelta(element: HTMLElement): number;
    protected _loopTransition(isNext: boolean): void;
    protected _loopDirection(isNext: boolean): string;
    protected _jumpScroll(delta: number): void;
    protected _fadeTo(index: number): void;
    protected _setActive(index: number): void;
    protected _refreshActiveState(): void;
    protected _updateEndControls(): void;
    protected _setControlsDisabled(controls: HTMLButtonElement[], disabled: boolean): void;
    protected _setActiveIndicatorElement(index: number): void;
    protected _normalizeIndex(index: number, length: number): number | null;
    protected _wrapsAround(): boolean;
    protected _canLoop(): boolean;
    protected _direction(from: number, to: number): string;
    protected _scheduleAutoplay(index?: number): void;
    protected _upcomingIndex(): number | null;
    protected _itemInterval(index?: number): number;
    protected _maybeEnableCycle(): void;
    _pauseFromInteraction(): void;
    _togglePlayPause(): void;
    protected _updatePlayPauseControl(): void;
    protected _isFade(): boolean;
    protected _prefersReducedMotion(): boolean;
    protected _getItems(): HTMLElement[];
    protected _clearInterval(): void;
}
export default Carousel;
export type { CarouselConfig };
//# sourceMappingURL=carousel.d.ts.map