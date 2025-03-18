import React from 'react';
import { Formik } from 'formik';
import { withRouter, } from "react-router";
import {Link} from 'react-router-dom'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from '../../../containers/Axios/config';
import { useState } from 'react';


const duplicateLogin = 


(props) => (

      
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
            
            axios.defaults.headers.common['Authorization'] = res.data.data.token;
            console.log( axios.defaults.headers.common['Authorization']);
           
           }
           if(res.status === 200){
             console.log('1');
             console.log(props);
             props.history.push('/#/dashboard');
           }
         }).catch((e)=>{
           console.log(e);
           alert("Please Enter Valid Login and Password");
         })
         
      }}
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
                      
                        <span style={{color:'red'}}>{errors.email && touched.email && errors.email}</span>
                      </InputGroup>
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
                       <span style={{color:'red'}}>{errors.password && touched.password && errors.password}</span> 
                      </InputGroup>
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

export default duplicateLogin;
