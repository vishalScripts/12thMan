import { createSlice } from "@reduxjs/toolkit";
import { CalendarService } from "../services/CalendarServices";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
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
  },
});

export const { setTasks, setLoading, setError } = tasksSlice.actions;

export default tasksSlice.reducer;
