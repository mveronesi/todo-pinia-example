<template>
  <div class="input-container">
    <Input
      v-model:value="field"
      class="input"
      placeholder="Type name of todo"
      @keyup.enter="handleAddTodo"
    />
    <DatePicker 
      class="input date-picker" 
      placeholder="Select date" 
      @update:value="date = $event" 
      ref="datePicker" 
    />
    <Button type="primary" @click="handleAddTodo">Add Todo</Button>
  </div>

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
const date = ref<Dayjs | null>(null);
const store = useTodoStore();
const datePickerRef = ref(null);

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
  const formattedDate = date.value ? date.value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  const todo = createTodo(field.value, formattedDate);
  store.addTodo(todo);

  field.value = '';
  date.value = null;
  datePickerRef.value?.clear()
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