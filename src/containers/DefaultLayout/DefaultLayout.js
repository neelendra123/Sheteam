import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import {
  AppAside,
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
//import axios from 'axios';
import axios from '../../containers/Axios/config';
import { mainMenu,subMenu } from '../../menu';
import object from 'core-js/core/object';
const DefaultAside = React.lazy(() => import('./DefaultAside'));

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  state = {
    permissions : {canCreate : false, canView : false, canDelete : false, canUpdate : false},
    navItems : {items : []}
  }
  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;
  componentDidMount(){
    this.getRoleByid();
    if(!localStorage.getItem('token')){
      this.props.history.push('/login');
    }

  }

  getRoleByid = () => {
    let roleData = [];
    axios.get('http://localhost:3005/get/permissions/'+localStorage.getItem('userId')).then(res=>{
      // console.log(res.data);
      if(res.status == 200){
        Object.keys(res.data.data.data).map((key,index)=>{
          // console.log(key);
          let menuItem = mainMenu(key);
          if(res.data.data.data[key].isMenu == true && res.data.data.data[key].canView == true){
            roleData.push(menuItem);
          }
        })
        Object.keys(res.data.data.data).map((key,index)=>{
          // console.log(key);
          let subItem = subMenu(key);
          let menuItem = mainMenu(res.data.data.data[key].parent);
          //  console.log(subItem);
          //  console.log(menuItem);
          if(menuItem != null && res.data.data.data[key].isMenu == false && res.data.data.data[key].canView == true ){
            roleData.map((data,index)=>{
              // console.log(menuItem.name);
              //  console.log(data.name);
              // console.log(roleData[index].children);
              if(data.name == menuItem.name){
               
                // console.log(data);
                roleData[index].children.push(subItem);
              }
            })
          }
        })
        console.log(roleData);
        this.setState({
          navItems : {items : roleData}
        })
        // console.log(navigation);
      }
    }).catch((e)=>{
      console.log(e)
    })
  }

  
  
  signOut=()=>{
    localStorage.removeItem('useremail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    if(!localStorage.getItem('token')){
      this.props.history.push('/login');
    }
    
  }


  render() {
    console.log(this.state.navItems);
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={this.state.navItems} {...this.props} /> 
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                 
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        {/* <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter> */}
      </div>
    );
  }
}

export default DefaultLayout;
