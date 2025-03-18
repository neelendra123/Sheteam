import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    districts : [],
    createDistrict : {}
   
}

const districtSlice = createSlice({
    name : 'districts',
    initialState,
    reducers : {
        displayDistricts : (state, action) =>{
            state.districts = action.payload
        },
        createDistrict : (state , action) =>{
            console.log(state);
            console.log(action);
            state.createDistrict = action.payload
        }
    }

});
export const {displayDistricts} = districtSlice.actions;
export const {createDistrict} = districtSlice.actions;
export default districtSlice.reducer;