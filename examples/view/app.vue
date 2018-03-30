<template>
    <div>
        <div class="todo-list">
            <div v-for="todo in todoList">
                {{ todo.content }}
            </div>
        </div>
        <div class="todo-operator">
            <button @click="add">add</button>
        </div>
    </div>
</template>
<script lang="ts">
    import TodoService from '../xService/todo';

    export default {
        beforeCreate() {
            this.todoService = TodoService.getInstance();
        },
        subscriptions() {
            return {
                todoList: this.todoService.todo$
            }
        },
        methods: {
            add() {
                this.todoService.addTodo(Date.now());
            }
        }
    }
</script>