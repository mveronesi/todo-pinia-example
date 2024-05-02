<template>
  <div class="input-container">
    <Input
      v-model:value="field"
      :class="{'input': true, 'error-input': fieldError}"
      placeholder="Type name of todo"
      @keyup.enter="handleAddTodo"
    />
    <DatePicker 
        class="input date-picker" 
        :class="{'error-input': dateError}"
        placeholder="Select date" 
        v-model:value="date"
        @update:value="date = $event" 
        ref="datePicker" 
    />
    <Button type="primary" @click="handleAddTodo">Add Todo</Button>
  </div>
  <div v-if="fieldError" class="error">{{ fieldError }}</div>
  <div v-if="dateError" class="error">{{ dateError }}</div>

  <Typography>Done: {{ store.doneTodosCount }}</Typography>
  <Typography>Important: {{ store.importantTodosCount }}</Typography>
  <Typography>Active: {{ store.activeTodosCount }}</Typography>
  <List bordered :data-source="store.todos">
    <template #renderItem="{ item }">
      <ListItem>
        <div>
          <CheckOutlined class="icon" @click="store.toggleDone(item.id)" title="Toggle done" />
          <ExclamationOutlined
            color="red"
            @click="store.toggleImportant(item.id)"
            title="Toggle important"
          />
        </div>
        <Typography :class="{ 'line-through': item.done, 'text-bold': item.important }">{{
          item.text
        }}</Typography>
        <Typography class="todo-date">{{ item.date }}</Typography>
        <CloseCircleOutlined @click="store.removeTodo(item.id)"
      /></ListItem>
    </template>
  </List>
</template>

<script setup lang="ts">
import { Input, List, ListItem, Typography, DatePicker, Button } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useTodoStore } from '@/stores/todo';
import { v4 as uuidv4 } from 'uuid';
import CloseCircleOutlined from '@ant-design/icons-vue/lib/icons/CloseCircleOutlined';
import CheckOutlined from '@ant-design/icons-vue/lib/icons/CheckOutlined';
import ExclamationOutlined from '@ant-design/icons-vue/lib/icons/ExclamationOutlined';

const field = ref('');
const date = ref<Dayjs | null>(dayjs());
const store = useTodoStore();
const datePickerRef = ref(null);
const fieldError = ref('');
const dateError = ref('');

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
</script>

<style scoped>
.input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.input, .date-picker {
  flex: 1 1 auto;
  min-width: 0;
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

  .input, .date-picker {
    flex: 1 0 100%;
    min-width: 100%;
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