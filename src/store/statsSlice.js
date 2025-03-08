// statsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadState = (key) => Number(localStorage.getItem(key)) || 0;

const initialState = {
  tasksDone: loadState("tasksDone"),
  hoursStudied: loadState("hoursStudied"),
  breakTime: loadState("breakTime"),
  pomodoros: loadState("pomodoros"),
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    incrementTasksDone: (state) => {
      state.tasksDone += 1;
      localStorage.setItem("tasksDone", state.tasksDone);
    },
    addStudyTime: (state, action) => {
      state.hoursStudied += action.payload;
      localStorage.setItem("hoursStudied", state.hoursStudied);
    },
    addBreakTime: (state, action) => {
      state.breakTime += action.payload;
      localStorage.setItem("breakTime", state.breakTime);
    },
    incrementPomodoros: (state) => {
      state.pomodoros += 1;
      localStorage.setItem("pomodoros", state.pomodoros);
    },
  },
});

export const {
  incrementTasksDone,
  addStudyTime,
  addBreakTime,
  incrementPomodoros,
} = statsSlice.actions;
export default statsSlice.reducer;
