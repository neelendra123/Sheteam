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
  import axios from '../../../containers/Axios/config';
  import {AppSwitch} from '@coreui/react';
  import swal from 'sweetalert';
  import { createDistrict } from "./districtSlice";
import { connect } from "react-redux";
  function addDistrict(props){
      // console.log(props);
      

    let [district,setDistrict] = useState({
        id: props.match.params.id,
        dist_name : '',
        status : true,
        title : '',
        error_Dist : ''
    });

   let [error,setError] = useState('');
    // console.log(props.match.params.id);
   
    useEffect(()=>{
       console.log(props.match.params.id);
      if(props.match.params.id != 'new'){
        axios.get('http://localhost:3005/displayonedistrict/'+props.match.params.id).then(res=>{
          console.log(res.data);
          if(res.status == 200){
            setDistrict({
              dist_name:res.data.data.dist_name,
              title : 'Edit'
            });
          }
          
        }).catch((e)=>{
          console.log(e);
          swal('Oops!',`${e.response.data.error}` );
        });
      }
      
    },[]);
  

    let routeChange = () => {
        console.log(props);
        let path = '/locations/districts';
        props.history.push(path);
    }

    let handleChange = (e) => {
          setDistrict({
            [e.target.name] : e.target.value
          });
          if(e.target.name == 'dist_name'){
            if(e.target.value == ''){
              setError('Please enter district name!');
            }
            else{
              setError('');
            }
          }
    }

    let handleSubmit = (e)=>{
        e.preventDefault();
        let count = 0;
        if(district.dist_name == ""){
          count++;
          setError('Please enter district name!');
        }
        else{
          setError('');
        }
        if(count == 0){
       const dist = {
         dist_name : district.dist_name
       }



        console.log(dist);
        // console.log(district.id);
        
            if(props.match.params.id != 'new'){
              dist.status = district.status;
              axios.get('http://localhost:3005/displayonedistrict/'+props.match.params.id).then(res=>{
              console.log(res.data);
              setDistrict({
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
                axios.put('http://localhost:3005/updatedistricts/'+props.match.params.id,dist).then(res=>{
                console.log(res.data);
                props.history.push('/locations/districts');
            }).catch((e)=>{
                console.log(e);
            })
              }
              else{
              }
            })
        }
        else{
          props.reduxData(dist);
          if(props.match.params.id == 'new'){
            axios.post('http://localhost:3005/createdistrict',dist).then(res=>{
                console.log(res.data);
                swal({
                  title : 'Success!',
                  text : 'District Added Succesfully!',
                  icon : 'success',
                  button : 'OK!'
                });
                props.history.push('/locations/districts');
            }).catch((e)=>{
                console.log(e.response);
                if(e.response.status == 500){
                  swal("Oops!", e.response.data.message, "error");
                }
                if(e.response.status == 401){
                  swal('Oops!',`${e.response.data.error}` );
                  this.props.history.push('/login');
                }
                
                // props.history.push('/locations/districts');
            })
        }
      }
    }
    }

    // let toggleSwitch = () => {
    //     if(district.status){
    //     console.log(district.status);
    //     this.setState({ status: !district.status });
    //     return district.status;
    //     }
    //   }

      let statusChange = (e) => {
       console.log(district.status);
       if(district.status == true){
         district.status = !district.status;
         console.log(district.status);
         setDistrict({
           ...district,
           status : district.status
         });
       }
       console.log(district);
      }
    return(
        <>
        <Row>
        <Col xs="12" md="6">
        <Card>
        <Form className="form-horizontal" onSubmit={handleSubmit}>
            <CardHeader>
            <strong> {district.title
                      ? district.title
                      : 'Create'}</strong>
            </CardHeader>
            <CardBody>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">District</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" name="dist_name" placeholder=" District Name"  onChange={handleChange}  value={district.dist_name}/>
                    <span style={{ color: "red" }}>
                  {error
                    ? error
                    : null}
                </span>
                
                  </Col>
                </FormGroup>
                
                <FormGroup row>
                    <Col md="3">
                      <Label>Status</Label>
                    </Col>
                    <Col md="9">

                    <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'}  checked= {Boolean(district.status) === true? true : false} onChange={statusChange} value={district.status} />
                      
                    </Col>
                  </FormGroup>
            </CardBody>
            <CardFooter>
              <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>              
              <Button type="reset" size="sm" color="danger" style={{marginLeft : '3px'}} onClick={routeChange}><i className="fa fa-ban"></i> Cancel</Button>
            </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
            </>
    )

  }

  const mapDispatchToProps = dispatch =>{
    return {
      reduxData : (values) => dispatch(createDistrict(values))
    }
  }

  export default connect(null,mapDispatchToProps)(addDistrict);