import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import productSlice from "./productSlice";


//dont need to manually configure redux dev-tools just install extension
//dont need to configure thunk middleware 
const store = configureStore({
    //all the slices goes here
    reducer:{
        cart:cartSlice,
        products:productSlice
    }
})

export default store;