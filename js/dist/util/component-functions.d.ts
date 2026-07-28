/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import type BaseComponent from '../base-component.js';
import { type BootstrapEvent } from '../dom/event-handler.js';
interface EventActionData {
    targets: HTMLElement[];
    event: BootstrapEvent;
}
declare const enableDismissTrigger: (component: typeof BaseComponent, method?: string) => void;
type EventActionCallback = (data: EventActionData & {
    instances: BaseComponent[];
}) => void;
declare const eventActionOnPlugin: (Plugin: typeof BaseComponent, onEvent: string, stringSelector: string, method: string, callback?: EventActionCallback | null) => void;
export { enableDismissTrigger, eventActionOnPlugin };
//# sourceMappingURL=component-functions.d.ts.map