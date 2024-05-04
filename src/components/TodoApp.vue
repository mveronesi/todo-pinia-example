<template>
  <div class="input-container">
    <Input
      v-model:value="field"
      :class="{'input-text': true, 'error-input': fieldError}"
      placeholder="Type name of todo"
      @keyup.enter="handleAddTodo"
    />
    <DatePicker 
      class="input date-picker" 
      :class="{'error-input': dateError}"
      placeholder="Select date" 
      :value="date"
      @update:value="handleDateChange" 
      ref="datePicker" 
    />
    <Button type="primary" @click="handleAddTodo">Add Todo</Button>
  </div>
  <div v-if="fieldError" class="error">{{ fieldError }}</div>
  <div v-if="dateError" class="error">{{ dateError }}</div>

  <div class="stats-container">
    <Typography>Active: {{ store.activeTodosCount }}</Typography>
    <Typography>Done: {{ store.doneTodosCount }}</Typography>
    <Typography>Important: {{ store.importantTodosCount }}</Typography>
  </div>

  <List bordered :data-source="store.todos">
    <template #renderItem="{ item }">
      <ListItem class="list-item">
        <div class="small-cell-left">
          <CheckOutlined class="icon" @click="store.toggleDone(item.id)" title="Toggle done" />
          <ExclamationOutlined color="red" @click="store.toggleImportant(item.id)" title="Toggle important" />
        </div>
        <div class="cell">
          <Typography :class="{ 'line-through': item.done, 'text-bold': item.important }">{{ item.text }}</Typography>
        </div>
        <div class="small-cell-right">
          <Typography class="todo-date">{{ item.date }}</Typography>
        </div>
        <div class="small-cell-right">
          <EditOutlined @click="openEditModal(item)" class="icon" title="Edit todo"/>
          <CloseCircleOutlined @click="confirmDelete(item.id)" class="icon" title="Delete todo" />
        </div>
      </ListItem>
    </template>
  </List>

  <Modal v-model:visible="isEditModalVisible" title="Edit Todo" @ok="handleEditTodo">
    <Input v-model:value="editField" placeholder="Type name of todo" />
    <DatePicker v-model:value="editDate" placeholder="Select date" />
  </Modal>
</template>

<script setup lang="ts">
import { Input, List, ListItem, Typography, DatePicker, Button } from 'ant-design-vue';
import EditOutlined from '@ant-design/icons-vue/lib/icons/EditOutlined';
import { Modal } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useTodoStore } from '@/stores/todo';
import { v4 as uuidv4 } from 'uuid';
import CloseCircleOutlined from '@ant-design/icons-vue/lib/icons/CloseCircleOutlined';
import CheckOutlined from '@ant-design/icons-vue/lib/icons/CheckOutlined';
import ExclamationOutlined from '@ant-design/icons-vue/lib/icons/ExclamationOutlined';
import type { ITodo } from '@/interfaces';

const field = ref('');
const date = ref<Dayjs | null>(dayjs());
const store = useTodoStore();
const datePickerRef = ref(null);
const fieldError = ref('');
const dateError = ref('');
const isEditModalVisible = ref(false);
const editField = ref('');
const editDate = ref<Dayjs | null>(null);
let editTodoId: string | null = null;


onMounted(store.fetchTodos);

function createTodo(text: string, date: string) {
  return { 
    text: text, 
    id: uuidv4(), 
    done: false, 
    important: false, 
    date: date
  };
}

function handleAddTodo() {
  let error = false;
  if (!field.value) {
    fieldError.value = 'Please enter a todo';
    error = true;
  }

  if (!date.value) {
    dateError.value = 'Please select a date';
    error = true;
  }
  if (error) return;
  const formattedDate = date.value ? date.value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  const todo = createTodo(field.value, formattedDate);
  store.addTodo(todo);

  field.value = '';
  datePickerRef.value?.clear()
  fieldError.value = '';
  dateError.value = '';
}

function openEditModal(todo: ITodo) {
  editTodoId = todo.id;
  editField.value = todo.text;
  editDate.value = dayjs(todo.date);
  isEditModalVisible.value = true;
}

function handleDateChange(newDate: string | Dayjs) {
  date.value = newDate;
}

function handleEditTodo() {
  if (!editField.value || !editDate.value || !editTodoId) return;
  const updatedTodo = {
    text: editField.value,
    date: editDate.value.format('YYYY-MM-DD'),
  };
  store.editTodo(editTodoId, updatedTodo);
  isEditModalVisible.value = false;
  editField.value = '';
  editDate.value = null;
  editTodoId = null;
}

function confirmDelete(id: string) {
  Modal.confirm({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this todo?',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      store.removeTodo(id);
    },
  });
}
</script>

<style scoped>
.input-container {
  display: flex;
  gap: 0.5em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

.cell {
  flex: 3;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

.small-cell-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 1em;
}

.small-cell-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1em;
}

.input-text {
  flex: 4;
}

.date-picker {
  flex: 1;
}

.error-input {
  border-color: red;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 5px;
}

@media (max-width: 600px) {
  .input-container {
    flex-direction: column;
  }
  .list-item {
    flex-direction: column;
    gap: 1em;
    border: 1px solid black;
  }
}

.icon {
  margin-right: 10px;
}

.line-through {
  text-decoration: line-through;
}

.text-bold {
  font-weight: 700;
}
</style>