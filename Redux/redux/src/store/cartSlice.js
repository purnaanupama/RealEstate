import { createSlice } from "@reduxjs/toolkit";

const initialState=[]; //state of cart when the application is started
const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers:{
        //function 1 : adding to cart
        add(state,action) //adding to cart state
        {
         //it will get the payload from the action and store that update that state from the payload
         state.push(action.payload)
        },
        remove(state,action){
          return state.filter(item=>item.id !== action.payload)
        }
    }
})

export const {add, remove}=cartSlice.actions
export default cartSlice.reducer;