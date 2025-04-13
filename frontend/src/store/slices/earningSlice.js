import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  earnings: [],
  totalEarnings: 0,
  availableBalance: 0,
  withdrawals: [],
  loading: false,
  error: null
};

const earningSlice = createSlice({
  name: 'earning',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setEarnings: (state, action) => {
      const { earnings, totalEarnings, availableBalance } = action.payload;
      state.earnings = earnings;
      state.totalEarnings = totalEarnings;
      state.availableBalance = availableBalance;
      state.loading = false;
      state.error = null;
    },
    setWithdrawals: (state, action) => {
      state.withdrawals = action.payload;
    },
    addWithdrawal: (state, action) => {
      state.withdrawals.unshift(action.payload);
      state.availableBalance -= action.payload.amount;
    },
    updateWithdrawalStatus: (state, action) => {
      const { id, status } = action.payload;
      const withdrawal = state.withdrawals.find(w => w._id === id);
      if (withdrawal) {
        withdrawal.status = status;
        // If withdrawal is rejected, add the amount back to available balance
        if (status === 'rejected') {
          state.availableBalance += withdrawal.amount;
        }
      }
    },
    resetEarnings: () => initialState
  }
});

export const {
  setLoading,
  setError,
  setEarnings,
  setWithdrawals,
  addWithdrawal,
  updateWithdrawalStatus,
  resetEarnings
} = earningSlice.actions;

export default earningSlice.reducer;