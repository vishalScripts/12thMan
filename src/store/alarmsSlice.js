// src/store/alarmsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const alarmsSlice = createSlice({
  name: "alarms",
  initialState: {
    alarms: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAlarms: (state, action) => {
      state.alarms = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addAlarm: (state, action) => {
      state.alarms.push(action.payload);
    },
    removeAlarm: (state, action) => {
      state.alarms = state.alarms.filter(
        (alarm) => alarm.id !== action.payload
      );
    },
    toggleAlarmActive: (state, action) => {
      const { id, active } = action.payload;
      const alarm = state.alarms.find((a) => a.id === id);
      if (alarm) {
        alarm.active = active;
      }
    },
    markAlarmTriggered: (state, action) => {
      const alarm = state.alarms.find((a) => a.id === action.payload);
      if (alarm) {
        alarm.triggered = true;
      }
    },
  },
});

export const {
  setAlarms,
  setLoading,
  setError,
  addAlarm,
  removeAlarm,
  toggleAlarmActive,
  markAlarmTriggered,
} = alarmsSlice.actions;

export default alarmsSlice.reducer;
