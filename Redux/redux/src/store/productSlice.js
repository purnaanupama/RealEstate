import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

const initialState={
    data:[],
    status:'idle'
}; //state of cart when the application is started
const productSlice = createSlice({
    name : 'products',
    initialState,
    reducers:{
    //   fetchProducts(state,action){
    //      state.data = action.payload
    //   }
    },
    extraReducers:(builder)=>{
       builder.addCase(getProducts.fulfilled,(state,action)=>{
        state.data = action.payload
         state.status = 'idle'
       })
       .addCase(getProducts.pending,(state,action)=>{
        state.status = 'Loading'
       })
       .addCase(getProducts.rejected,(state,action)=>{
        state.status = 'error'
       })
    }
})

//export const {add, remove}=cartSlice.actions
export const {fetchProducts} = productSlice.actions
export default productSlice.reducer

export const getProducts = createAsyncThunk('products/get',async()=>{
    const data = await fetch('https://fakestoreapi.com/products')
    const result = await data.json()
    return result;
})

// export function getProducts(){
//     return async function getProductThunk(dispatch,getState){
//           //api
//       const data = await fetch('https://fakestoreapi.com/products')
//       const result = await data.json()
//       dispatch(fetchProducts(result))
//     }
// }