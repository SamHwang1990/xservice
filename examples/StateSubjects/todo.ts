/**
 * Created by zhiyuan.huang@ddder.net.
 */

import XStateSubject from '../../XStateSubject';

export enum actions {
    init = 'init',

    add = 'addTodo',
    delete = 'deleteTodo',

    updateContent = 'updateContent',
    updateStatus = 'updateStatus',

}

export interface ToDoInfo {
    id: number,
    content: string,
    status: boolean,
}

const ContactListReducers = {
    [actions.init](state, action) {
        return action.payload;
    },
    [actions.add](state: ToDoInfo[], action) {
        state.push(action.payload);
        return state;
    },
    [actions.delete](state: ToDoInfo[], action) {
        for (let i = 0; i < state.length; ++i) {
            if (state[i].id == action.payload) {
                state.splice(i, 1);
                break;
            }
        }
        return state;
    },
    [actions.updateContent](state: ToDoInfo[], action) {
        const { id, content } = action.payload;

        for (let i = 0; i < state.length; ++i) {
            if (state[i].id == id) {
                state[i].content = content;
                break;
            }
        }
        return state;
    },
    [actions.updateStatus](state: ToDoInfo[], action) {
        const { id, status } = action.payload;

        for (let i = 0; i < state.length; ++i) {
            if (state[i].id == id) {
                state[i].status = status;
                break;
            }
        }
        return state;
    },
};

export default class ContactListSubject extends XStateSubject<ToDoInfo[]> {
    public created() {
        this.addReducers(ContactListReducers)
    }
}