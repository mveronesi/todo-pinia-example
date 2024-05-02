import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { ITodo } from '@/interfaces';

function toggleProp(prop: 'important' | 'done', id: string, todo: ITodo) {
  return todo.id === id ? { ...todo, [prop]: !todo[prop] } : todo;
}

const BASE_URL = 'http://localhost:8000/todos/'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ITodo[]>([]);

  async function fetchTodos() {
    const response = await axios.get(BASE_URL);
    todos.value = response.data;
  }

  async function addTodo(todo: ITodo) {
    const response = await axios.post(BASE_URL, todo);
    todos.value.push(response.data);
    await fetchTodos();
  }

  async function removeTodo(id: string) {
    await fetchTodos();
    const todo = todos.value.find((todo: ITodo) => todo.id === id);
    if (!todo) return;
    await axios.delete(`${BASE_URL}${id}`);
    await fetchTodos();
  }

  async function toggleDone(id: string) {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.done = !todo.done;
      await axios.put(BASE_URL, todo);
    }
    await fetchTodos();
  }

  async function toggleImportant(id: string) {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.important = !todo.important;
      await axios.put(BASE_URL, todo);
    }
    await fetchTodos();
  }

  async function editTodo(id: string, updatedTodo: Partial<ITodo>) {
    await fetchTodos();
    const todoIndex = todos.value.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      const todo = todos.value[todoIndex];
      const updated = { ...todo, ...updatedTodo };
      await axios.put(BASE_URL, updated);
      todos.value[todoIndex] = updated;
    }
    await fetchTodos();
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
    editTodo,
    doneTodosCount,
    importantTodosCount,
    activeTodosCount,
    todos
  };
});