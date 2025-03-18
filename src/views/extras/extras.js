import React from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
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
function Extras(props){

    let [contactus,setContactus] = useState({
        Name : '',
        email : '',
        messege : ''
    });

    let handleChange = e => {
        [e.target.name] = [e.target.value];
        setContactus({
             [e.target.name] : e.target.value
        });

    }

    let handleSubmit = e => {
        console.log(e);
        swal({
            title : 'Success!',
                text : 'Your Messege Succefully Sent!',
                icon : 'success',
                button : 'OK!'
        })
        props.history.push('/dashboard');
    }
        let routeChange = () => {
            props.history.push('/dashboard')
        }       

    return(
        <>
              <Row>
          <Col xs="12" md="6">
          <Card>
          <Form className="form-horizontal"  onSubmit={handleSubmit}>
              <CardHeader>
                <strong>Contact Us</strong> 
              </CardHeader>
              <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Full Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="Name" placeholder="Full Name"  onChange={handleChange}  value={contactus.Name}/>
                      
                    </Col>
                   
                  </FormGroup>
                 
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="email" name="email" id="text-input2" value={contactus.email}  placeholder="Email"onChange={handleChange} />
                     
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Message</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea"  name="messege" id="text-input3" value={contactus.messege} placeholder = 'Message'  onChange={handleChange} />
                     
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

export default Extras;