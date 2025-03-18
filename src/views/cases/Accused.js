import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
//import * as Yup from 'yup'
import axios from '../../containers/Axios/config';
import { Formik } from 'formik';
class Accused extends Component {
  state = {
    id: this.props.match.params.id,
    name: '',
    fatherName: '',
    age: '',
    selectDistrict: [],
    district: '',
    city: '',
    address: '',
    profession: '',
    contact: '',
    caseType_id: '',
    selectCity: []
  }
  componentDidMount() {
    axios.get('http://localhost:3005/displaydistricts')
      .then((res) => {
        this.setState({ selectDistrict: res.data.data })
        console.log(res.data);
      })

    axios.get('http://localhost:3005/displaycities')
      .then((response) => {
        this.setState({ selectCity: response.data.data })
        console.log(this.state.selectCity);
      })
  }
  handleChange = (event) => {
    console.log(event.target);
    let name = event.target.name;
    this.setState({ [name]: event.target.value })
  }

  handleDistrict = (event) => {
    console.log(event.target);
    let district1 = event.target.value;
    console.log(district1);
    this.setState({ district: district1 })
    axios.get('http://localhost:3005/citiesbydistrictid/' + district1)
      .then((res) => {
        const city = res.data.data;
        const cityData = (city.map((selCity) => (selCity.cities)));
        console.log(cityData);
        this.setState({ selectCity: (cityData) });
        //  this.setState({selectCity:city.map((selCity) => (selCity.cities))})
        //  console.log({selectCity:city.map((selCity) => (selCity.cities.map((selCity2) => selCity2.city_name)))});
      })
  }


  routeChange = () => {
    var path = '/base/searchCase/';
    this.props.history.push(path);
  }
  handleSubmit = (event) => {
    event.preventDefault();
    var addAccused = {};
    addAccused.name = this.state.name;
    addAccused.fatherName = this.state.fatherName;
    addAccused.age = this.state.age;
    addAccused.district = this.state.district;
    addAccused.city = this.state.city;
    addAccused.address = this.state.address;
    addAccused.profession = this.state.profession;
    addAccused.contact = this.state.contact;
    console.log(addAccused);
    console.log(this.state.id);
    if (this.state.id) {
      axios({
        method: 'post',
        url: 'http://localhost:3005/createdaccused' + this.state.id,
        data: addAccused

      })
        .then(res => {
          console.log(addAccused);
          if (res.status == 200) {
            this.props.history.push('/cases/accuses');
          }

        }).catch()
    }

  }

  render() {
    console.log(this.state.id);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="6">
            <Card>
              <Formik

                render={
                  ({
                    values,
                    errors,
                    touched,
                    status,
                    dirty,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    isValid,
                    handleReset,
                    setTouched
                  }) => (
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data" className="form-horizontal">
                      <CardHeader>
                        <strong>Accused Information</strong>
                      </CardHeader>
                      <CardBody>


                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Name</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="text"
                              id="text-input"
                              name="name"
                              onChange={this.handleChange}
                              value={this.state.name}
                              placeholder="Name"
                              valid={!errors.name}
                              invalid={touched.name && !!errors.name}
                              onBlur={handleBlur}
                              autoFocus={true}
                              required />

                            {/* <FormText color="muted">This is a help text</FormText> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Father Name</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="text"
                              id="text-input"
                              name="fatherName"
                              onChange={this.handleChange}
                              value={this.state.fatherName}
                              placeholder="Name"
                              valid={!errors.fatherName}
                              invalid={touched.fatherName && !!errors.fatherName}
                              onBlur={handleBlur}
                              autoFocus={true}
                              required />

                            {/* <FormText color="muted">This is a help text</FormText> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Age</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="number" id="text-input" name="age" onChange={this.handleChange} value={this.state.age} placeholder="age" valid={!errors.age}
                              invalid={touched.lawSections && !!errors.lawSections}
                              onBlur={handleBlur}
                              autoFocus={true}
                              required />
                            {/* <FormText color="muted">This is a help text</FormText> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="select">District</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="select" name="district" id="select" onChange={this.handleDistrict} >
                              <option value="0">Please select</option>
                              {this.state.selectDistrict.map((dropdowndata) => <option value={dropdowndata._id} >{dropdowndata.district_name}</option>)}

                            </Input>
                          </Col>

                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="select">City</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="select" name="city" id="select" onChange={this.handleChange} >
                              <option value="0">Please select</option>

                              {this.state.district ? this.state.selectCity.map((dropdowndata) => <option value={dropdowndata._id} >{dropdowndata.city_name}</option>) : null}

                            </Input>
                          </Col>

                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Address</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="text" id="text-input" name="address" onChange={this.handleChange} value={this.state.address} placeholder="Address"
                              valid={!errors.address}
                              invalid={touched.address && !!errors.address}
                              onBlur={handleBlur}
                              autoFocus={true}
                              required />
                            {/* <FormText color="muted">This is a help text</FormText> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Profession</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="text" id="text-input" name="profession" value={this.state.profession} onChange={this.handleChange} placeholder="Profession"
                              valid={!errors.profession}
                              invalid={touched.profession && !!errors.profession}
                              onBlur={handleBlur}
                              autoFocus={true}
                              required />
                            {/* <FormText color="muted">This is a help text</FormText> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Contact</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="number" name="contact" value={this.state.contact} onChange={this.handleChange} id="text-input"
                              placeholder="Phone Number" valid={!errors.contact}
                              invalid={touched.contact && !!errors.contact}
                              onBlur={handleBlur}
                              autoFocus={true}
                              maxLength={10}
                              required />
                          </Col>
                        </FormGroup>

                      </CardBody>
                      <CardFooter>
                        <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        <Button type="reset" size="sm" color="danger"><i className="fa fa-ban" onClick={this.routeChange}></i> Cancel</Button>
                      </CardFooter>
                    </Form>
                  )} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Accused;
