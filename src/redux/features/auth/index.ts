// features/auth/index.ts
import reducer, {
    clearError,
    setToken,
    setUser,
    registerUser,
    loginUser,
    loginUserWithOtp,
    logoutUser,
    refreshUserToken,
    forgotUserPassword,
    resetUserPassword,
    verifyUserEmail,
    resendUserVerificationEmail,
    requestUserPhoneVerification,
    verifyUserPhone,
    changeUserPassword,
    updateUserEmail,
    updateUserData,
    deleteUserAccount,
    getAuthStatus,
    sendOtp,
    updateUserLocation,
  } from './authSlice';
  
  export * from './authApi';
  export {
    reducer as authReducer,
    clearError,
    setToken,
    setUser,
    registerUser,
    sendOtp,
    loginUser,
    loginUserWithOtp,
    logoutUser,
    refreshUserToken,
    forgotUserPassword,
    resetUserPassword,
    verifyUserEmail,
    resendUserVerificationEmail,
    requestUserPhoneVerification,
    verifyUserPhone,
    changeUserPassword,
    updateUserEmail,
    updateUserData,
    deleteUserAccount,
    getAuthStatus,
    updateUserLocation,
  };
  