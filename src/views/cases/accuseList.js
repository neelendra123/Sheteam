import React from 'react';
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
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import axios from '../../containers/Axios/config';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { displayAccuses } from './accusesSlice';
import { connect } from 'react-redux';
class accuseList extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        accuseslist: [],
        selectedFile: '',
        permissions: { canCreate: false, canView: false, canDelete: false, canUpdate: false }
    }

    componentDidMount() {
        axios.get('http://localhost:3005/displayaccused/'+localStorage.getItem('roleId')).then(res => {
            // console.log(res.data);
            this.props.reduxData(res.data.data.data);
            if (res.status == 200) {
                if(res.data.data.permissions.canView == true){
                    this.setState({
                        accuseslist: (res.data.data.data),
                        permissions : res.data.data.permissions
                        
                    })
                }
                else{
                    swal('OOPS', 'you are not authenticate user to view accuses!');
                    this.props.history.push('/');
                }
              
            }
        }).catch((e)=>{
            console.log(e);
        })
    }

    deleteAccused = (cell, row) => {
        console.log(row);
        swal({
            title: "Are you sure?",
            text: "Are you sure you want delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                axios.delete(`http://localhost:3005/deleteaccused/${row}`).then(res => {
                    console.log(res.data);
                    if (res.status == 200) {
                        this.setState({
                            accuseslist: (res.data.data)
                        })
                    }

                }).catch((e) => {
                    console.log(e);
                })
            }
        })
    }

    district = (cell, row) => {
        // console.log(row);
        if(row.district){
            return (
                <div>{row.district.dist_name}</div>
            )
        }
        else{
            return <div></div>
        }
       
    }
    city = (cell, row) => {
        if(row.city){
            return (
                <div>{row.city.city}</div>
            )
        }
        else{
            return <div></div>
        }
    }

    actions = (cell, row) => {
        return (
            <span>
                {this.state.permissions.canUpdate ?
                <Link to={`/cases/accuses/updateaccused/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
                : null}
                {this.state.permissions.canDelete ?
                <i class="fa fa-trash" aria-hidden="true" style={{ marginLeft: '10px' }} onClick={() => { this.deleteAccused(cell, row._id) }} ></i>
                : null}
                </span>
        )
    }
    render() {
        console.log(this.state.accuseslist);
        const options = {
            noDataText: 'Empty Table',
            sortName: this.state.name
        };
        return (
            <>
                <Card>
                    <CardHeader>
                        <strong>
                            <i className="icon-menu"></i> Accused Details
                        </strong>
                        {this.state.permissions.canCreate ?
                        <Link to={`/cases/accuses/addaccused`}>
                            <Button color="primary" align="right" className="float-right">Add Accused</Button>
                        </Link>
                        : null}
                        <Link to={'/cases/accuses/uploadfle'}>
                            <Button color="secondary" align="right" className="float-right" style={{ marginRight: '10px' }}>File Upload</Button>
                        </Link>
                    </CardHeader>
                    <CardBody>
                        <BootstrapTable data={this.state.accuseslist} striped={true} options={options} hover search pagination={true} exportCSV csvFileName='table-export.csv' deleteRows >
                            {/* <TableHeaderColumn width='80px'  dataField="id" dataFormat={this.indexNum}>S.No</TableHeaderColumn> */}
                            <TableHeaderColumn isKey dataField="name" dataSort>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="father_name" dataSort>Father Name</TableHeaderColumn>
                            <TableHeaderColumn width='60px' dataField="age">Age</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.district}>District</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.city}>City</TableHeaderColumn>
                            <TableHeaderColumn dataField='address' >Address</TableHeaderColumn>
                            <TableHeaderColumn dataField='profession' >Profession</TableHeaderColumn>
                            <TableHeaderColumn dataField='contact' >Contact</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.actions} >Actions</TableHeaderColumn>
                        </BootstrapTable>

                    </CardBody>
                </Card>
            </>
        )
    }

}

const mapDispatchToProps = dispatch =>{
    return {
      reduxData : (values) => dispatch(displayAccuses(values))
    }
  }

export default connect(null,mapDispatchToProps)(accuseList);