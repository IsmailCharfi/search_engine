import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from ".";

export type Index = { [key: string]: any };

export type Document = {
  id: string;
  path: string;
  name: string;
  date: string;
  type: string;
  language: string;
  keywords: string;
  size: number;
  category: string;
  ext: string;
};

type Indexes = {
  name: Index;
  type: Index;
  date: Index;
  time: Index;
  keywords: Index;
  language: Index;
  category: Index;
  content: Index;
  size: Index;
  ext: Index
};

interface AppState {
  indexes: Indexes;
  documents: Document[];
  searchResult: Document[];
}

const initialState: AppState = {
  indexes: {
    name: {},
    type: {},
    date: {},
    time: {},
    keywords: {},
    content: {},
    category: {},
    language: {},
    size: {},
    ext: {}
  },
  documents: [],
  searchResult: [],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIndexes(state: AppState, action: PayloadAction<{ indexes: Indexes }>) {
      state.indexes = action.payload.indexes;
    },
    setDocuments(
      state: AppState,
      action: PayloadAction<{ documents: Document[] }>
    ) {
      state.documents = action.payload.documents;
    },
    setSearchResult(
      state: AppState,
      action: PayloadAction<{ documents: Document[] }>
    ) {
      state.searchResult = action.payload.documents;
    },
    
  },
});

export const reducer = slice.reducer;

export const dispatchIndexes =
  (indexes: Indexes): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setIndexes({ indexes }));
  };

export const dispatchDocuments =
  (documents: Document[]): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setDocuments({ documents }));
  };

export const dispatchSearchResult =
  (documents: Document[]): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setSearchResult({ documents }));
  };

export default slice;
