import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cases : [],
    addCases : {}
}
const caseSlice = createSlice({
    name : 'cases',
    initialState,
    reducers : {
        displayCases : (state, action) =>{
            state.cases = action.payload
        },
        addCases : (state , action) =>{
            state.addCases = action.payload
        }
    }

});
export const {displayCases} = caseSlice.actions;
export const {addCases} = caseSlice.actions;
export default caseSlice.reducer;