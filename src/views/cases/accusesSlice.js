import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accuses : [],
     addAccuses : {}
}
const accusesSlice = createSlice({
    name : 'cases',
    initialState,
    reducers : {
        displayAccuses : (state, action) =>{
            state.accuses = action.payload
        },
        addAccuses : (state , action) =>{
            state.addAccuses = action.payload
        }
    }

});
export const {displayAccuses} = accusesSlice.actions;
 export const {addAccuses} = accusesSlice.actions;
export default accusesSlice.reducer;