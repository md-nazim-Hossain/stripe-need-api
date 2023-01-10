import { createSlice } from '@reduxjs/toolkit'
interface paymentDataType{
  subscription_details:any
}

const initialState:paymentDataType = {
  subscription_details: {},
}

const subscriptionSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {

    setSubscriptionDetails: (state, action) => {
      state.subscription_details = action.payload
    },
  },
})

export default subscriptionSlice.reducer
export const { setSubscriptionDetails } = subscriptionSlice.actions
