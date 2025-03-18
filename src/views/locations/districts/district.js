import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from '../../../containers/Axios/config';
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader } from 'reactstrap';
import swal from 'sweetalert';
import { AppSwitch } from '@coreui/react';
import { displayDistricts } from "./districtSlice";
import { connect } from "react-redux";
function getDistricts(props) {

  const [district, setDistrict] = useState({
    district: '',
    permissions: { canCreate: false, canView: false, canDelete: false, canUpdate: false }
  });

  useEffect(() => {
    axios.get('http://localhost:3005/displaydistricts/' + localStorage.getItem('roleId')).then(res => {
      console.log(res.data);
      props.reduxData(res.data.data.data);
      if (res.status == 200) {
        if (res.data.data.permissions.canView == true) {
          setDistrict({
            district: res.data.data.data,
            permissions: res.data.data.permissions
          });
        }
        else {
          swal('sorry, you dont have the permission to view districts!');
          props.history.push('/');
        }

      }

    }).catch((e) => {
      console.log(e);
      if (e.response.status == 401) {
        swal('Oops!', `${e.response.data.error}`);
        props.history.push('/login');
      }


    })
  }, [setDistrict]);
  console.log(district);

  let deleteDistrict = (cell, row) => {

    swal({
      title: "Are you sure?",
      text: "Are you sure you want delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        axios.delete(`http://localhost:3005/deletedistrict/${row._id}`).then(res => {
          console.log(res.data);
          if (res.status == 200) {
            swal('district deleted successfully!');
            setDistrict(res.data.data);
          }

        }).catch((e) => {
          console.log(e);
          swal("Oops!", e.response.data.message, "error");

        })
      }
      else {

      }
    })
  }

  let actionsHandle = (cell, row) => {
    return (
      <span>
        {district.permissions.canUpdate ?
          <Link to={`/locations/districts/updatedistrict/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
          : null}
        {district.permissions.canDelete ?
          <i class="fa fa-trash" aria-hidden="true" style={{ marginLeft: '10px' }} onClick={() => deleteDistrict(cell, row)}></i>
          : null}
      </span>
    );
  }
  let indexNum = (cell, row, enumObject, index) => {
    let row_index = (index + 1);

    return (<div>{row_index}</div>)
  }

  let toggleSwitch = (cell, row) => {

    return (
      <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value={row.status} checked={Boolean(row.status) === true ? true : false}
        onChange={(e) => { onChange(e, row) }}
      />
    )
  }

  let onChange = (e, row) => {
    let data = row;
    data.status = !row.status;
    
    axios.put('http://localhost:3005/updatedistricts/' + row._id, data).then(res => {
      console.log(res.data);
      if(res.status == 200){
        if(row.status === true){
          swal('district enabled succefully!',row.dist_name)
        }
        if(row.status == false){
          swal('district disabled succefully!',row.dist_name)
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

  return (
    <>
      <Card>
        <CardHeader>
          <i className="icon-menu"></i>Districts
          {district.permissions.canCreate ?
            <Link to='/locations/districts/createdistricts/new'>
              <Button color="secondary"  align="right" className="float-right">Add District</Button>
            </Link>
            : null}
        </CardHeader>
        <CardBody>
          <BootstrapTable data={district.district} striped={true} hover search pagination={true}   >
            <TableHeaderColumn width="20px" dataFormat={indexNum} dataSort>S No</TableHeaderColumn>
            <TableHeaderColumn width="200px" isKey dataField="dist_name" dataSort>District</TableHeaderColumn>
            <TableHeaderColumn width="30px" dataFormat={toggleSwitch} >status</TableHeaderColumn>
            <TableHeaderColumn width="40px" dataFormat={actionsHandle} >Actions</TableHeaderColumn>
          </BootstrapTable>
        </CardBody>
      </Card>
    </>
  )
}


const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(displayDistricts(values))
  }
}
export default connect(null,mapDispatchToProps)(getDistricts);