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
  import axios from '../../../../containers/Axios/config'
  import {AppSwitch} from '@coreui/react';
  import swal from 'sweetalert';
  import Select from "react-select";
  import { ReactFormGenerator } from 'react-form-builder2';
class duplicateDistrict extends React.Component{

    constructor(props){
        super(props);
    }
    state = {
        id: this.props.match.params.id,
        dist_name : '',
        status : true,
        title : '',
        error_Dist : '',
        formOptions: [],
        formName: '',
        InputForm: '',
        formData : ''
    }
    componentDidMount(){
        this.formdisplay();
        if(this.props.match.params.id != 'new'){
            axios.get('http://localhost:3005/displayonedistrict/'+this.props.match.params.id).then(res=>{
              console.log(res.data);
              let formNameOptions = {label : res.data.data.formName.form_name, value : res.data.data.formName._id}
              console.log(formNameOptions);
              this.setState({
                dist_name:res.data.data.dist_name,
                title : 'Edit',
                formName : formNameOptions,
                // InputForm : res.data.data.InputForm,
                formData : res.data.data.formName.formData,
              });
            });
          }
    }

     formdisplay = () =>{
        axios.get('http://localhost:3005/displayfields').then(res => {
              console.log(res.data);
              let formArray = [];
              res.data.data.map((data, index) => {
                  formArray.push({
                      label: data.form_name,
                      value: data._id
                  })
              })
              this.setState({
                formOptions: formArray
            })
  
          }).catch((e) => {
              console.log(e);
          })
      }
    onSubmit = (e)=>{
        e.preventDefault();
        console.log(e);
        let count = 0;
        if(this.state.dist_name == ""){
          count++;
          this.state.error_Dist = 'Please enter district name!'
          
        }
        else{
            this.state.error_Dist = '';
        }
        this.setState({
            ...this.state
        })
        if(count == 0){
       const dist = {
         dist_name : this.state.dist_name,
         InputForm :  this.state.InputForm,
         formName :  this.state.formName.value
       }

        console.log(dist);
        // console.log(district.id);
            if(this.props.match.params.id != 'new'){
              dist.status = this.state.status;
              axios.get('http://localhost:3005/displayonedistrict/'+this.props.match.params.id).then(res=>{
              console.log(res.data);
              this.setState({
                dist_name : res.data.data.dist_name
              })
            })
            swal({
              title: "Edit District!!",
              text: "Enter Data Want To Change District",
              type: "input",
              showCancelButton: true,
              closeOnConfirm: false,
              buttons : true
            }).then(willUpdate=>{
              if(willUpdate){
                axios.put('http://localhost:3005/updatedistricts/'+this.props.match.params.id,dist).then(res=>{
                console.log(res.data);
                this.props.history.push('/locations/districts');
            }).catch((e)=>{
                console.log(e);
                swal('Oops!',`${e.response.data.error}` );        
                })
              }
              else{
              }
            })
        }
        else{
          if(this.props.match.params.id == 'new'){
              console.log(dist);
            axios.post('http://localhost:3005/createdistrict',dist).then(res=>{
                console.log(res.data);
                swal({
                  title : 'Success!',
                  text : 'District Added Succesfully!',
                  icon : 'success',
                  button : 'OK!'
                });
                this.props.history.push('/locations/districts');
            }).catch((e)=>{
                console.log(e.response);
                if(e.response.status == 500){
                  swal("Oops!", e.response.data.message, "error");
                }
                
            })
        }
      }
    }
    }

      statusChange = (e) => {
       console.log(this.state.status);
       if(this.state.status == true){
        this.state.status = !this.state.status;
         console.log(this.state.status);
         this.setState({
             status : this.state.status
         })
       }
      }
       InputChange = (e) => {
        //   console.log(e);
        this.setState({
            formName : e
        })
        //   setForm({
        //     ...form,
        //     formName : e
        //   });
          axios.get('http://localhost:3005/displayonefeild/' + e.value).then(res => {
              console.log(res.data.data.formData);
              this.setState({
                InputForm: res.data.data.formData
              })
          }).catch((e) => {
              console.log(e);
          })
          
        }
    
    
    
         routeChange = () => {
            
            let path = '/locations/districts';
            this.props.history.push(path);
        }
    
        handleChange = (e) => {
            this.setState({
                dist_name : e.target.value
            })
              if(e.target.name == 'dist_name'){
                if(e.target.value == ''){
                    this.state.error_Dist = 'Please enter district name!';
                  
                }
                else{
                    this.state.error_Dist = '';
                  
                }
              }
        }
    render(){
        return(
            <>
            <Row>
            <Col xs="12" md="6">
            <Card>
            <Form className="form-horizontal" onSubmit={this.onSubmit}>
                <CardHeader>
                <strong> {this.state.title
                          ? this.state.title
                          : 'Create'}</strong>
                </CardHeader>
                <CardBody>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">District</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" name="dist_name" placeholder=" District Name"  onChange={this.handleChange}  value={this.state.dist_name}/>
                        <span style={{ color: "red" }}>
                      {this.state.error_Dist
                        ? this.state.error_Dist
                        : null}
                    </span>
                    
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Select Custom Form</Label>
                      </Col>
                      <Col xs="12" md="9">
                      <Select
                            name='formName'
                            options={this.state.formOptions}
                            onChange={this.InputChange}
                            value={this.state.formName}
                      />
                    
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    {this.state.InputForm ?
                                <ReactFormGenerator 
                                data={this.state.InputForm}
                                // onSubmit = {handleSubmit}
                                />
                                : null}
                    </FormGroup>   
                    <FormGroup row>
                        <Col md="3">
                          <Label>Status</Label>
                        </Col>
                        <Col md="9">
    
                        <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'}  checked= {Boolean(this.state.status) === true? true : false} onChange={this.statusChange} value={this.state.status} />
                          
                        </Col>
                      </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>              
                  <Button type="reset" size="sm" color="danger" style={{marginLeft : '3px'}} onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                </CardFooter>
                </Form>
              </Card>
            </Col>
          </Row>
                </>
        )
    }
}
  export default duplicateDistrict;