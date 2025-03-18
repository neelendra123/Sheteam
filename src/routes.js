import React from 'react';
import DefaultLayout from './containers/DefaultLayout';


const Login = React.lazy(()=>import('./views/Pages/Login/Login'));
const Users = React.lazy(()=>import('./views/Management/Users/users'));
const CreateUsers = React.lazy(()=>import('./views/Management/Users/UserCreation'));

const getDistricts = React.lazy(()=>import('./views/locations/districts/district'));
const addDistrict = React.lazy(()=>import('./views/locations/districts/addDistricts'));
const duplicateDistrict = React.lazy(()=> import('./views/locations/districts/cities/duplicatedistrict'));

const cityList = React.lazy(()=>import('./views/locations/districts/cities/citiesList'));
const addCity = React.lazy(()=>import('./views/locations/districts/cities/addCity'));

const DropdownList = React.lazy(()=>import('./views/dropdown/dropdownlist'));
const addDropdown = React.lazy(()=>import('./views/dropdown/addDropdown'));
const contactUs = React.lazy(()=>import('./views/extras/extras'));

const addCase = React.lazy(()=>import('./views/cases/addCase'));
const searchCase = React.lazy(()=> import('./views/cases/searchCase'));

const displayAccused = React.lazy(()=>import('./views/cases/viewCase'));
const addAccused = React.lazy(()=>import('./views/cases/addAccused'));
const allAccuses = React.lazy(()=>import('./views/cases/accuseList'));
const dashboard = React.lazy(()=> import('./views/dashboard/dashboard'));
const fileuploadAccuses = React.lazy(()=> import('./views/cases/fileUpload'));

const rolesList = React.lazy(()=>import('./rolesAndPermissions/rolesList'));
const permisson = React.lazy(()=> import('./rolesAndPermissions/Permissions'));

const addForm = React.lazy(()=>import('./views/FormBuilder/customform'));
const customForm = React.lazy(()=>import('./views/FormBuilder/customFormList'));
const implentForm = React.lazy(()=>import('./views/FormBuilder/customFormfun'));

const routes = [
  { path: '/', name: 'Home', component: DefaultLayout, exact: true },
  { path: '/dashboard', name: 'Dashboard', component: dashboard, exact: true },
  {path: '/ListOfUsers/UsersList', name: 'Users', component: Users, exact: true},
  {path : '/ListOfUsers/UsersList/createusers/:id',name : 'User',component:CreateUsers, exact:true},
  {path : '/ListOfUsers/UsersList/edit/:id',name : 'User',component:CreateUsers,exact:true},
  {path : '/locations/districts',name:'Districts',component:getDistricts, exact : true},
  {path : '/locations/districts/createdistricts/:id',name:'Districts',component:addDistrict, exact : true},
  {path : '/locations/districts/updatedistrict/:id',name:'Districts',component:addDistrict, exact : true},
  {path : '/locations/cities', name: 'City List', component :cityList,exact : true},
  {path : '/locations/cities/addcity/cities', name: 'Cities', component :addCity,exact : true},
  {path : '/locations/cities/updatecity/cities/:id', name: 'Cities', component :addCity,exact : true},
  {path : '/extras/dropdown', name: 'Dropdown List', component :DropdownList,exact : true},
  {path : '/extras/dropdown/adddropdown/:id', name: 'Dropdowns', component :addDropdown,exact : true},
  {path : '/extras/dropdown/updatedropdown/:id', name: 'Dropdowns', component :addDropdown,exact : true},
  {path : '/extras/contactus', name: 'contact us', component :contactUs,exact : true},
  {path : '/cases/createcase', name: 'Cases', component :addCase,exact : true},
  {path : '/cases/searchcases', name: 'Search Case', component :searchCase,exact : true},
  {path : '/cases/updatecases/:id', name : 'Cases', component : addCase, exact: true},
  {path : '/cases/viewcases/:id', name : 'Accused', component : displayAccused, exact : true},
  {path : '/cases/accuses/updateaccused/:id', name : 'Accused', component : addAccused, exact : true},
  {path : '/cases/accuses', name : 'Accuses', component : allAccuses, exact : true},
  {path : '/cases/accuses/addaccused', name : 'Accused', component : addAccused, exact : true},
  {path : '/cases/accuses/uploadfle', name : 'Accused', component : fileuploadAccuses, exact : true},
  {path : '/management/roleslist', name : 'Roles', component : rolesList, exact : true},
  {path : '/management/roleslist/addpermission/:id', name : 'Permssions', component : permisson, exact : true},
  {path : '/management/roles/updaterole/:id', name : 'Permssions', component : permisson, exact : true},
  {path : '/customfields', name : 'customforms', component : customForm, exact : true},
  {path : '/customfields/addfields/:id', name : 'customforms', component : addForm, exact : true},
  {path : '/customfields/updatefields/:id', name : 'customforms', component : addForm, exact : true},
  {path : '/customfields/addform', name : 'customforms', component : implentForm, exact : true},
  { path:'/login', exact:true, name: "Login", component:Login},
  
];


export default routes;
