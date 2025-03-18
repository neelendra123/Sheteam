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



export default class AddDropdown extends Component {
  
  constructor(props) {
    super(props)
    this.state = { dropdown_name: '' ,
                    type: ''
                      } 
    
  }
  routeChange=()=> {
    let path = `/editors/DropdownList`;
    this.props.history.push(path);
  }

  handleChange=(event)=> {
    console.log(event.target);
    let name=event.target.name;
    this.setState({ [name] : event.target.value })
  }
  handleSubmit = event => {
    event.preventDefault();
    
  
      var bodyFormData = {};
      bodyFormData.dropdown_name= this.state.dropdown_name;
      bodyFormData.type=this.state.type;
     
    
    
    axios ({
         method: 'post',
         url: 'http://localhost:3005/new/dropdown',

        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
      .then(res => {
        
        this.props.history.push('/editors/DropdownList');
      })
      .catch((error)=>{
       
        alert('There is an error in API call.');
        })
       
    }
    

  render() {
    console.log(this.state);
    return (
      
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="6">
          <Card>
          <Form onSubmit={this.handleSubmit} encType="multipart/form-data" className="form-horizontal">
              <CardHeader>
                <strong>Add Dropdown</strong> 
              </CardHeader>
              <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Value</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="dropdown_name" value={this.state.dropdown_name} onChange={this.handleChange} placeholder="Dropdown Value" />
                      {/* <FormText color="muted">This is a help text</FormText> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Dropdown Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="type" id="text-input" value={this.state.type} onChange={this.handleChange} placeholder="Dropdown Type" />
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
                      <FormGroup check className="radio">
                      <Input className="form-check-input" name = "status" type="radio" checked={Boolean(this.state.status) === true} onChange={this.handleChange} id="radio1" value="true" />
                        <Label  className="form-check-label" htmlFor="radio1">Active</Label>
                      </FormGroup>
                      <FormGroup check className="radio">
                        <Input className="form-check-input" name = "status" type="radio" checked={Boolean(this.state.status) === false} onChange = {this.handleChange} id="radio2" value="false" />
                        <Label  className="form-check-label" htmlFor="radio2">Inactive</Label>
                      </FormGroup>
                      
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


