import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FiltersState = {
  dateRange: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  sortBy: "weekNumber" | "date";
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
};

const initialState: FiltersState = {
  dateRange: "",
  dateFrom: "",
  dateTo: "",
  status: "",
  sortBy: "weekNumber",
  sortDir: "asc",
  page: 1,
  pageSize: 5,
};

const filtersSlice = createSlice({
  name: "timesheetFilters",
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ dateRange: string; dateFrom: string; dateTo: string }>,
    ) => {
      state.dateRange = action.payload.dateRange;
      state.dateFrom = action.payload.dateFrom;
      state.dateTo = action.payload.dateTo;
      state.page = 1;
    },
    setDateFrom: (state, action: PayloadAction<string>) => {
      state.dateFrom = action.payload;
      state.page = 1;
    },
    setDateTo: (state, action: PayloadAction<string>) => {
      state.dateTo = action.payload;
      state.page = 1;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.page = 1;
    },
    toggleSort: (state, action: PayloadAction<"weekNumber" | "date">) => {
      if (state.sortBy === action.payload) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = action.payload;
        state.sortDir = "asc";
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
  },
});

export const { setDateRange, setDateFrom, setDateTo, setStatus, toggleSort, setPage, setPageSize } =
  filtersSlice.actions;
export default filtersSlice.reducer;
