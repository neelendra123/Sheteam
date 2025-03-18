import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from '../../containers/Axios/config';
import { BootstrapTable ,TableHeaderColumn, DeleteButton} from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
import { Badge, Button,Card, CardBody, CardHeader} from 'reactstrap';
import {AppSwitch} from '@coreui/react';
import { displayDropdown } from "./dropdownSlice";
import { connect } from "react-redux";
function dropdown(props){

    const [dropdown,setDropdown] = useState({
    dropdown : '',
    permissions : {canCreate : false, canView : false, canDelete : false, canUpdate : false} 
  });

    useEffect(()=>{
        axios.get('http://localhost:3005/displaydropdown/'+localStorage.getItem('roleId')).then(res=>{
            console.log(res.data);
            props.reduxData(res.data.data.data);
            if(res.status == 200){
              if(res.data.data.permissions.canView == true){
                setDropdown({
                  dropdown : res.data.data.data,
                  permissions : res.data.data.permissions
                });
              }
              else{
                swal('OOPS!', 'you are not authenticate user to display dropdowns');
                props.history.push('/');
              }
            }
            
        }).catch((e)=>{
            console.log(e);
            console.log(e.response);
            
            if(e.response.status == 401){
              swal('Oops!',`${e.response.data.error}` );
              this.props.history.push('/login');
            }
        });
    },[])

    let indexNum = (cell, row, enumObject, index) => {
      // console.log(cell, row, enumObject,index);
      
        let row_index = (index+1);
       
        return (<div>{row_index}</div>) 
      }

      let actionsHandle = (cell,row) => {
        return(
          <span>
            {dropdown.permissions.canUpdate ?
            <Link to={`/extras/dropdown/updatedropdown/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
            :null}
            {dropdown.permissions.canDelete ?
            <i class="fa fa-trash" aria-hidden="true" style={{marginLeft : '10px'}} onClick = {()=>deletedropdown(cell,row)}></i>
            : null}
            </span>
        )

      }
      let deletedropdown = (cell,row)=>{
        swal({
            title: "Are you sure?",
            text: "Are you sure you want delete?",
            icon: "warning",
            buttons : true,
            dangerMode: true,
          }).then(willDelete=>{
            if (willDelete) {
                axios.delete(`http://localhost:3005/deletedropdown/${row._id}`).then(res=>{
                     console.log(res.data);
                     if(res.status == 200){
                      setDropdown(res.data.data);
                     }
                    
             }).catch((e)=>{
                     console.log(e);
                     swal('OOPS!',e.response.data.message);
            })
            }
            else{
    
            }
          })
    }

    let toggleSwitch = (cell,row) => {

      return(
        <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value= {row.status}  checked= {Boolean(row.status) === true? true : false} 
        onChange ={(e)=>{onChange(e,row)}}
        />
      )
    }
    let onChange = (e,row) => {
      let data = row;
      data.status = !row.status;

      axios.put('http://localhost:3005/updatedropdown/'+row._id,data).then(res=>{
        console.log(res.data);
        if(res.status == 200){
          if(row.status === true){
            swal('dropdown enabled succefully!',row.value);
          }
          if(row.status == false){
            swal('dropdown disabled succefully!',row.value);
          }
         }
         else{
           console.log(res);
         }
      }).catch((e)=>{
        console.log(e);
        swal('OOPS', `${e.response.data.message}`);
      })

    }
    

    return(
        <>
        <Card>
             <CardHeader>
             <i className="icon-menu"></i>Dropdown
             {dropdown.permissions.canCreate ?
             <Link to ='/extras/dropdown/adddropdown/new'>
               <Button color="primary" align="right" className="float-right">Add Dropdown</Button>
             </Link>
              :null}
             </CardHeader>
             <CardBody>
             <BootstrapTable  data={dropdown.dropdown} striped={true}  hover search pagination={true}   >
              <TableHeaderColumn width="60px"  dataFormat={indexNum} dataSort>S No</TableHeaderColumn>
              <TableHeaderColumn width="150px" isKey dataField="value" dataSort>Dropdown Value</TableHeaderColumn>
              <TableHeaderColumn  width="150px" dataField="DropdownType">Dropdown Type</TableHeaderColumn> 
              <TableHeaderColumn  width="80px" dataFormat={toggleSwitch}>Status</TableHeaderColumn> 
              <TableHeaderColumn  width="80px" dataFormat={actionsHandle} >Actions</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
          </Card>
      </>
    );
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(displayDropdown(values))
  }
}

export default connect(null,mapDispatchToProps)(dropdown);