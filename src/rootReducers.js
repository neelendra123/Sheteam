import loginSlice from "./views/Pages/Login/loginSlice";
import userSlice from "./views/Management/Users/userSlice";
import districtSlice from "./views/locations/districts/districtSlice";
import citySlice from "./views/locations/districts/cities/citySlice";
import dropdownSlice from "./views/dropdown/dropdownSlice";
import casesSlice from "./views/cases/casesSlice";
import accusesSlice from "./views/cases/accusesSlice";
import rolesSlice from "./rolesAndPermissions/rolesSlice";
import { combineReducers } from "redux";
export const rootReducer = combineReducers({
    login : loginSlice,
    user : userSlice,
    districts : districtSlice,
    cities : citySlice,
    dropdowns : dropdownSlice,
    cases : casesSlice,
    accuses : accusesSlice,
    permissions : rolesSlice
    
})