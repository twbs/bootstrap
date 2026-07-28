/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/event-handler.ts
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Types
 */
type BootstrapEvent = Event & Record<string, any>;
type EventCallable = (this: any, event: BootstrapEvent) => any;
declare function trigger(element: EventTarget, event: string, args?: Record<string, unknown>): BootstrapEvent;
declare function trigger(element: EventTarget | null, event: string, args?: Record<string, unknown>): BootstrapEvent | null;
declare const EventHandler: {
    on(element: EventTarget | null, event: string, handler?: string | EventCallable, delegationFunction?: EventCallable): void;
    one(element: EventTarget | null, event: string, handler?: string | EventCallable, delegationFunction?: EventCallable): void;
    off(element: EventTarget | null, originalTypeEvent: string, handler?: string | EventCallable, delegationFunction?: EventCallable): void;
    trigger: typeof trigger;
};
export default EventHandler;
export type { BootstrapEvent, EventCallable };
//# sourceMappingURL=event-handler.d.ts.map