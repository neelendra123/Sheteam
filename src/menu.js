import React from "react";

export const mainMenu = (caseValue) => {
    switch (caseValue) {
        case 'dashboard':
            return {
                name: 'Home',
                url: '/dashboard',
                icon: 'icon-home',
                badge: {
                    variant: 'info',
                }
            }

            break;
        case 'cases':
            return {
                name: 'Case',
                url: '/cases',
                icon: 'fa fa-book',
                children: []
            }
            break;
        case 'management':
            return {
                name: 'Management',
                url: '/management',
                icon: 'fa fa-users',
                children: []
            }
            break;
        case 'locations':
            return {
                name: 'Locations',
                url: '/locations',
                icon: 'fa fa-map-marker',
                children: []
            }
            break;
        case 'extras':
            return {
                name: 'Extras',
                url: '/extras',
                icon: 'fa fa-code',
                children: []
            }
            break;
        case 'customforms' :
            return {
                name : 'Custom Forms',
                url  : '/customfields',
                icon : 'fa fa-cogs',
                children: []
            }
            break;
        default:
            break;
       
    }

}

export const subMenu = (caseValue) => {
    switch (caseValue) {
        case 'addCase':
            return {
                name: 'Add Case',
                url: '/cases/createcase',
                icon: 'fa fa-pencil'
            }
            break;
        case 'searchCase':
            return {
                name: 'Search Case',
                url: '/cases/searchcases',
                icon: 'fa fa-search'
            }
            break;
        case 'accused':
            return {
                name: 'Accuses',
                url: '/cases/accuses',
                icon: 'fa fa-male'
            }
            break;
        case 'users':
            return {
                name: 'Users',
                url: '/ListOfUsers/UsersList',
                icon: 'fa fa-user'
            }
            break;
        case 'permissions':
            return {
                name: 'Roles/Permissions',
                url: '/management/roleslist',
                icon: 'fa fa-gear'
            }
            break;
        case 'district':
            return {
                name: 'Districts',
                url: '/locations/districts',
                icon: 'fa fa-building'
            }
            break;
        case 'city':
            return {
                name: 'Cities',
                url: '/locations/cities',
                icon: 'fa fa-map-pin'
            }
            break;
        case 'dropdowns':
            return {
                name: 'Dropdown',
                url: '/extras/dropdown',
                icon: 'fa fa-toggle-down'
            }
            break;
        case 'contactUs':
            return {
                name: 'Contact US!',
                url: '/extras/contactus',
                icon: 'fa fa-pencil-square-o'
            }
            break;
        case 'addforms' :
            return {
                name : 'Add Forms',
                url  : '/customfields',
                icon : 'fa fa-cogs',
            }
            break;
        case 'useforms' :
            return {
                name : 'Use Form',
                url  : '/customfields/addform',
                icon : 'fa fa-pencil-square-o'
            }
            break;
        default:
            break;
    }
}

