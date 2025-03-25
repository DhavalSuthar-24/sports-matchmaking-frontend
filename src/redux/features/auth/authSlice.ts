// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as authApi from "./authApi";

// Define a type for our state
interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunks

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: authApi.RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Registration failed"
      );
    }
  }
);
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data: authApi.sendOtp, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: authApi.LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

export const loginUserWithOtp = createAsyncThunk(
  "auth/loginWithOtp",
  async (data: authApi.LoginOtpData, { rejectWithValue }) => {
    try {
      const response = await authApi.loginWithOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "OTP login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken(refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Refresh token failed"
      );
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: authApi.ForgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Forgot password failed"
      );
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, data }: { token: string; data: authApi.ResetPasswordData },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.resetPassword(token, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Reset password failed"
      );
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Email verification failed"
      );
    }
  }
);

export const resendUserVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.resendVerificationEmail();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Resend verification failed"
      );
    }
  }
);

export const requestUserPhoneVerification = createAsyncThunk(
  "auth/requestPhoneVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.requestPhoneVerification();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Phone verification request failed"
      );
    }
  }
);

export const verifyUserPhone = createAsyncThunk(
  "auth/verifyPhone",
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyPhone(otp);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Phone verification failed"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (data: authApi.ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.error || "Change password failed"
      );
    }
  }
);

export const updateUserEmail = createAsyncThunk(
  "auth/updateEmail",
  async (data: authApi.UpdateEmailData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateEmail(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.error || "Update email failed"
      );
    }
  }
);

export const updateUserData = createAsyncThunk(
  "auth/updateUser",
  async (
    { id, data }: { id: string; data: authApi.UpdateUserData },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.updateUser(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Update user failed"
      );
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.deleteAccount();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.error || "Delete account failed"
      );
    }
  }
);

export const getAuthStatus = createAsyncThunk(
  "auth/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getauthStatus();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error || "Get status failed");
    }
  }
);

export const updateUserLocation = createAsyncThunk(
  "auth/updateUserLocation",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Omit<
        authApi.UpdateUserData,
        "name" | "bio" | "preferredSports" | "notificationPrefs" | "socialMedia"
      >;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.updateUserLocation(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Update user location failed"
      );
    }
  }
);

// The auth slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Optional: add synchronous actions (e.g., logout locally)
    clearError(state) {
      state.error = null;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        // Optionally, you can update state here if needed
        // For example, you might want to store a flag indicating OTP was sent successfully
      })
      .addCase(sendOtp.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.data.user;
    });
    builder.addCase(registerUser.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.data.user;
    });
    builder.addCase(loginUser.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login with OTP
    builder.addCase(loginUserWithOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUserWithOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.data.user;
    });
    builder.addCase(loginUserWithOtp.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Logout (clear token and user)
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
    });

    // Refresh Token
    builder.addCase(refreshUserToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });



    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") &&
          (action.type.endsWith("/pending") ||
            action.type.endsWith("/rejected")),
        (state, action: any) => {
          state.loading = action.type.endsWith("/pending");
          if (action.type.endsWith("/rejected")) {
            state.error = action.payload;
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const { clearError, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
