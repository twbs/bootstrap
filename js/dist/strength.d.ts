/**
 * --------------------------------------------------------------------------
 * Bootstrap strength.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from './base-component.js';
type StrengthConfig = {
    input: string | HTMLInputElement | null;
    minLength: number;
    messages: Record<string, string>;
    weights: Record<string, number>;
    thresholds: number[];
    scorer: ((password: string) => number) | null;
};
/**
 * Class definition
 */
declare class Strength extends BaseComponent {
    protected _config: StrengthConfig;
    protected _input: HTMLInputElement | null;
    protected _segments: HTMLElement[];
    protected _textElement: HTMLElement | null;
    protected _currentStrength: string | null;
    constructor(element?: string | Element | null, config?: Partial<StrengthConfig> | null);
    static get Default(): StrengthConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    getStrength(): string | null;
    evaluate(): void;
    protected _getInput(): HTMLInputElement | null;
    protected _addEventListeners(): void;
    protected _evaluate(): void;
    protected _calculateScore(password: string): number;
    protected _scoreToStrength(score: number): string | null;
    protected _updateUI(strength: string | null): void;
}
export default Strength;
export type { StrengthConfig };
//# sourceMappingURL=strength.d.ts.map