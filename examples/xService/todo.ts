/**
 * Created by zhiyuan.huang@ddder.net.
 */

import TodoStateSubject, { actions as TodoActions, ToDoInfo } from '../StateSubjects/todo';
import {Observable} from "rxjs/Observable";

let todoSeed = 0;

export default class TodoService {
    private static _singleton: TodoService;

    private readonly _todo$: TodoStateSubject;
    public readonly todo$: Observable<ToDoInfo[]>;

    constructor() {
        this._todo$ = new TodoStateSubject([]);
        this.todo$ = this._todo$.asObservable();
    }

    public addTodo(content) {
        this._todo$.dispatch({
            type: TodoActions.add,
            payload: {
                id: ++todoSeed,
                content,
                status: false
            }
        });
    }

    public deleteTodo(id) {
        this._todo$.dispatch({
            type: TodoActions.delete,
            payload: id
        });
    }

    public updateContent(id, content) {
        this._todo$.dispatch({
            type: TodoActions.updateContent,
            payload: {
                id,
                content
            }
        });
    }

    public updateStatus(id, status) {
        this._todo$.dispatch({
            type: TodoActions.updateStatus,
            payload: {
                id,
                status
            }
        });
    }

    public static getInstance(): TodoService {
        if (!this._singleton) {
            this._singleton = new TodoService();
        }
        return this._singleton;
    }
}