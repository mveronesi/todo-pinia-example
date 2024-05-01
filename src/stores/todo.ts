import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { ITodo } from '@/interfaces';

function toggleProp(prop: 'important' | 'done', id: string, todo: ITodo) {
  return todo.id === id ? { ...todo, [prop]: !todo[prop] } : todo;
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ITodo[]>([]);

  async function fetchTodos() {
    const response = await axios.get('http://localhost:8000/todos/');
    todos.value = response.data;
  }

  async function addTodo(todo: ITodo) {
    const response = await axios.post('http://localhost:8000/todos/', todo);
    todos.value.push(response.data);
  }

  async function removeTodo(id: string) {
    await axios.delete(`http://localhost:8000/todos/${id}`);
    todos.value = todos.value.filter((todo: ITodo) => todo.id !== id);
  }

  async function toggleDone(id: string) {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.done = !todo.done;
      await axios.put(`http://localhost:8000/todos/`, todo);
    }
  }

  async function toggleImportant(id: string) {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.important = !todo.important;
      await axios.put(`http://localhost:8000/todos/`, todo);
    }
  }

  const doneTodosCount = computed(() => todos.value.filter((todo) => todo.done).length);
  const importantTodosCount = computed(() => todos.value.filter((todo) => todo.important).length);
  const activeTodosCount = computed(() => todos.value.filter((todo) => !todo.done).length);

  return {
    fetchTodos,
    addTodo,
    removeTodo,
    toggleDone,
    toggleImportant,
    doneTodosCount,
    importantTodosCount,
    activeTodosCount,
    todos
  };
});