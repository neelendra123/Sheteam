import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dropdowns : [],
    createDrodown : {}
   
}

const dropdownSlice = createSlice({
    name : 'dropdowns',
    initialState,
    reducers : {
        displayDropdown : (state, action) =>{
            state.dropdowns = action.payload
        },
        createDrodown : (state , action) =>{
           
            state.createDrodown = action.payload
        }
    }

});
export const {displayDropdown} = dropdownSlice.actions;
export const {createDrodown} = dropdownSlice.actions;
export default dropdownSlice.reducer;