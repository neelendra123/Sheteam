import React from "react";

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
import Select from "react-select";
import { AppSwitch } from '@coreui/react';
import axios from '../../../containers/Axios/config';
import swal from 'sweetalert';
import { data } from "jquery";
import { addUsers } from "./userSlice";
import { connect } from "react-redux";

class UserCreation extends React.Component {

  state = {
    id: this.props.match.params.id,
    name: '',
    username: '',
    email: '',
    password: '',
    disabled : false,
    conform_password: '',
    status: true,
    title: '',
    error_name: "",
    error_username: "",
    error_email: "",
    error_password: "",
    error_conform_password: "",
    userrole_options : "",
    role_id : ""

  }

  routeChange = () => {
    let path = `/ListOfUsers/UsersList`;
    this.props.history.push(path);
  }

  handleChange = e => {
    // let name = e.target.name;
    let errors = this.state;
    if (e.target.name == "name") {
      if (e.target.value == "") {

        errors.error_name = "Your Name Required.!";
        errors.name = e.target.value;
      } else {
        errors.error_name = "";
        errors.name = e.target.value;
      }
    }
    if (e.target.name == "username") {
      if (e.target.value == "") {
        errors.error_username = "Your Name Required.!";
        errors.username = e.target.value;
      } else {
        errors.error_username = "";
        errors.username = e.target.value;
      }
    }
    if (e.target.name == "email") {
      if (e.target.value == "") {
        errors.error_email = "Email Required.!";
        errors.email = e.target.value;
      } else {
        let model = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!model.test(e.target.value)) {
          errors.error_email = "Please enter valid email";
          errors.email = e.target.value;
        } else {
          errors.error_email = "";
          errors.email = e.target.value;
        }
      }
    }
    if (e.target.name == "password") {
      if (e.target.value == "") {
        errors.error_password = "Password Required.!";
        errors.password = e.target.value;
      } else {
        errors.error_password = "";
        errors.password = e.target.value;
      }
    }

    let pw1 = document.getElementById("text-input3").value;
    let pw2 = document.getElementById("text-input4").value;
    if (e.target.name == "conform_password") {
      if (e.target.value == "") {
        errors.error_conform_password = "conform Password Required.!";
        errors.conform_password = e.target.value;
      }
      else if (pw1 != pw2) {
        errors.error_conform_password = "conform password not match";
        errors.conform_password = e.target.value;
      }

      else {
        errors.error_conform_password = "";
        errors.conform_password = e.target.value;
      }
    }
    this.setState({
      ...errors,
    });
  }
  onBlur = (e) => {
    let errors = this.state;
    if (e.target.name == "name") {
      if (e.target.value == "") {
        errors.error_name = "Your Name Required.!";
      } else {
        errors.error_name = "";
      }
    }
    if (e.target.name == "username") {
      if (e.target.value == "") {
        errors.error_username = "Your Username Required.!";
      } else {
        errors.error_username = "";
      }
    }
    if (e.target.name == "email") {
      if (!e.target.value) {
        errors.error_email = "Email Required.!";
      } else {
        let model = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!model.test(e.target.value)) {
          errors.error_email = "Please enter valid email.!";
        } else {
          errors.error_email = "";
        }
      }
    }
    if (e.target.name == "password") {
      if (e.target.value == "") {
        errors.error_password = "Password Required.!";
      } else {
        errors.error_password = "";
      }
    }

    if (e.target.name == "conform_password") {
      if (e.target.value == "") {
        errors.error_conform_password = "repeat password required.!"
      }
      else if (e.target.value != errors.error_password) {
        errors.error_conform_password = 'passwords should be match!'
        // errors.conform_password = e.target.value;
      }
      else {
        errors.error_conform_password = ""
      }
    }

    this.setState({
      ...errors,
    });

  };

  roleChange = e => {
    console.log(e)
    this.setState({
      role_id : e
    })
  }


  handleSubmit = event => {
    event.preventDefault();
    let count = 0;
    if (this.state.name == "") {
      count++;
      this.state.error_name = "Please enter your name";
    }
    if (this.state.username == "") {
      count++;
      this.state.error_username = "Please enter your username";
    }
    if (this.state.email == "") {
      count++;
      this.state.error_email = "please enter your email";
    }

    if (this.state.password == "") {
      count++;
      this.state.error_password = "please enter your password";
    }
    if (this.state.conform_password == "") {
      count++;
      this.state.error_conform_password = "please enter conform password";
    }
    this.setState({
      ...this.state
    });
    if (count == 0) {
      const user = {
        name: this.state.name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        status: this.state.status,
        role_id : this.state.role_id.id
      };
      console.log(user);

      if (this.state.id != 'new') {
        console.log('1');

        user.status = this.state.status;
        axios.get('http://localhost:3005/displayoneuser/' + this.state.id).then(res => {
          console.log(res.data);
          if (res.status == 200) {
            this.setState({
              name: res.data.data.name,
              username: res.data.data.username,
              email: res.data.data.email,
              password: res.data.data.password,
              status: res.data.data.status,
            });
          }

        });
        swal({
          title: "Edit User!!",
          text: "Enter Data Want To Change User",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          buttons: true
        }).then(willUpdate => {
          if (willUpdate) {
            axios.put('http://localhost:3005/updateuser/' + this.state.id, user).then(res => {
              console.log(res.data);
              if (res.status == 200) {
                this.props.history.push('/ListOfUsers/UsersList');
              }
            }).catch((e) => {
              console.log(e.response.data.message);
              swal('Not Updated', `please check with ${e.response.data.message}`);
            })

            swal('Updated', "Your imaginary data has been Updated!", "success");
          }
          else {
          }
        })
      }
      else {
        if(this.state.id == 'new'){
          this.props.reduxData(user);
          axios({
            method: 'POST',
            url: 'http://localhost:3005/createuser',
            data: user
          }).then(res => {
            console.log(res.data);
            
            if (res.status == 200) {
              let pw1 = document.getElementById('text-input3').value;
              let pw2 = document.getElementById('text-input4').value;
              if (pw1 == pw2) {
                swal({
                  title: 'Success!',
                  text: 'User Added Succesfully!',
                  icon: 'success',
                  button: 'OK!'
                });
                this.props.history.push('/ListOfUsers/UsersList');
              }
            }
  
          }).catch((error) => {
            if(error.status == 500){
              console.log(error.response);
              swal("Oops!", error.response.data.message, "error");
            }
            
          });
        }

        }
        
    }
  }
  toggleSwitch = () => {

    if (this.state.status) {
      console.log(this.state.status);
      this.setState({ status: !this.state.status });
      return this.state.status;
    }
  }
  componentDidMount() {
    if (this.state.id != 'new') {
      // console.log('1');
      this.state.title = 'Edit';
      axios.get('http://localhost:3005/displayoneuser/' + this.state.id).then(res => {
        console.log(res.data);
        // console.log(this.state.role_id);
        let roleidDisplay = {label : res.data.data.role_id.role_name, value : res.data.data.role_id._id};
        if (res.status == 200) {
          this.setState({
            name: res.data.data.name,
            username: res.data.data.username,
            email: res.data.data.email,
            password: res.data.data.password,
            conform_password: res.data.data.password,
            role_id : roleidDisplay,
            status: true,
            disabled : true
          });
        }
      }).catch((e)=>{
        if(e.status == 500){
          swal('OOPS!',e.response.data.message);
        }
      })
    }
    axios.get('http://localhost:3005/getallRoles').then(res=>{
      console.log(res.data.data);
      let roleOptions = [];
      res.data.data.map((data,index)=>{
        roleOptions.push({
          label : data.role_name,
          id : data._id
        })
      });
      // console.log(roleOptions);
      this.setState({
        userrole_options : roleOptions
      })
    })
   
    
  }
  passwordMatch = () => {
    let pw1 = document.getElementById("text-input3").value;
    let pw2 = document.getElementById("text-input4").value;
    if (pw1 == pw2) {
      this.state.error_conform_password = "";
    } else {
      this.state.error_conform_password = "Repeat password not match";
    }
  }


  render() {
    // console.log(this.state.status);
    // console.log(this.state.userrole_options);
    return (
      <>
        <Row>
          <Col xs="12" md="6">
            <Card>
              <Form className="form-horizontal"
               onSubmit={this.handleSubmit}>
                <CardHeader>
                  <strong> {this.state.title
                    ? this.state.title
                    : 'Create'}</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Full Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="name" placeholder="Full Name"
                       onChange={this.handleChange} 
                       onBlur={this.onBlur} 
                       value={this.state.name} />
                      <span style={{ color: "red" }}>
                        {this.state.error_name
                          ? this.state.error_name
                          : null}
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Username</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="username" 
                      id="text-input1" 
                      value={this.state.username}
                       placeholder="Username" 
                       onChange={this.handleChange} 
                       onBlur={this.onBlur}
                      
                        />
                      <span style={{ color: "red" }}>
                        {this.state.error_username
                          ? this.state.error_username
                          : null}
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="email" name="email" 
                      id="text-input2" value={this.state.email}
                       placeholder="Email" onChange={this.handleChange} 
                       onBlur={this.onBlur} />
                      <span style={{ color: "red" }}>
                        {this.state.error_email
                          ? this.state.error_email
                          : null}
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password"
                        name="password"
                        id="text-input3" value={this.state.password}
                        placeholder="Password"
                        onChange={this.handleChange}
                        onBlur={this.onBlur}
                        disabled = {this.state.disabled}
                        />
                      <span style={{ color: "red" }}>
                        {this.state.error_password
                          ? this.state.error_password
                          : null}
                      </span>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Conform Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="conform_password" id="text-input4"
                        value={this.state.conform_password}
                        placeholder="Conform Password"
                        onChange={this.handleChange} 
                        disabled = {this.state.disabled}
                        />
                      <span style={{ color: "red" }}>
                        {this.state.error_conform_password
                          ? this.state.error_conform_password
                          : null}
                      </span>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Role</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Select 
                    name = 'role_id'  
                    options={this.state.userrole_options}  
                    onChange = {this.roleChange} 
                    value = {this.state.role_id}
                     />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label>Status</Label>
                    </Col>
                    <Col md="9">
                      <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} checked={Boolean(this.state.status) === true ? true : false} onChange={(e) => this.setState({ status: true ? false : false })} value={this.state.status} />
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  <Button type="reset" size="sm" color="danger" style={{ marginLeft: '3px' }} onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </>
    )
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(addUsers(values))
  }
}

export default connect(null,mapDispatchToProps)(UserCreation);
