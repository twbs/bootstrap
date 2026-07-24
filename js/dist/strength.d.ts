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
    _config: StrengthConfig;
    _input: HTMLInputElement | null;
    _segments: HTMLElement[];
    _textElement: HTMLElement | null;
    _currentStrength: string | null;
    constructor(element?: string | Element | null, config?: Partial<StrengthConfig> | null);
    static get Default(): StrengthConfig;
    static get DefaultType(): Record<string, string>;
    static get NAME(): string;
    getStrength(): string | null;
    evaluate(): void;
    _getInput(): HTMLInputElement | null;
    _addEventListeners(): void;
    _evaluate(): void;
    _calculateScore(password: string): number;
    _scoreToStrength(score: number): string | null;
    _updateUI(strength: string | null): void;
}
export default Strength;
export type { StrengthConfig };
//# sourceMappingURL=strength.d.ts.map