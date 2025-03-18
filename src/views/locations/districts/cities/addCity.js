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
  import axios from '../../../../containers/Axios/config';
  import Select from "react-select";
  // import "react-select/dist/react-select.min.css";

  import swal from 'sweetalert';
  import {AppSwitch} from '@coreui/react';
import { createCity } from "./citySlice";
import { connect } from "react-redux";
  function addCity(props){

    let [city,setCity] = useState({
        id: props.match.params.id,
        city: '',
        dist_id : '',
        status : true,
        title : '',
        errors : {}
       
    });

    let [errors,setErrors] = useState({
      cityError : '',
      districtError : ''
    })

    let [dist,setDistrict] = useState({
      dist_options : []
    });
  
console.log(props.match.params.id);
    
useEffect(()=>{
  allDistricts();
  console.log(dist.dist_options);
  let stateValues = city;
  axios.get('http://localhost:3005/displayonecity/'+props.match.params.id).then(res=>{
    console.log(res.data);
    console.log(res.data.data.dist_id);
    let options = {label : res.data.data.dist_id.dist_name, value :res.data.data.dist_id._id }
   console.log(options);
   stateValues.city =  res.data.data.city;
   stateValues.dist_id = options;
   stateValues.title = 'Edit';
  //  city.Dist_id = options
  console.log(stateValues);
    setCity({
     ...stateValues
     
    });
    console.log(city);
    
  }).catch((e)=>{
    console.log(e)
  })
},[]);
    let allDistricts = ()=>{
      axios.get('http://localhost:3005/displaydistricts/'+ localStorage.getItem('roleId')).then(res=>{
        console.log(res.data);
        console.log(res.data.data.data);
      let result= res.data.data.data.filter((status)=>{
         if(status.status == true){
           return status;
         }
       });
       res.data.data.data = result;
        // console.log(res.data.data);
        let district_array = [];
        res.data.data.data.map((data,index)=>{
          district_array.push({
            label : data.dist_name,
            value : data._id
          })
        })
         setDistrict({
           dist_options : district_array
         })
      }).catch((e)=>{
        console.log(e);
        swal('OOPS',`${e.response.data.message}`);
      })
    };
     console.log(dist);
     let handleChange = (e) => {
       if(e.target.name == 'city'){
         if(e.target.value == ''){
           errors.cityError = 'please enter city';
           city.city = e.target.value;
         }
         else{
          errors.cityError = '';
          city.city = e.target.value;
        
         }
       }

       setErrors({
         ...errors
       })
      console.log(e);
      setCity({
        ...city,
        [e.target.name] : e.target.value
      });
}

let Inputchange = e => {
  console.log(e);
  
  if(e.value == ''){
    errors.districtError = 'enter district';
  }
  else{
    errors.districtError = '';
  }

  setErrors({
    ...errors
  });
    setCity({...city,
      dist_id : e
    });
}


let handleSubmit = e => {
  e.preventDefault();
  let count = 0;
  if(city.city == ""){
    count++; 
    errors.cityError = 'please enter city!';
  }
  else{
   errors.cityError = '';
  }

  if(city.dist_id == ""){
    count++;
   errors.districtError = 'please enter district';
   
    
  }
  else{
    errors.districtError = '';
    
  }
  setErrors({
    ...errors
  });

  setCity({
    ...city
  });

  if(count == 0){
  let addCity1 = {
   city : city.city,
   dist_id : city.dist_id.value
  };
console.log(addCity1);

if(props.match.params.id){
  addCity1.status = city.status
  axios.get('http://localhost:3005/displayonecity/'+props.match.params.id).then(res=>{
    // console.log(res.data);
    setCity({
      city : res.data.data.city,
      dist_id : res.data.data.dist_id
    })
    swal({
      title: "Edit City!!",
      text: "Enter Data Want To Change in City?",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      buttons : true
    }).then(willUpdate=>{
     if(willUpdate){
      axios.put('http://localhost:3005/updatecity/'+props.match.params.id,addCity1).then(res=>{
        console.log(res.data);
        props.history.push('/locations/cities');
      }).catch((e)=>{
        console.log(e);
        swal('OOPS', `${e.response.data.message}`);
      })
     }
     else{
     }
    }).catch((e)=>{
      console.log(e);
      swal('OOPS', `${e.response.data.message}`);
    })
  })

}
else{
  props.reduxData(addCity1);
  axios.post('http://localhost:3005/createcity',addCity1).then(res=>{
    console.log(res.data);
    if(res.status == 200){
      swal({
        title : 'Success!',
        text : 'City Added Succesfully!',
        icon : 'success',
        button : 'OK!'
      });
      props.history.push('/locations/cities');
    }
   
  }).catch((e)=>{
    console.log(e);
    swal('OOPS', `${e.response.data.message}`);
  })
}
  }
}


let routeChange = () =>{
  props.history.push('/locations/cities');
}

      return(
          <>
           <Row>
        <Col xs="12" md="6">
        <Card>
        <Form className="form-horizontal" onSubmit={handleSubmit} >
            <CardHeader>
              
            <strong> {city.title
                      ? city.title
                      : 'Create'}</strong>
                
            </CardHeader>
            <CardBody>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">City</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" name="city" placeholder="City Name" onChange={handleChange} value = {city.city}/>
                    <span style={{ color: "red" }}>
                  {errors.cityError
                    ? errors.cityError
                    : null}
                </span>
                
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Districts</Label>
                  </Col>
                  <Col xs="12" md="9">
                    {console.log(city.dist_id)}
                    <Select 
                    name = 'dist_id'  
                    options={dist.dist_options}  
                    onChange = {Inputchange} 
                    value = {city.dist_id}
                    
                     />
                    
                    <span style={{ color: "red" }}>
                  {errors.districtError
                    ? errors.districtError
                    : null}
                </span>
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
      reduxData : (values) => dispatch(createCity(values))
    }
  }
  export default connect(null,mapDispatchToProps)(addCity);