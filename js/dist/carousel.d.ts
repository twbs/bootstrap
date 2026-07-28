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
    _config: CarouselConfig;
    _viewport: HTMLElement;
    _indicatorsElement: HTMLElement | null;
    _playPauseElement: HTMLElement | null;
    _prevControls: HTMLButtonElement[];
    _nextControls: HTMLButtonElement[];
    _interval: ReturnType<typeof setTimeout> | null;
    _observer: IntersectionObserver | null;
    _scrollFrame: number | null;
    _looping: boolean;
    _visibility: Map<Element, number>;
    _playing: boolean;
    _activeIndex: number;
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
    _configAfterMerge(config: CarouselConfig): CarouselConfig;
    _initialActiveIndex(): number;
    _addEventListeners(): void;
    _keydown(event: BootstrapEvent): void;
    _observeItems(): void;
    _handleIntersection(entries: IntersectionObserverEntry[]): void;
    _navIndex(): number;
    _scrollToIndex(index: number): void;
    _animateScroll(targetLeft: number, onComplete: () => void): void;
    _scrollDelta(element: HTMLElement): number;
    _loopTransition(isNext: boolean): void;
    _loopDirection(isNext: boolean): string;
    _jumpScroll(delta: number): void;
    _fadeTo(index: number): void;
    _setActive(index: number): void;
    _refreshActiveState(): void;
    _updateEndControls(): void;
    _setControlsDisabled(controls: HTMLButtonElement[], disabled: boolean): void;
    _setActiveIndicatorElement(index: number): void;
    _normalizeIndex(index: number, length: number): number | null;
    _wrapsAround(): boolean;
    _canLoop(): boolean;
    _direction(from: number, to: number): string;
    _scheduleAutoplay(index?: number): void;
    _upcomingIndex(): number | null;
    _itemInterval(index?: number): number;
    _maybeEnableCycle(): void;
    _pauseFromInteraction(): void;
    _togglePlayPause(): void;
    _updatePlayPauseControl(): void;
    _isFade(): boolean;
    _prefersReducedMotion(): boolean;
    _getItems(): HTMLElement[];
    _clearInterval(): void;
}
export default Carousel;
export type { CarouselConfig };
//# sourceMappingURL=carousel.d.ts.map