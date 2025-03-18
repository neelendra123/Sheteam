import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users : [],
   addUsers : {}
}
const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {
        displayUsers : (state, action) =>{
            state.users = action.payload
        },
        addUsers : (state , action) =>{
            state.addUsers = action.payload
        }
    }

});
export const {displayUsers} = userSlice.actions;
export const {addUsers} = userSlice.actions;
export default userSlice.reducer;