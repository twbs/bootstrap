/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { Calendar, type DateAny, type DateMode, type DatesArr, type MonthsCount, type Options, type PositionToInput, type WeekDayID } from 'vanilla-calendar-pro';
import BaseComponent from './base-component.js';
type DatepickerConfig = {
    datepickerTheme: string | null;
    dateMin: DateAny | null;
    dateMax: DateAny | null;
    dateFormat: Intl.DateTimeFormatOptions | ((date: Date, locale: string | undefined) => string) | null;
    displayElement: string | HTMLElement | boolean | null;
    displayMonthsCount: MonthsCount;
    firstWeekday: WeekDayID;
    inline: boolean;
    locale: string;
    positionElement: string | HTMLElement | null;
    selectedDates: string[];
    selectionMode: DateMode;
    placement: PositionToInput;
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
    protected _displayElement: HTMLElement | false | null;
    protected _themeObserver: MutationObserver | null;
    constructor(element?: string | Element | null, config?: Partial<DatepickerConfig> | null);
    static get Default(): DatepickerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    dispose(): void;
    getSelectedDates(): string[];
    setSelectedDates(dates: DatesArr): void;
    protected _initCalendar(): void;
    protected _updateDisplayWithSelectedDates(): void;
    protected _resolvePositionElement(): HTMLElement;
    protected _resolveDisplayElement(): HTMLElement | false | null;
    protected _getThemeAncestor(): Element | null;
    protected _getEffectiveTheme(): string | null;
    protected _syncThemeAttribute(element: HTMLElement | undefined): void;
    protected _setupThemeObserver(): void;
    protected _setupFocusOut(): void;
    protected _buildCalendarOptions(): Options;
    protected _handleDateClick(self: Calendar, event: MouseEvent): void;
    protected _maybeHideAfterSelection(selectedDates: string[]): void;
    protected _parseDate(dateStr: string): Date;
    protected _formatDate(dateStr: string): string;
    protected _formatDateForInput(dates: string[]): string;
    protected _parseInputValue(): void;
}
export default Datepicker;
export type { DatepickerConfig };
//# sourceMappingURL=datepicker.d.ts.map