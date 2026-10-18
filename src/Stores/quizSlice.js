import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../Components/Utils/axiosClient';

// Thunk to generate/fetch quiz questions using RAG
export const startAiQuiz = createAsyncThunk(
  'quiz/start',
  async (algoKey, { rejectWithValue }) => {
    try {
      // Calls GET /api/quiz/generate/:algoKey
      const response = await axiosClient.get(`/api/quiz/generate/${algoKey}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start quiz");
    }
  }
);

// Thunk to submit answers and get AI evaluation
export const evaluateQuiz = createAsyncThunk(
  'quiz/evaluate',
  async ({ algoKey, userAnswers }, { rejectWithValue }) => {
    try {
      // Calls POST /api/quiz/submit
      const response = await axiosClient.post('/api/quiz/submit', { algoKey, userAnswers });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Evaluation failed");
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    results: null, // Stores score, detailedResults (AI explanations), and rewards
    loading: false,
    evaluating: false,
    error: null
  },
  reducers: {
    clearQuizSession: (state) => {
      state.questions = [];
      state.results = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startAiQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startAiQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(startAiQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(evaluateQuiz.pending, (state) => {
        state.evaluating = true;
      })
      .addCase(evaluateQuiz.fulfilled, (state, action) => {
        state.evaluating = false;
        state.results = action.payload;
      })
      .addCase(evaluateQuiz.rejected, (state, action) => {
        state.evaluating = false;
        state.error = action.payload;
      });
  }
});

export const { clearQuizSession } = quizSlice.actions;
export default quizSlice.reducer;