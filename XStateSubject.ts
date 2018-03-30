/**
 * Created by zhiyuan.huang@ddder.net.
 */
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

import { observeOn } from 'rxjs/operator/observeOn';
import { queue } from 'rxjs/scheduler/queue';
import { scan } from 'rxjs/operator/scan';
import { AsyncSubject } from "rxjs/AsyncSubject";

interface Action {
    type: string;
    payload?: any;
    scannedSubject?: AsyncSubject<any>
}

export interface ActionReducer<T> {
    (state: T | undefined, action: Action): T;
}

class ActionsSubject extends BehaviorSubject<Action> {
    constructor() {
        super({ type: 'init' });
    }

    next(action: Action): void {
        if (typeof action === 'undefined') {
            throw new TypeError(`Actions must be objects`);
        } else if (typeof action.type === 'undefined') {
            throw new TypeError(`Actions must have a type property`);
        }

        super.next(action);
    }

    complete() {
        /* noop */
    }
}


type StateActionPair<T> = {
    state: T | undefined;
    action?: Action;
};

const innerNextAction = '__inner_next__';
function innerNextReducer(state, action) {
    return action.payload;
}

export default class XStateSubject<T> extends BehaviorSubject<T> {
    private stateSubscription: Subscription;
    private actions$: ActionsSubject;
    private scannedActions$: ActionsSubject;

    private reducers: {
        [type: string]: ActionReducer<T>
    };

    constructor(initialState: T) {
        super(initialState);

        this.actions$ = new ActionsSubject();
        this.scannedActions$ = new ActionsSubject();

        this.reducers = {};

        const actionsOnQueue$: Observable<Action> = observeOn.call(this.actions$, queue);
        const stateAndAction$: Observable<{ state: any; action: Action; }> = scan.call(actionsOnQueue$, this.reduceState.bind(this), { state: initialState });

        this.stateSubscription = stateAndAction$.subscribe(({ state, action }) => {
            super.next.call(this, state);
            this.scannedActions$.next(action);

            if ( action.scannedSubject ) {
                action.scannedSubject.next(state);
                action.scannedSubject.complete();
            }
        });

        this.addReducer(innerNextAction, innerNextReducer);

        this.created();
    }

    private reduceState(
        stateActionPair: StateActionPair<T> = { state: undefined },
        action: Action
    ): StateActionPair<T> {
        const { state } = stateActionPair;
        const actionType = action.type;
        const reducer = this.reducers[actionType];

        return { state: reducer ? reducer(state, action) : state, action };
    }

    public created() {}

    public addReducer(type: string, reducer: ActionReducer<T>) {
        this.reducers[type] = reducer;
    }

    public addReducers(reducers: { [type: string]: ActionReducer<T> }) {
        for (let type in reducers) {
            this.addReducer(type, reducers[type]);
        }
    }

    public dispatch(action: Action): Observable<T> {
        action.scannedSubject = new AsyncSubject<any>();

        this.actions$.next(action);
        return action.scannedSubject.asObservable();
    }

    public next(value: T) {
        this.dispatch({
            type: innerNextAction,
            payload: value
        })
    }
}