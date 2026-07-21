/**
 * --------------------------------------------------------------------------
 * Bootstrap datepicker.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import { Calendar, type DatesArr, type Options } from 'vanilla-calendar-pro';
import BaseComponent from './base-component.js';
type DatepickerConfig = {
    datepickerTheme: string | null;
    dateMin: string | number | Date | null;
    dateMax: string | number | Date | null;
    dateFormat: Intl.DateTimeFormatOptions | ((date: Date, locale: string | undefined) => string) | null;
    displayElement: string | HTMLElement | boolean | null;
    displayMonthsCount: number;
    firstWeekday: number;
    inline: boolean;
    locale: string;
    positionElement: string | HTMLElement | null;
    selectedDates: string[];
    selectionMode: string;
    placement: string;
    vcpOptions: Options;
};
/**
 * Class definition
 */
declare class Datepicker extends BaseComponent {
    _element: HTMLElement & {
        value: string;
    };
    _config: DatepickerConfig;
    _calendar: Calendar | null;
    _isShown: boolean;
    _isInput: boolean;
    _isInline: boolean;
    _boundInput: HTMLInputElement | null;
    _positionElement: HTMLElement;
    _displayElement: HTMLElement | false | null;
    _themeObserver: MutationObserver | null;
    constructor(element?: string | Element | null, config?: Partial<DatepickerConfig> | null);
    static get Default(): DatepickerConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
    getSelectedDates(): string[];
    setSelectedDates(dates: DatesArr): void;
    _initCalendar(): void;
    _updateDisplayWithSelectedDates(): void;
    _resolvePositionElement(): HTMLElement;
    _resolveDisplayElement(): HTMLElement | false | null;
    _getThemeAncestor(): Element | null;
    _getEffectiveTheme(): string | null;
    _syncThemeAttribute(element: HTMLElement | undefined): void;
    _setupThemeObserver(): void;
    _buildCalendarOptions(): Options;
    _handleDateClick(self: Calendar, event: MouseEvent): void;
    _maybeHideAfterSelection(selectedDates: string[]): void;
    _parseDate(dateStr: string): Date;
    _formatDate(dateStr: string): string;
    _formatDateForInput(dates: string[]): string;
    _parseInputValue(): void;
}
export default Datepicker;
export type { DatepickerConfig };
//# sourceMappingURL=datepicker.d.ts.map