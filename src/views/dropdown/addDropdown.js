import React from "react";
import { useState,useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
  } from 'reactstrap';
  import axios from '../../containers/Axios/config';
  import Select from "react-select";
  import makeAnimated from 'react-select/animated';

  // import "react-select/dist/react-select.min.css";
  import swal from 'sweetalert';
  import {AppSwitch} from '@coreui/react';
import { createDrodown } from "./dropdownSlice";
import { connect } from "react-redux";
  function addDropdown(props){
   
    let [dropdown,setDropdown] = useState({
        id: props.match.params.id,
        value : "",
        DropdownType : "",
        status : true,
        title : '',
        dropdown_errors : {}
    });

    let [errors,setErrors] = useState({
      valueError : '',
      DropdownTypeError : ''
    })
   
    let options = [{ value: 'Case Type', label: 'Case Type' },
    { value: 'Case Status', label: 'Case Status' }]

    let handleChange = (e) => {
        console.log(e);
        if (e.target.name == "value") {
            if (e.target.value == "") {
            errors.valueError = 'please enter value';
             dropdown.value = e.target.value;
            } else {
              errors.valueError = '';
              dropdown.value = e.target.value;
            }
          }
          setErrors({
            ...errors
          });
        setDropdown({
          ...dropdown,
          [e.target.name] : e.target.value
        });
  }

  let Inputchange = e => {
      console.log(e);
      if(e.value == ''){
         errors.DropdownTypeError = 'please enter dropdown type';
          dropdown.DropdownType = e;
      }
      else{
        errors.DropdownTypeError = '';
          dropdown.DropdownType = e;
      }

      setErrors({
        ...errors
      });
     
        setDropdown({...dropdown,
           DropdownType : e
        });
    
  }
  
  
  let handleSubmit = e => {
    let count = 0;
    e.preventDefault();
    console.log(dropdown);
    if(dropdown.value == ''){
      count++;
      console.log('1');
      errors.valueError = 'please enter value';
    }
    else{
      errors.valueError = '';
    }
    
    if(dropdown.DropdownType == ''){
      count++;
      console.log('2');
      errors.DropdownTypeError = 'please enter dropdown type';
   
    }
    else{
     errors.DropdownTypeError = '';
    }

    setErrors({
      ...errors
    });
    setDropdown({
      ...dropdown
    });
    if(count == 0){

    let addDropdown1 = {
        value : dropdown.value,
        DropdownType : dropdown.DropdownType.value
    }
    console.log(addDropdown1);
    if(dropdown.id != 'new'){
        addDropdown1.status = dropdown.status;
            swal({
                title: "Edit Dropdown!!",
                text: "Enter Data Want To Change in Dropdown?",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                buttons : true
            }).then(willUpdate=>{
                if(willUpdate){
                  console.log(dropdown);
                    axios.put('http://localhost:3005/updatedropdown/'+props.match.params.id,addDropdown1).then(res=>{
                        console.log(res.data);
                        if(res.status == 200){
                          setDropdown({
                            value : res.data.data.value,
                            DropdownType : res.data.data.DropdownType
                        });
                        props.history.push('/extras/dropdown');
                        }
                    }).catch((e)=>{
                        console.log(e);
                        swal('OOPS', `${e.response.data.message}`);
                    })
                }
            }).catch((e)=>{
                console.log(e)
                swal('oops!', 'something went wrong with', e.response.data.message);
            })
        // });
    }

    else{
      props.reduxData(addDropdown1);
      if(dropdown.id = 'new'){
        axios.post('http://localhost:3005/createdropdown/',addDropdown1).then(res=>{
          console.log(res.data);
          swal({
              title : 'Success!',
              text : 'Dropdown Added Succesfully!',
              icon : 'success',
              button : 'OK!'
          });
          props.history.push('/extras/dropdown');
      }).catch((e)=>{
          console.log(e.response.data.message);
          swal('OOPS!',e.response.data.message);
      });

      }
       
    }
  }

  }

    let routeChange = ()=>{
        props.history.push('/extras/dropdown');
    }

    useEffect(()=>{
       if(dropdown.id != 'new'){
        axios.get('http://localhost:3005/getonedropdown/'+props.match.params.id).then(res=>{
          console.log(res.data);
         if(res.status == 200){
          let options = {label : res.data.data.DropdownType,value : res.data.data._id};
          setDropdown({
            ...dropdown,
              value : res.data.data.value,
              DropdownType : options,
              title : 'Edit'
          })
         }
        }).catch((e)=>{
          console.log(e);
          swal('OOPS', `${e.response.data.message}`);
        })
       }
        
      },[]);

    return(
        <>
         <Row>
      <Col xs="12" md="6">
      <Card>
      <Form className="form-horizontal" onSubmit={handleSubmit}>
          <CardHeader>
          
          <strong> {dropdown.title
                      ? dropdown.title
                      : 'Create'}</strong>
             
          </CardHeader>
          <CardBody>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Value</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="value" placeholder="Dropdown value" onChange={handleChange} value = {dropdown.value}/>
                  <span style={{ color: "red" }}>
                    
                    {errors.valueError
                      ? errors.valueError
                      : null}
                  </span>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Dropdown Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <Select name = 'DropdownType'  options={options} onChange = {Inputchange} value = {dropdown.DropdownType} />
                  <span style={{ color: "red" }}>
                    {/* {errors.valueError} */}
                    {errors.DropdownTypeError
                      ? errors.DropdownTypeError
                      : null}
                  </span>
                </Col>
              </FormGroup>
              
              {/* {
               district.id? 
              <FormGroup row>
                <Col md="3">
                  <Label>Status</Label>
                </Col>
                <Col md="9">

                <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'}  checked= {Boolean(district.status) === true? true : false} onChange={handleChange} value={toggleSwitch} />
                </Col>
              </FormGroup>
              :null
             } */}
          </CardBody>
          <CardFooter>
            <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
            {/* <Button type="Click" size="sm" color="secondary" style={{marginLeft : '3px'}} onClick={onClick} ><i className="fa fa-dot-circle-o"></i> Click</Button>  */}
            
            <Button type="reset" size="sm" color="danger" style={{marginLeft : '3px'}} onClick={routeChange}><i className="fa fa-ban"></i> Cancel</Button>
          </CardFooter>
          </Form>
        </Card>
      </Col>
    </Row>
        </>
        
        );

  }

  const mapDispatchToProps = dispatch =>{
    return {
      reduxData : (values) => dispatch(createDrodown(values))
    }
  }
  

  export default connect(null,mapDispatchToProps)(addDropdown);