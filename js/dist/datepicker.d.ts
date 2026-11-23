/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { Calendar, type DateAny, type DateMode, type DatesArr, type MonthsCount, type Options, type PositionToInput, type WeekDayID } from 'vanilla-calendar-pro';
import BaseComponent from './base-component.js';
import type { ComponentConfig } from './util/config.js';
type DatepickerConfig = {
    datepickerTheme: string | null;
    dateMin: DateAny | null;
    dateMax: DateAny | null;
    dateFormat: Intl.DateTimeFormatOptions | ((date: Date, locale: string | undefined) => string) | null;
    displayElement: string | HTMLElement | boolean | null;
    displayMonthsCount: MonthsCount;
    firstWeekday: WeekDayID;
    inline: boolean;
    invalidDateMessage: string;
    showOnFocus: boolean;
    toggleElement: string | HTMLElement | null;
    locale: string;
    positionElement: string | HTMLElement | null;
    selectedDates: string[];
    selectionMode: DateMode;
    placement: PositionToInput;
    rangeEndMessage: string;
    vcpOptions: Options;
};
/**
 * Class definition
 */
declare class Datepicker extends BaseComponent {
    protected _element: HTMLElement & {
        value: string;
    };
    protected _config: DatepickerConfig;
    protected _calendar: Calendar | null;
    protected _isShown: boolean;
    protected _isInput: boolean;
    protected _isInline: boolean;
    protected _boundInput: HTMLInputElement | null;
    protected _positionElement: HTMLElement;
    protected _toggleElement: HTMLElement | null;
    protected _returnFocusElement: HTMLElement;
    protected _originalToggleAria: Map<string, string | null>;
    protected _onToggleClick: () => void;
    protected _displayElement: HTMLElement | false | null;
    protected _displayPlaceholder: string;
    protected _themeObserver: MutationObserver | null;
    protected _onOutside: (event: Event) => void;
    protected _onTriggerClick: (event: Event) => void;
    protected _onKeydown: (event: Event) => void;
    protected _popup: HTMLElement | null;
    protected _floatingCleanup: (() => void) | null;
    protected _resetTimeouts: Set<ReturnType<typeof setTimeout>>;
    protected _suppressFocus: boolean;
    protected _positionGeneration: number;
    protected _showGeneration: number;
    protected _inputName: string | null;
    protected _inputObserver: MutationObserver | null;
    protected _form: HTMLFormElement | null;
    protected _formCleanup: (() => void) | null;
    protected _onReset: (event: Event) => void;
    protected _initialDates: string[];
    protected _rangeDates: string[];
    protected _pendingRange: boolean;
    protected _rangeStatus: HTMLElement | null;
    protected _onInvalid: () => void;
    protected _inputError: HTMLElement | null;
    protected _inputErrorMessage: string;
    protected _originalInvalid: string | null;
    protected _dialog: HTMLDialogElement | null;
    protected _onDialogClose: () => void;
    protected _eventPending: boolean;
    protected _originalAria: Map<string, string | null>;
    constructor(element?: string | Element | null, config?: Partial<DatepickerConfig> | null);
    static get Default(): DatepickerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(relatedTarget?: HTMLElement): Promise<void>;
    show(relatedTarget?: HTMLElement): Promise<void>;
    hide(): Promise<void>;
    protected _triggerLifecycleEvent(name: string): Event;
    protected _closePopup(animated?: boolean): void;
    protected _finishPopupClose(): void;
    dispose(): void;
    getSelectedDates(): string[];
    setSelectedDates(dates: DatesArr): void;
    protected _getConfig(config?: ComponentConfig | null): ComponentConfig;
    protected _isCurrentOpening(generation: number): boolean;
    protected _skipFocusTrigger(relatedTarget?: HTMLElement): boolean;
    protected _containsTrigger(target: Node): boolean;
    protected _restoreAria(element: HTMLElement, original: Map<string, string | null>): void;
    protected _initCalendar(): void;
    protected _createBoundInput(): void;
    protected _syncBoundInput(): void;
    protected _bindInputForm(): void;
    protected _mountPopup(): void;
    protected _updatePosition(): Promise<void>;
    protected _getCalendarLabel(): string;
    protected _getDisplayMonths(): MonthsCount;
    protected _syncDisplayMonths(): void;
    protected _syncPopupState(self: Calendar): void;
    protected _updateRangeStatus(): void;
    protected _updateDisplayWithSelectedDates(): void;
    protected _syncSelectedDates(selectedDates: string[]): void;
    protected _syncDisplay(selectedDates: string[], formattedDate?: string): void;
    protected _resolvePositionElement(): HTMLElement;
    protected _resolveDisplayElement(): HTMLElement | false | null;
    protected _getThemeAncestor(): Element | null;
    protected _getEffectiveTheme(): string | null;
    protected _syncThemeAttribute(element: HTMLElement | undefined): void;
    protected _setupThemeObserver(): void;
    protected _setupDismiss(): void;
    protected _focusCalendarDate(): void;
    protected _focusTrigger(): void;
    protected _handleKeydown(event: KeyboardEvent): void;
    protected _handleInlineEscape(event: KeyboardEvent): void;
    protected _findCalendarDay(date: string): HTMLElement | null;
    protected _focusDay(day: HTMLElement): void;
    protected _handleCalendarNavigation(event: KeyboardEvent): boolean;
    protected _focusNavigationDate(date: Date, direction: number, target: HTMLElement): void;
    protected _buildCalendarOptions(): Options;
    protected _normalizeRangeDates(self: Calendar): void;
    protected _cancelPendingRange(): void;
    protected _handleDateClick(self: Calendar, event: MouseEvent): void;
    protected _maybeHideAfterSelection(selectedDates: string[]): void;
    protected _parseIsoDate(value: string): Date | null;
    protected _parseDate(value: string): Date;
    protected _toIsoDate(date: Date): string;
    protected _formatDate(dateStr: string): string;
    protected _formatDateForInput(dates: string[]): string;
    protected _setInputError(message: string): void;
    protected _showInputError(): void;
    protected _parseInputValue(): void;
}
export default Datepicker;
export type { DatepickerConfig };
//# sourceMappingURL=datepicker.d.ts.map