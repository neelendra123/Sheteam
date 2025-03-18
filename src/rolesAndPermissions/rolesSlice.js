import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roles : [],
    createRole : {}
   
}

const roleSlice = createSlice({
    name : 'roles',
    initialState,
    reducers : {
        displayRoles : (state, action) =>{
            state.roles = action.payload
        },
        createRole : (state , action) =>{
            // console.log(state);
            // console.log(action);
            state.createRole = action.payload
        }
    }

});
export const {displayRoles} = roleSlice.actions;
 export const {createRole} = roleSlice.actions;
export default roleSlice.reducer;