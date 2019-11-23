export interface Subject{
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
}

/**
 * represents a callback that will be dispatched in EventDispatcher
 */
export type Handler<E> = (event: E) => void;

/**
 * EventDispatcher: handles the dispatching of events to observer
 */
export class EventDispatcher<T> {
    private handlers: Handler<T>[] = [];
    fire(event: T){
        for(let h of this.handlers){
            h(event);
        } 
    }
    register(handler: Handler<T>){
        this.handlers.push(handler);
    }
}

export interface Observer{
    update(subject: any);
}

export interface AudioObserver extends Observer{
    update(subject: Float32Array);
}