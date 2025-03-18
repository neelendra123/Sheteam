import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cities : [],
    createCity : {}
   
}

const citySlice = createSlice({
    name : 'cities',
    initialState,
    reducers : {
        displayCities : (state, action) =>{
            state.cities = action.payload
        },
        createCity : (state , action) =>{
            state.createCity = action.payload
        }
    }

});
export const {displayCities} = citySlice.actions;
 export const {createCity} = citySlice.actions;
export default citySlice.reducer;