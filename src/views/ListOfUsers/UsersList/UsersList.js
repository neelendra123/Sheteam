import React, { Component } from 'react';
import axios from '../../../containers/Axios/config';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Badge, Button,Card, CardBody, CardHeader} from 'reactstrap';
import {Link} from 'react-router-dom';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';

class UsersList extends Component {
  state = {
    users: []
  }
    constructor(props) {
      super(props);
      
      this.options = {
        sortIndicator: true,
        hideSizePerPage: false,
        paginationSize: 3,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: false,
        sizePerPage: 5,
      }
  
    }
        componentDidMount() {
           axios.get('http://localhost:3005/all/users?page=1&limit=5')
            .then((res) => {
              this.setState({ users: (res.data.docs) })
              console.log(this.state.users)
            })
            .catch(err => console.log(err))
        }


    
     editUser=(cell,row)=>{
      return  <nav><Link to = {'/edit/user/'+row._id}> Edit </Link>  </nav>  ;
      }

      statusState=(cell,row)=>{
        console.log(row.status);
         if(row.status === true){
           return <Badge color="success" pill>Active</Badge>;
         }
         else{
           return <Badge color="danger" pill>Inactive</Badge>;
         }
      }
    
    // deleteUser= (row) => {

    //   var singleUser= this.state.users.indexOf(row);
    //   this.state.users.splice(singleUser,1);
    //   this.setState({users: this.state.users});

    // }
    render() {
    //console.log(this.users);
     console.log(this.state.users);
     
      return (
        <div className="animated">
          <Card>
            <CardHeader>
              <i className="icon-menu"></i>Users
              <Link to ='/create/user'>
                 <Button color="primary" align="right" className="float-right">Add User</Button>
               </Link>
              
            </CardHeader>
            <CardBody>
              <BootstrapTable data={this.state.users} version="4" striped={true} hover search pagination={true} options={this.options} >
                <TableHeaderColumn dataField="fullname" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="username" dataSort>Username</TableHeaderColumn>
                <TableHeaderColumn isKey dataField="email">Email</TableHeaderColumn>
                <TableHeaderColumn dataField="created_at" dataSort>Created Date</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.statusState} dataSort>Status</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.editUser} >Actions</TableHeaderColumn>
              </BootstrapTable>
            </CardBody>
          </Card>
        </div>
      );
    }
  }
  

export default UsersList;
