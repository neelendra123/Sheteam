import React from 'react';
import { Button,  Label, Input,Modal, ModalHeader, ModalBody, ModalFooter ,Form,Col,FormGroup} from 'reactstrap';
import axios from '../../../containers/Axios/config';
import swal from 'sweetalert';
class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      nestedModal: false,
      closeAll: false,
      users : [],
      password: '',
      error_password : '',
      error_conform_password : '',
      errors : '',
      conform_password: '',
      email: '',
    };
    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3005/displayusers').then(res=>{
            //console.log(res.data);
            if(res.status == 200){
              this.setState({
                users : (res.data.data),
            });
            }
        }).catch((e)=>{
            console.log(e.response);
            if(e.response.status == 401){
              swal('Oops!',`${e.response.data.error}` );
              this.props.history.push('/login');
            }
        })
  }




  handleChange = (e) =>{
    //   console.log(e.target.name);
    //   console.log(e.target.value);
    if(this.state.email == ""){
        this.state.errors = "Please Enter Your Email!";
    }
    else{
        this.state.errors = "";
    }
      [e.target.name] = e.target.value;
      
      this.setState({
         email : e.target.value
        // ...this.state
      })
  }
  passwordHandleChange = (e) => {
        
    if (e.target.name == "password") {
      if (e.target.value == "") {
        this.state.error_password = "Password Required.!";
        this.state.password = e.target.value;
      } else {
        this.state.error_password = "";
        this.state.password = e.target.value;
      }
    }

    let pw1 = document.getElementById("text-input3").value;
    let pw2 = document.getElementById("text-input4").value;
    if (e.target.name == "conform_password") {
      if (e.target.value == "") {
        this.state.error_conform_password = "conform Password Required.!";
        this.state.conform_password = e.target.value;
      }
      else if (pw1 != pw2) {
        this.state.error_conform_password = "conform password not match";
        this.state.conform_password = e.target.value;
      }

      else {
        this.state.error_conform_password = "";
        this.state.conform_password = e.target.value;
      }
    }
    this.setState({
        ...this.state
    })
    }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  onSubmit = (e) => {
    let count = 0;
      e.preventDefault();
      
    
      let emailsList = this.state.users.map((email)=>{
          return email.email;
      });
      let data = this.state.email;
      function checkUser(user) {
        return user == data;
      }
      let email = emailsList.find(checkUser);
      console.log(email);
      if(this.state.email == ''){
        count++;
          this.state.errors = 'Please enter email!';
      }
      else if(!email){
          count++;
        this.state.errors = 'Email Not Exists';
      }
      else{
          this.state.errors = '';
      }
    
      
      this.setState({
          ...this.state
      })
      if (count == 0) {
      this.toggleNested();
      }
  }

  passwordOnSubmit = (e) => {
      e.preventDefault();
      let count = 0;
      if (this.state.password == "") {
        count++;
        this.state.error_password = "please enter your password";
      }
      else{
        this.state.error_password = "";
      }
      if (this.state.conform_password == "") {
        count++;
        this.state.error_conform_password = "please enter conform password";
      }
      else{
        this.state.error_password = "";
      }
      if(count == 0){
        let passwordData = {
            email : this.state.email,
            password : this.state.password
        }
        axios.put('http://localhost:3005/users/passwordupdate',passwordData).then(res=>{
            console.log(res.data);
            if(res.status == 200){
                swal('Password successfully Changed!');
                this.toggleAll();
            }
        }).catch((e)=>{
            console.log(e);
            swal('OOPs',e.response.data.message);
        });
        
      }
      this.setState({
          ...this.state,
          email : '',
          password : '',
          conform_password : ''
      })
     
      

  }

  render() {
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
      <div>
        <Button color="secondary" onClick={this.toggle}>Password Update</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>Email Details</ModalHeader>
          <ModalBody>
              <Form >
                  <Col>
          <Input type="email" name="email" 
                      id="text-input2" value={this.state.email}
                       placeholder="Email" onChange={this.handleChange} 
                       />
                      <Col>
                      <span style={{color : 'red'}}>{this.state.errors}</span>
                      </Col>
                       </Col>
                       {" "}
                       <Col>
                       <Button color="success"  style={{marginTop : '15px'}} onClick = {this.onSubmit}>Submit</Button>
                       </Col>
                       
                       </Form>
          </ModalBody>
          <br/>
         
            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
              <ModalHeader>Password Change</ModalHeader>
              <ModalBody>
              <Form>
              <FormGroup row>

                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password"
                        name="password"
                        id="text-input3" value={this.state.password}
                        placeholder="Password"
                        onChange={this.passwordHandleChange}
                        onBlur={this.onBlur} />
                    </Col>
                    <span style={{color : 'red'}}>{this.state.error_password}</span>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Conform Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="conform_password" id="text-input4"
                        value={this.state.conform_password}
                        placeholder="Conform Password"
                        onChange={this.passwordHandleChange} />
                    </Col>
                    <span style={{color : 'red'}}>{this.state.error_conform_password}</span>
                  </FormGroup>
                  <Button color="secondary" onClick={this.passwordOnSubmit}>Submit</Button>
                  </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleNested}>GoTo Email</Button>{' '}
                <Button color="danger" onClick={this.toggleAll}>Cancel</Button>
               
              </ModalFooter>
            </Modal>
          <ModalFooter>
            
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalExample;