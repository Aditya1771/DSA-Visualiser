import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../Components/Utils/axiosClient' 

//THUNKS

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);


// ============================================================
//  OTP-BASED SIGNUP
// ============================================================

// Step 1: send signup OTP
export const sendSignupOtp = createAsyncThunk(
  'auth/sendSignupOtp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/signup/send-otp', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Step 2: verify signup OTP → user gets created
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async ({ emailId, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/signup/verify-otp', { emailId, otp });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// ============================================================
//  OTP-BASED LOGIN
// ============================================================

// Step 1: send login OTP (password is validated on backend first)
export const sendLoginOtp = createAsyncThunk(
  'auth/sendLoginOtp',
  async ({ emailId, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/login/send-otp', { emailId, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Step 2: verify login OTP → user gets authenticated
export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async ({ emailId, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/login/verify-otp', { emailId, otp });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// Resend OTP (works for both purposes)
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ emailId, purpose }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/resend-otp', { emailId, purpose });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
    }
  }
);

// ============================================================
//  FORGOT PASSWORD FLOW
// ============================================================

export const sendForgotPasswordOtp = createAsyncThunk(
  'auth/sendForgotPasswordOtp',
  async ({ emailId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/forgot-password/send-otp', { emailId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  'auth/verifyForgotPasswordOtp',
  async ({ emailId, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/forgot-password/verify-otp', { emailId, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth-otp/forgot-password/reset', {
        resetToken,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Google Login User
export const googleLoginUser = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/google-login', { idToken });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Google Login failed');
    }
  }
);

// Check Auth (On Refresh)
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); 
      }
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch('/user/profile/update', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const completeAlgorithm = createAsyncThunk(
  'auth/completeAlgorithm',
  async (algoKey, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch('/user/complete-algo', { algoKey });
      return { ...response.data, algoKey };
    } catch (error) {
      return rejectWithValue('Failed to save progress');
    }
  }

);

/**
 * --- SLICE ---
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    otpPending: null,
    resetToken: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOtpPending: (state) => {   // ← ADD
    state.otpPending = null;
    state.error = null;
  },
    clearResetToken: (state) => {
      state.resetToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload ? {
          ...action.payload,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          completedAlgorithms: [],
          badges: []
        } : null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        // ---- Signup OTP: Send ----
      .addCase(sendSignupOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(sendSignupOtp.fulfilled, (state, action) => {
      state.loading = false;
      // Stash email + purpose so the OTP screen knows what to verify
      state.otpPending = { emailId: action.meta.arg.emailId, purpose: 'signup' };
      })
      .addCase(sendSignupOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      })

      // ---- Signup OTP: Verify ----
      .addCase(verifySignupOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = !!action.payload;
      state.otpPending = null;
      state.user = action.payload ? {
      ...action.payload,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      completedAlgorithms: [],
      badges: []
      } : null;
      })
      .addCase(verifySignupOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      })

      // ---- Login OTP: Send ----
      .addCase(sendLoginOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.otpPending = { emailId: action.meta.arg.emailId, purpose: 'login' };
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      })

      // ---- Login OTP: Verify ----
      .addCase(verifyLoginOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = !!action.payload;
      state.otpPending = null;
      state.user = action.payload ? {
      ...action.payload,
      totalPoints: action.payload.totalPoints || 0,
      currentStreak: action.payload.currentStreak || 0,
      longestStreak: action.payload.longestStreak || 0,
      completedAlgorithms: action.payload.completedAlgorithms || [],
      badges: action.payload.badges || []
      } : null;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      })

      // ---- Resend OTP ----
      .addCase(resendOtp.fulfilled, (state) => {
      state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
      state.error = action.payload;
      })

      // ---- Forgot Password: Send ----
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpPending = { emailId: action.meta.arg.emailId, purpose: 'forgot-password' };
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Forgot Password: Verify ----
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Forgot Password: Reset ----
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetToken = null;
        state.otpPending = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload ? {
          ...action.payload,
          totalPoints: action.payload.totalPoints || 0,
          currentStreak: action.payload.currentStreak || 0,
          longestStreak: action.payload.longestStreak || 0,
          completedAlgorithms: action.payload.completedAlgorithms || [],
          badges: action.payload.badges || []
        } : null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Login
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        if (!state.user) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload ? {
          ...action.payload,
          totalPoints: action.payload.totalPoints || 0,
          currentStreak: action.payload.currentStreak || 0,
          longestStreak: action.payload.longestStreak || 0,
          completedAlgorithms: action.payload.completedAlgorithms || [],
          badges: action.payload.badges || []
        } : null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Update User Profile
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // This updates the profile instantly
      })
      // Complete Algorithm (Updates streak/points in real-time)
      .addCase(completeAlgorithm.fulfilled, (state, action) => {
          if (state.user) {
            state.user.totalPoints = action.payload.totalPoints;
            state.user.currentStreak = action.payload.currentStreak;
            // Pushes the new algo to the list so the checkmark appears
            if (!state.user.completedAlgorithms.includes(action.payload.algoKey)) {
              state.user.completedAlgorithms.push(action.payload.algoKey);
            }
          }
      });
  }
});

export const { clearError, clearOtpPending, clearResetToken } = authSlice.actions;
export default authSlice.reducer;