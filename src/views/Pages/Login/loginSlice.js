import { createSlice } from "@reduxjs/toolkit";
const initialState = {
   login : {}
};

const loginSlice = createSlice({
    name : 'login',
    initialState,
    reducers : {
        login : (state, action) =>{
            // console.log(state);
            // console.log(action);
            state.login = action.payload
            
        },
    }

});
export const {login} = loginSlice.actions;
export default loginSlice.reducer;