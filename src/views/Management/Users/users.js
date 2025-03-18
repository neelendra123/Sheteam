import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../../containers/Axios/config';
import { BootstrapTable ,TableHeaderColumn, DeleteButton} from 'react-bootstrap-table';
import { Modal } from 'bootstrap';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Badge, Button,Card, CardBody, CardHeader,Row,Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; 
import swal from 'sweetalert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {AppSwitch} from '@coreui/react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import ModalExample from './userModal';
import { displayUsers } from './userSlice';
import { connect } from 'react-redux';
class Users extends React.Component{
    state = {
        users : [],
        selectedRows : [],
        show : false,
        permissions : {canCreate : false, canView : false, canDelete : false, canUpdate : false}
    }

    constructor(props){
        super(props);
        // console.log(props);
        this.options = {
            noDataText: 'Empty Table'
        }
        
    }

    componentDidMount(){
        axios.get('http://localhost:3005/displayusers/'+localStorage.getItem('roleId')).then(res=>{
            console.log(res.data);
            this.props.reduxData(res.data.data.data);
            if(res.status == 200){
              if(res.data.data.permissions.canView == true){
                this.setState({
                  users : (res.data.data.data),
                  permissions : res.data.data.permissions
              });

              }
              else{
  
                swal('sorry, you dont have the permission to view users!');
                this.props.history.push('/');
              }
              
            }
        }).catch((e)=>{
            console.log(e.response);
            if(e.response.status == 401){
              swal('Oops!',`${e.response.data.error}` );
              this.props.history.push('/login');
            }
        })
    }
 
    dateFormat = (cell,row) => {
      var timestamp = new Date(row.createdAt);
      
      var month = timestamp.getDate();
      var year = timestamp.getFullYear();
      var options = { month: 'long'};
      let month2 =new Intl.DateTimeFormat('en-US', options).format(timestamp);
     
     return(
       <p>{month} {month2} {year}</p>
     )

    }

    rolename = (cell,row) =>{
      if(row.role_id){
        return(
          <div>{row.role_id.role_name}</div>
        )
      }
      else{
        return <div></div>
      }

      
    }
    deleteUser = (cell,row) => {
      // console.log(row);
      swal({
        title: "Are you sure?",
        text: "Are you sure you want delete?",
        icon: "warning",
        buttons : true,
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
        axios.delete(`http://localhost:3005/deleteusers/${row}`).then(res=>{
        if(res.status == 200){
          this.setState({users:res.data.data});
        }
        else{
          console.log(res);
        }
      }).catch((e)=>{
        if(e.status == 500){
          swal('OOPS!',e.response.data.message);
        }
          
      })
          swal("Deleted!", "Your imaginary file has been deleted!", "success");
        }
       
      });
      
    }
    deleteUser1 = (cell,row) => {
      return <i class="fa fa-trash" aria-hidden="true" onClick={()=>{this.deleteUser(cell,row._id)}} ></i>
    }
    
 actionsHandle = (cell,row) => {
   return (
     <span>
       {this.state.permissions.canUpdate ? 
       <Link to={`/ListOfUsers/UsersList/edit/${row._id}`}>
         <i class="fa fa-pencil" aria-hidden="true"></i></Link> : null}
         {this.state.permissions.canDelete ? 
       <i class="fa fa-trash" aria-hidden="true" style={{marginLeft : '10px'}} onClick={()=>{this.deleteUser(cell,row._id)}} ></i>
         : null}
       </span>
   )
 }

indexNum = (cell, row, enumObject, index) => {
  let row_index = (index+1);
 
  return (<div>{row_index}</div>) 
}


toggleSwitch = (cell,row) => {
  return(
    <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value= {row.status}  checked= {Boolean(row.status) === true? true : false} 
    onChange ={(e)=>{this.onChange(e,row)}}
    />
  )
}

 onChange = (e,row) => {
   let data = row;
   data.status = !row.status;
   console.log(data);
   
   axios.put('http://localhost:3005/updateuser/'+row._id,data).then(res=>{
     console.log(res);
     if(res.status == 200){
      if(row.status === true){
        swal('user enabled succefully!', row.name)
      }
      if(row.status == false){
        swal('user disabled succefully!',row.name)
      }
     }
     else{
       console.log(res);
     }
   }).catch((e)=>{
     console.log(e);
     swal('OOPS!',e.response.data.message);
   })
}
onSelect = ()=> (row, isSelect, e) => {
  // console.log(row);
  var data = [...this.state.selectedRows];
  if (isSelect) {
    // console.log(row)
    data.push({ ...row });
  } else {
    data.map((key, index) => {
      if (key && key._id === row._id) data.splice(index, 1);
    });
  }
  this.setState({ selectedRows: data });
}
onSelectAll = () => (isSelect, rows, e) => {
  var data = [...this.state.selectedRows];
  if (isSelect) {
    if (data.length == 0) data = [...rows];
    else data.push(...rows);
  } else {
    let selectedData = [];
    data.map((key) => {
      let flag = 0;
      rows.map((row) => {
        if (row._id === key._id) {
          flag++;
        }
      });
      if (flag === 0) {
        selectedData.push(key);
      }
    });
    data = selectedData;
  }
  this.setState({ selectedRows: data });
}
exportToExcel = () => {
 
  const fileType = "xlsx";
  const ws = XLSX.utils.json_to_sheet(this.state.selectedRows);
  const wb = {Sheets: {data : ws}, SheetNames : ["data"]};
  const excelBuffer = XLSX.write(wb, {bookType: 'xlsx',type : 'array'});
  const data = new Blob([excelBuffer], {type: fileType});
  FileSaver.saveAs(data, "myfile" + ".xlsx");
}

    render(){
        console.log(this.state.selectedRows);
        const options = {
            onRowClick: this.onRowClick,
            withoutNoDataText: true,
            columnWidth: '60px',
          }
          const selectRow = {
             mode: 'checkbox',
            columnWidth: '60px',
            onSelect: this.onSelect(),
            onSelectAll : this.onSelectAll()
          };
      
        return(
            <>
            <Card>
               <CardHeader>
                <i className="icon-menu"></i> Users
                {this.state.permissions.canCreate ? 
               <Link to ='/ListOfUsers/UsersList/createusers/new'>
                 <Button color="primary" align="right" className="float-right">Add User</Button>
               </Link> : null }
               <Button type='button' style={{float : 'right' ,marginRight : '5px'}} onClick={this.exportToExcel}>Export</Button>
               <div style={{float : 'right' ,marginRight : '5px'}}> <ModalExample/></div>
               </CardHeader>
               <CardBody>
               <BootstrapTable  
               data={this.state.users} striped={true}  
               hover search pagination={true} options={options}  
               selectRow={ selectRow } deleteRows >
               <TableHeaderColumn width='80px'  dataField="id" dataFormat={this.indexNum}>S.No</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort>Full Name</TableHeaderColumn>
                <TableHeaderColumn width='120px' dataField="username" dataSort>Username</TableHeaderColumn>
                <TableHeaderColumn isKey dataField="email">Email Address</TableHeaderColumn>
                <TableHeaderColumn width='120px' dataFormat={this.rolename} dataSort>Role Name</TableHeaderColumn>
                <TableHeaderColumn width='140px' dataFormat={this.dateFormat}>Created Date</TableHeaderColumn>
                <TableHeaderColumn width='80px' dataFormat={this.toggleSwitch}>Status</TableHeaderColumn>
                <TableHeaderColumn  width='100px' dataFormat={this.actionsHandle} >Actions</TableHeaderColumn>
              </BootstrapTable>
            </CardBody>
            </Card>
            </>
        )
    }
}
const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(displayUsers(values))
  }
}

export default connect(null, mapDispatchToProps)(Users);