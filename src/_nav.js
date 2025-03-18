export default {
  items: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: 'icon-home',
      badge: {
        variant: 'info',
       
      },
    },

    {
      name : 'Case',
      url  : '/cases',
      icon : 'fa fa-book',
      children : [
        {
          name : 'Add Case',
          url   : '/cases/createcase',
          icon  : 'fa fa-pencil'
        },
        {
          name : 'Search Case',
          url   : '/cases/searchcases',
          icon  : 'fa fa-search'
        },
        {
          name : 'Accuses',
          url   : '/cases/accuses',
          icon  : 'fa fa-male'
        }
      ]
    },

    {
    name: 'Management',
      url: '/management',
      icon: 'fa fa-users',
      children: [
         {
         name: 'Users',
         url: '/ListOfUsers/UsersList',
         icon: 'fa fa-user',
        },
        {
          name: 'Roles/Permissions',
          url: '/management/roleslist',
          icon: 'fa fa-gear',
         }
        
  
      ]
    },

    {
      name : 'Locations',
      url  : '/locations',
      icon : 'fa fa-map-marker'	
      ,
      children: [
        {
        name: 'Districts',
        url: '/locations/districts',
        icon: 'fa fa-building',
       },
       {
        name: 'Cities',
        url: '/locations/cities',
        icon: 'fa fa-map-pin',
       }
     ]
    },
    {
      name : 'Extras',
      url  : '/extras',
      icon : 'fa fa-code',
      children : [
        {
          name : 'Dropdown',
          url   : '/extras/dropdown',
          icon : 'fa fa-toggle-down'
        },
        {
          name : 'Contact US!',
          url   : '/extras/contactus',
          icon : 'fa fa-pencil-square-o'
        }
      ]
    },
    {
      name : 'Custom Forms',
      url  : '/customfields',
      icon : 'fa fa-cogs',

      children : [
        {
          name : 'Add Forms',
          url  : '/customfields',
          icon : 'fa fa-cogs',
        },
        {
          name : 'Use Form',
          url  : '/customfields/addform',
          icon : 'fa fa-pencil-square-o'
        }
      ]
    }
  ]
};
