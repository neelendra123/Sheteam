import React from 'react';
import { Formik } from 'formik';
import { withRouter, } from "react-router";
import {Link} from 'react-router-dom'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from '../../../containers/Axios/config';
import { useState } from 'react';
import { login } from './loginSlice';
import { connect } from 'react-redux';
import swal from 'sweetalert';

const Login = (props) => (

      
  <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        let errors = {};
        
        if (!values.email) {
          errors.email = 'Email Required';
        } if(!values.password) {
          errors.password = "Password Required";
        }
        return errors;
      }}

      onSubmit = {(values)=>{
        console.log(values);
       
        axios ({
          method: 'POST',
          url: 'http://localhost:3005/users/login',
          data:values
         }).then(res=>{
           console.log(res.data);

           if(res.status === 200 ){
            localStorage.setItem('token',res.data.data.token);
            localStorage.setItem('roleId',res.data.data.user[0].role_id._id);
            localStorage.setItem('userId',res.data.data.user[0]._id);
            localStorage.setItem('userName',res.data.data.user[0].username);
            localStorage.setItem('useremail',res.data.data.user[0].email);
            localStorage.setItem('roleName',res.data.data.user[0].role_id.role_name)
            let userData = {
              token : res.data.data.token,
              roleId: res.data.data.user[0].role_id._id,
              userId : res.data.data.user[0]._id,
              userName : res.data.data.user[0].username,
              useremail : res.data.data.user[0].email,
              roleName : res.data.data.user[0].role_id.role_name
            };
            props.loginData(userData);
            axios.defaults.headers.common['Authorization'] = res.data.data.token;
            // console.log( axios.defaults.headers.common['Authorization']);
           
           }
           if(res.status === 200){
            //  console.log('1');
            //  console.log(props);
             props.history.push('/#/dashboard');
             swal('Successfully Login User');

           }
         }).catch((e)=>{
           console.log(e);
           swal("Please Enter Valid Login and Password")
          //  alert();
         })
         
      }
    }
     >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
  
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit = {handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" 
                          name= "email" 
                          
                          placeholder="Login" 
                          autoComplete="login"
                          onChange = {handleChange}
                          onBlur = {handleBlur}
                          value={values.email}
                         />
                      </InputGroup>
                      <span style={{color:'red'}}>{errors.email && touched.email && errors.email}</span>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                          type="password" 
                          name = "password" 
                          placeholder="Password" 
                          autoComplete="current-password" 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                      </InputGroup>
                      <span style={{color:'red'}}>{errors.password && touched.password && errors.password}</span> 
                      <Row>
                        <Col xs="6">
                          <Button type="submit"  diasbled = {isSubmitting} color="primary" className="px-4">Login</Button>
                         
                        </Col>
                      </Row>
                      {/* <Row style={{marginTop:"5px"}}><Col><span>If you don't have an account ?<Link to='/register'>Register</Link></span></Col></Row> */}
                    </Form>
                  </CardBody>
                </Card>
                
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
      )
              }
  </Formik>
              
  );

//   const mapStateToProps = state =>{
//     // console.log(state);
//     return {
//       roleId : state.roleId,
//       userId : state.userId,
//       userName : state.userName,
//       useremail : state.useremail,
//       roleName : state.roleName
//     }
// }

const mapDispatchToProps = dispatch =>{
  return {
    loginData : (values) => dispatch(login(values))
  }
}
export default connect(null,mapDispatchToProps)(Login);
