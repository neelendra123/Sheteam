import React, {Component} from 'react';
import axios from '../../../containers/Axios/config';

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
import {AppSwitch} from '@coreui/react';


class Register extends Component {
  
  
  state = {
                id: this.props.match.params.id,
                fullname: '' ,
                username: '',
                email: '' ,
                password: '',
                status: null  
          } 
    
          routeChange=()=> {
            let path = `/ListOfUsers/UsersList`;
            this.props.history.push(path);
          }
  handleChange=(event)=> {
    let name=event.target.name;
    this.setState({ [name] : event.target.value })
    
  }
  handleSubmit = (event) => {
    event.preventDefault();

    var bodyFormData = {};
    bodyFormData.fullname=this.state.fullname;
    bodyFormData.username=this.state.username;
    bodyFormData.email=this.state.email;
    bodyFormData.password= this.state.password;
    console.log(bodyFormData);
    if(this.state.id){
       bodyFormData.status=this.state.status;
      axios.put( 'http://localhost:3005/update/user/'+this.state.id,bodyFormData)
        
        .then((res)=> {
          this.props.history.push('/ListOfUsers/UsersList');
         
      })
      }
    else{
    axios ({
         method: 'post',
         url: 'http://localhost:3005/new/user',
        data: bodyFormData,
       
    })
      .then(res => {
       
       this.props.history.push('/ListOfUsers/UsersList');
      })
      .catch((error)=>{
        
        alert('There is an error in API call.');
        })
    }
    
  }
  componentDidMount()
    {
        console.log(this.props.match.params.id);
     if(this.state.id){
      axios.get('http://localhost:3005/get/user/'+this.state.id)
      .then((res)=> {
    
        this.setState(res.data);
        console.log(res.data);
     })
    }
    }
    toggleSwitch = () => {
      if(this.state.status){
      console.log(this.state.status);
      this.setState({ status: !this.state.status });
      return this.state.status;
      }
  }
  render() {
    //console.log(this.state.status);
    
    return (
      
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="6">
          <Card>
          <Form onSubmit={this.handleSubmit}  className="form-horizontal">
              <CardHeader>
                <strong>User Registration</strong> 
              </CardHeader>
              <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Full Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="fullname" value={this.state.fullname} onChange={this.handleChange} placeholder="Full Name" />
                     
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Username</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="username" id="text-input" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="email" name="email" id="text-input" value={this.state.email} onChange= {this.handleChange} placeholder="Email" />
                      {/* <FormText color="muted">This is a help text</FormText> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="password" id="text-input" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
                      {/* <FormText color="muted">This is a help text</FormText> */}
                    </Col>
                  </FormGroup>
                  
                  
                  
                 {
                   this.state.id? 
                  <FormGroup row>
                    <Col md="3">
                      <Label>Status</Label>
                    </Col>
                    <Col md="9">

                    <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'}  checked= {Boolean(this.state.status) === true? true : false} onChange={this.handleChange} value={this.toggleSwitch} />
                      {/* <FormGroup check className="radio">
                      <Input className="form-check-input" name = "status" type="radio" checked={Boolean(this.state.status) === true} onChange={this.handleChange} id="radio1" value="true" />
                        <Label  className="form-check-label" htmlFor="radio1">Active</Label>
                      </FormGroup>
                      <FormGroup check className="radio">
                        <Input className="form-check-input" name = "status" type="radio" checked={Boolean(this.state.status) === false} onChange = {this.handleChange} id="radio2" value="false" />
                        <Label  className="form-check-label" htmlFor="radio2">Inactive</Label>
                      </FormGroup> */}
                      
                    </Col>
                  </FormGroup>
                  :null
                 }
                  
                
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger" onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
              </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Register;
