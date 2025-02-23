import { createSlice } from "@reduxjs/toolkit";
import { CalendarService } from "../services/CalendarServices";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    runningTask: "",
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setRunningTask: (state, action) => {
      state.runningTask = action.payload;
    },
    deleteRunningTask: (state, action) => {
      state.runningTask = "";
    },
  },
});

export const {
  setTasks,
  setLoading,
  setError,
  setRunningTask,
  deleteRunningTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
