import React from 'react';
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import axios from '../containers/Axios/config';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import swal from 'sweetalert';
import { displayRoles } from './rolesSlice';
import { connect } from 'react-redux';
class RolesList extends React.Component {
    state = {
        roles: [],
        permissions : {canCreate : false, canView : false, canDelete : false, canUpdate : false}
    }
    componentDidMount() {
        axios.get('http://localhost:3005/getallRoles').then(res => {
            console.log(res.data);
            this.props.reduxData(res.data.data);
            this.setState({
                roles: (res.data.data)
            })
        }).catch((e) => {
            console.log(e)
        })

        axios.get('http://localhost:3005/displayonerole/'+localStorage.getItem('roleId')).then(res=>{
            // console.log(res.data);
            if(res.status == 200){
                if(res.data.data.data.permissions.canView == true){
                    this.setState({
                        permissions : {canCreate : res.data.data.data.permissions.canCreate,
                            canView : res.data.data.data.permissions.canView,
                            canDelete :res.data.data.data.permissions.canDelete,
                            canUpdate : res.data.data.data.permissions.canUpdate
                        }
                    })
                }
                else{
                    swal('OOPS!', 'you dont have authrization');
                }
            }
           
        }).catch((e)=>{
            console.log(e);
        })
    }

    indexNum = (cell, row, enumObject, index) => {
        let row_index = (index + 1);

        return (<div>{row_index}</div>)
    }
    dateFormat = (cell, row) => {
        var timestamp = new Date(row.createdAt);

        var month = timestamp.getDate();
        var year = timestamp.getFullYear();
        var options = { month: 'long' };
        let month2 = new Intl.DateTimeFormat('en-US', options).format(timestamp);

        return (
            <p>{month} {month2} {year}</p>
        )

    }

    createdByField = (cell, row) => {
        // console.log(row);
        if (row.createdBy) {
            return (
                <div>{row.createdBy.username}</div>
            )
        }
        else {
            return  <div></div>
           
        }
    }

    deleteRole = (cell, row) => {
        // console.log(row);
        swal({
            title: "Are you sure?",
            text: "Are you sure you want delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                axios.delete(`http://localhost:3005/deleterole/${row}`).then(res => {
                    console.log(res.data);
                    if (res.status == 200) {
                        this.setState({
                            roles: (res.data.data)
                        })
                    }
                }).catch((e) => {
                    console.log(e);
                })
            }
        })
    }


    actionsHandle = (cell, row) => {
        return (
            <span>
                {this.state.permissions.canUpdate ?
                <Link to={`/management/roles/updaterole/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
                : null}
                {this.state.permissions.canDelete ?
                <i class="fa fa-trash" aria-hidden="true" style={{marginLeft : '10px'}} onClick={()=>{this.deleteRole(cell,row._id)}} ></i>
                :null}
                </span>
        )
    }

    render() {
        
        return (
            <>
                <Card>
                    <CardHeader>
                        {this.state.permissions.canCreate ?
                        <Link to={`/management/roleslist/addpermission/new`}>
                            <Button color="primary" align="right" className="float-right">Create Permission</Button>
                        </Link>
                        :null}
                    </CardHeader>
                    <BootstrapTable data={this.state.roles} striped={true} hover pagination={true}  >
                        <TableHeaderColumn isKey  width='70px' dataField="id" dataFormat={this.indexNum}>S.No</TableHeaderColumn>
                        <TableHeaderColumn dataField="role_name" dataSort>Role Name</TableHeaderColumn>
                        <TableHeaderColumn dataFormat= {this.createdByField} dataSort>Created By</TableHeaderColumn>
                        <TableHeaderColumn width='140px' dataFormat={this.dateFormat}>Created Date</TableHeaderColumn>
                        <TableHeaderColumn  width='100px' dataFormat={this.actionsHandle} >Actions</TableHeaderColumn>
                    </BootstrapTable>
                </Card>


            </>
        )
    }
}
const mapDispatchToProps = dispatch =>{
    return {
      reduxData : (values) => dispatch(displayRoles(values))
    }
  }


export default connect(null,mapDispatchToProps)(RolesList);