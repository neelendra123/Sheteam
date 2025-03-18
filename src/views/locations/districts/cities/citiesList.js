import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from '../../../../containers/Axios/config'
import { BootstrapTable ,TableHeaderColumn, DeleteButton} from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
import { Badge, Button,Card, CardBody, CardHeader} from 'reactstrap';
import {AppSwitch} from '@coreui/react';
import { displayCities } from "./citySlice";
import { connect } from "react-redux";
function City(props){
        const [city,setCity] = useState(
          {city : '',
          permissions : {canCreate : false, canView : false, canDelete : false, canUpdate : false} 
        });
        
        useEffect(()=>{
            axios.get('http://localhost:3005/displaycities/'+localStorage.getItem('roleId')).then(res=>{
                 console.log(res.data);
                 props.reduxData(res.data.data.data);
                 if(res.status == 200){
                   if(res.data.data.permissions.canView == true){
                    setCity({
                      city : res.data.data.data,
                      permissions : res.data.data.permissions
                    });
                   }
                   else{
                    swal('sorry, you dont have the permission to view cities!');
                    props.history.push('/');
                   }
                 }
               
            }).catch((e)=>{
              console.log(e);
              console.log(e.response);
              if(e.response.status == 500){
                swal('Oops!',`${e.response.data.error}` );
              }
            if(e.response.status == 401){
              swal('Oops!',`${e.response.data.error}` );
              this.props.history.push('/login');
            }
            })
        },[]);

    let indexNum = (cell, row, enumObject, index) => {
        let row_index = (index+1);
       
        return (<div>{row_index}</div>) 
      }
      const district =(cell,row)=>{
        if(row.dist_id){
          return(
            <div>{row.dist_id.dist_name}</div>
          )
        }
          else{
            return <div></div>
          }
      }
      let actionsHandle = (cell,row) => {

        return(
          <span>
            {city.permissions.canUpdate ?
          <Link to={`/locations/cities/updatecity/cities/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
            : null}
            {city.permissions.canDelete ?
          <i class="fa fa-trash" aria-hidden="true" style={{marginLeft : '10px'}} onClick = {()=>deleteCity(cell,row)}></i>
            : null}
          </span>
        )
      }
      let deleteCity = (cell,row)=>{
        // console.log(row);
          swal({
            title: "Are you sure?",
            text: "Are you sure you want delete?",
            icon: "warning",
            buttons : true,
            dangerMode: true
          }).then(willDelete=>{
            if(willDelete){
              axios.delete(`http://localhost:3005/deletecity/${row._id}`).then(res=>{
                console.log(res.data);
                setCity(res.data.data);
              })
            }
          }).catch((e)=>{
            console.log(e);
            swal('OOPS', `${e.response.data.message}`);
          });
      }

      let toggleSwitch = (cell,row) => {

       if(row){
        return(
          <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value= {row.status}  checked= {Boolean(row.status) === true? true : false} 
          onChange ={(e)=>{onChange(e,row)}}
          />
        )
       }
       else{
         return <div></div>
       }
      }
  
      let onChange = (e,row) => {
        let data = row;
        data.status = !row.status;
        axios.put('http://localhost:3005/updatecity/'+row._id,data).then(res=>{
          console.log(res.data);
          if(res.status == 200){
            if(row.status === true){
              swal('city enabled succefully!', row.city)
            }
            if(row.status == false){
              swal('city disabled succefully!',row.city)
            }
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
               <i className="icon-menu"></i>Cities
               {city.permissions.canCreate ?
               <Link to ='/locations/cities/addcity/cities'>
                 <Button color="primary" align="right" className="float-right">Add City</Button>
               </Link>
                : null}
               </CardHeader>
               <CardBody>
               <BootstrapTable  data={city.city} striped={true}  hover search pagination={true}   >
                <TableHeaderColumn width="40px"  dataFormat={indexNum} dataSort>S No</TableHeaderColumn>
                <TableHeaderColumn width="150px" isKey dataField="city" dataSort>City</TableHeaderColumn>
                <TableHeaderColumn  width="150px" dataFormat={district}>Dist_Name</TableHeaderColumn> 
                <TableHeaderColumn  width="40px" dataFormat={toggleSwitch} >Status</TableHeaderColumn>
                <TableHeaderColumn  width="40px" dataFormat={actionsHandle} >Actions</TableHeaderColumn>
              </BootstrapTable>
            </CardBody>
            </Card>
        </>
    );
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(displayCities(values))
  }
}

export default connect(null,mapDispatchToProps)(City);