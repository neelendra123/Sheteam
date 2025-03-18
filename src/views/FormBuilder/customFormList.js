import React from "react";
import { Badge, Button, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { Link } from 'react-router-dom';
import axios from '../../containers/Axios/config';
import { AppSwitch } from '@coreui/react';
import swal from 'sweetalert';

class FormList extends React.Component {

    state = {
        formData: []
    }

    componentDidMount() {
        axios.get('http://localhost:3005/displayfields').then(res => {
            console.log(res.data);
            this.setState({
                formData: (res.data.data)
            })
        })
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
    toggleSwitch = (cell, row) => {
        return (
            <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value={row.status} checked={Boolean(row.status) === true ? true : false}
                onChange={(e) => { this.onChange(e, row) }}
            />
        )
    }

    onChange = (e, row) => {
        console.log(row);
        let data = row;
        data.status = !row.status;
        console.log(data);
        axios.put('http://localhost:3005/updateform/' + row._id, data).then(res => {
            console.log(res);
            if (res.status == 200) {
                if (row.status === true) {
                    swal('user enabled succefully!', row.form_name)
                }
                if (row.status == false) {
                    swal('user disabled succefully!', row.form_name)
                }
            }
            else {
                console.log(res);
            }
        }).catch((e) => {
            console.log(e);
            swal('OOPS!', e.response.data.message);
        })
    }

    actionsHandle = (cell, row) => {
        return (
            <span>
                <Link to={`/customfields/updatefields/${row._id}`}>
                    <i class="fa fa-pencil" aria-hidden="true"></i></Link>
            </span>
        )
    }

    render() {
        return (
            <>
                <Card>
                    <CardHeader>
                        <i className="icon-menu"></i> Dynamic Forms
                        <Link to='/customfields/addfields/new'>
                            <Button color="primary" align="right" className="float-right">Create Form</Button>
                        </Link>
                    </CardHeader>
                    <CardBody>
                        <BootstrapTable data={this.state.formData} striped={true} hover search pagination={true}>
                            <TableHeaderColumn isKey width="150px" dataField="form_name">Name</TableHeaderColumn>
                            <TableHeaderColumn width='140px' dataFormat={this.dateFormat}>Created Date</TableHeaderColumn>
                            <TableHeaderColumn width="80px" dataFormat={this.toggleSwitch}>Status</TableHeaderColumn>
                            <TableHeaderColumn width="80px" dataFormat={this.actionsHandle} >Actions</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                </Card>
            </>
        )
    }
}

export default FormList;