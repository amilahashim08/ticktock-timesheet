import { configureStore } from "@reduxjs/toolkit";
import timesheetFiltersReducer from "@/store/timesheet-filters-slice";

export const store = configureStore({
  reducer: {
    timesheetFilters: timesheetFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
