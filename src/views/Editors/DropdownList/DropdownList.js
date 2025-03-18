import React, { Component } from 'react';
import { Button,Badge, Card, CardBody, CardHeader,} from 'reactstrap';
import {Link} from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import axios from '../../../containers/Axios/config';

class Tables extends Component {
  state= {
    dropdowns: []
  }
  constructor(props) {
    super(props);
    
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false
    }
  }
  componentDidMount(){
    axios.get('http://localhost:3005/get/all/dropdowns')
    .then((res) => {
      this.setState({dropdowns: res.data})
      console.log(this.state.dropdowns)
    })
    .catch(err => console.log(err))
  }
  editDropDown=(cell,row) => {
    console.log(row);
    return <nav><Link to = {'/editors/addDropdown/'+row._id}> <Button color="primary">Edit </Button> </Link> </nav>  ;
  }
  // deleteDropdown=(e1, row1) => {
    
  //   console.log(row1);
  //   axios.delete('http://localhost:3000/delete/dropdown/'+row1)
  //   .then((res) => {
  //      console.log(res.status);
  //      this.setState();
  //    })
  // }
  dropdownStatus=(cell,row)=>{
    console.log(row.status);
     if(row.status === true){
       return <Badge color="success" pill>Active</Badge>;
     }
     else{
       return <Badge color="danger" pill>Inactive</Badge>;
     }
  }

  render() {
    return (
      <div className="animated">
      <Card>
        <CardHeader>
          <i className="icon-menu"></i>Users
          <Link to ='/editors/addDropdown'>
             <Button color="primary" align="right" className="float-right">Add Dropdown</Button>
           </Link>
          
        </CardHeader>
        <CardBody>
          <BootstrapTable data={this.state.dropdowns} version="4" striped hover pagination search options={this.options} >
            <TableHeaderColumn isKey dataField="dropdown_name" dataSort>Dropdown Value</TableHeaderColumn>
            <TableHeaderColumn dataField="type" dataSort>Dropdown Type</TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.dropdownStatus}dataSort>Status</TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.editDropDown} >Actions</TableHeaderColumn>
            
           
          </BootstrapTable>
        </CardBody>
      </Card>
    </div>

    );
  }
}

export default Tables;
