import React from "react";
import { Formik } from "formik";
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
  FormFeedback
} from 'reactstrap';
import Select from "react-select";
// import "react-select/dist/react-select.min.css";
import makeAnimated from 'react-select/animated';
import axios from '../../containers/Axios/config';
import swal from 'sweetalert';
import * as Yup from 'yup';
import { addAccuses } from "./accusesSlice";
import { connect } from "react-redux";
class addAccused extends React.Component {

  state = {
    id: this.props.match.params.id,
    name: '',
    father_name: '',
    age: null,
    address: '',
    district: '',
    city: '',
    profession: '',
    contact: '',
    // case_id : null,
    district_options: [],
    city_options: '',
    case_options: ''

  }

  routeChange = () => {
    this.props.history.push('/cases/accuses');
  }

  componentDidMount() {

    let stateValues = this.state;
    axios.get('http://localhost:3005/displaydistricts/'+localStorage.getItem('roleId')).then(res => {
      console.log(res.data);
      let resultDistricts = res.data.data.data.filter((status) => {
        if (status.status == true) {
          return status;
        }
      });
      res.data.data.data = resultDistricts;
      let distritcsArray = [];
      res.data.data.data.map((data, index) => {

        distritcsArray.push({
          label: data.dist_name,
          value: data._id
        })
      })

      stateValues.district_options = distritcsArray;
      this.setState({
        district_options: distritcsArray
      })
    }).catch((e) => {
      console.log(e);
      swal('Oops!',`${e.response.data.error}` );
    })

    axios.get('http://localhost:3005/displaycities/'+localStorage.getItem('roleId')).then(res => {
      console.log(res.data);
      let result = res.data.data.data.filter((status) => {
        if (status.status == true) {
          return status;
        }
      });
      res.data.data.data = result;
      let cityArray = [];
      res.data.data.data.map((data, index) => {
        cityArray.push({
          label: data.city,
          value: data._id
        })
      })
      stateValues.city_options = cityArray;
      this.setState({
        city_options: cityArray
      })
    }).catch((e) => {
      console.log(e);
      swal('Oops!',`${e.response.data.error}` );
    });


    if (this.state.id) {
      let stateValues = this.state;
      axios.get('http://localhost:3005/displayoneAccused/' + this.state.id).then(res => {
        console.log(res.data);
        if (res.status == 200) {
          stateValues.name = res.data.data.name;
          stateValues.father_name = res.data.data.father_name;
          stateValues.age = res.data.data.age;
          stateValues.address = res.data.data.address;
          stateValues.contact = res.data.data.contact;
          stateValues.district = res.data.data.district ? { label: res.data.data.district.dist_name, value: res.data.data.district._id } : null;
          stateValues.city = res.data.data.city ? { label: res.data.data.city.city, value: res.data.data.city._id } : null;
          stateValues.profession = res.data.data.profession;
          console.log(stateValues.district);
          this.setState({
            ...stateValues
          });
        }
        else {
          console.log(res);
        }
      }).catch((e) => {
        console.log(e);
        swal('Oops!',`${e.response.data.error}` );
      })
    }
  }

  schema = () => {
    return (
      Yup.object().shape({
        name: Yup.string().required('Name Required'),
        father_name: Yup.string().required('father name required!'),
        district: Yup.string().required('district required!'),
        city: Yup.string().required('city required'),
        address: Yup.string().required('address required!'),
        age: Yup.number().required('age required!').nullable().min(0, 'age must be positive number'),
        profession: Yup.string().required('profession required!'),
        contact: Yup.string().required('contact required!')
      })
    )

  }
 
  


  submitForm = (e) => {
    // console.log(e);
    let addAccused = {
      name: e.name,
      age: e.age,
      father_name: e.father_name,
      district: e.district.value,
      city: e.city.value,
      profession: e.profession,
      contact: e.contact,
      address: e.address,
      // case_id   : this.state.case_id.value
    }
    console.log(addAccused);

    if (this.state.id) {
      // console.log(this.state.id);
      swal({
        title: "Edit Accused!!",
        text: "Enter Data Want To Change in Accused?",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        buttons: true
      }).then((willUpdate) => {
        if (willUpdate) {
          axios.put('http://localhost:3005/updateaccused/' + this.state.id, addAccused).then(res => {
            console.log(res.data);
            if (res.status == 200) {
              this.props.history.push('/cases/accuses');
            }
            else {
              console.log(res);
            }

          }).catch((e) => {
            console.log(e);
            swal('OOPS!', e.response.data.message);
          })
        }

      })

    }
    else {
      // console.log('post');
      this.props.reduxData(addAccused);
      axios.post('http://localhost:3005/createdaccused', addAccused).then(res => {
        console.log(res.data);
        if (res.status == 200) {
          swal({
            title: 'Success!',
            text: 'Accused Added Succesfully!',
            icon: 'success',
            button: 'OK!'
          });
          this.props.history.push('/cases/accuses');
        }
        else {
          console.log(res);
        }

      }).catch((e) => {
        console.log(e);
        swal('OOPS!', e.response.data.message);
      })
    }

  }
  districtChange = (e, values) => {
    console.log(e);
    this.setState({
      ...values,
      district: e
    })
    let stateValues = this.state;
    axios.get('http://localhost:3005/citiesbydistrictid/?dist_id='+e.value).then(res=>{
      console.log(res.data);
     if(res.status == 200){
      let result = res.data.data.filter((status) => {
        if (status.status == true) {
          return status;
        }
      });
      res.data.data = result;
      let cityArray = [];
      res.data.data.map((data, index) => {
        cityArray.push({
          label: data.city,
          value: data._id
        })
      })
      stateValues.city_options = cityArray;
      this.setState({
        city_options: cityArray
      })
     }
    }).catch((e) => {
      console.log(e);
      swal('Oops!',`${e.response.data.error}` );
    });

    
  }
  

  

  cityChange = (e) => {
    
    this.setState({
      ...this.state,
      city: e
    })

  }

  render() {
    // console.log(this.state.case_options);
    return (
      <Formik
        enableReinitialize={true}
        initialValues={this.state}
        validationSchema={this.schema}
        onSubmit={this.submitForm}
        render={({
          keepDirtyOnReinitialize,
          setFieldValue,
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
          <Row>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong> Accused Information</strong>
                </CardHeader>

                <Form className="form-horizontal" onSubmit={handleSubmit} noValidate>
                  <CardBody>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          valid={!errors.name}
                          invalid={touched.name && !!errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">father Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" name="father_name" placeholder="Father Name"
                          value={values.father_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          valid={!errors.father_name}
                          invalid={touched.father_name && !!errors.father_name}
                        />
                        <FormFeedback>{errors.father_name}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Age</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="number" name="age" id="text-input2"
                          value={values.age} placeholder="Age"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          valid={!errors.age}
                          invalid={touched.age && !!errors.age}
                        />
                        <FormFeedback style={{fontSize : '15px'}}>{errors.age}</FormFeedback>

                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">District</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Select name='district'
                          options={this.state.district_options}
                          value={values.district}
                          onChange={(e) => this.districtChange(e, values)}
                          valid={!errors.district}
                          invalid={errors.district && touched.district}
                        />
                        {touched.district ? <div style={{
                          color: "#f86c6b",
                          marginTop: ".25rem",
                          fontSize: "80%"
                        }}>{errors.district}</div> : null}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">City</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Select name='city'
                          options={this.state.city_options}
                          value={values.city}
                          onChange={this.cityChange}
                          valid={!errors.city}
                          invalid={errors.city && touched.city}
                        //  invalid={errors.city && touched.city} 
                        />
                        {touched.city ? <div style={{
                          color: "#f86c6b",
                          marginTop: ".25rem",
                          fontSize: "80%"
                        }}>{errors.city}</div> : null}
                      </Col>

                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Address</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="textarea" name="address" id="text-input3" value={values.address} placeholder="Address"
                          onChange={handleChange} onBlur={handleBlur}
                          valid={!errors.address}
                          invalid={touched.address && !!errors.address}
                        />
                        <FormFeedback>{errors.address}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Profession</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" name="profession" placeholder="Profession"
                          id="text-input4"
                          value={values.profession}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          valid={!errors.profession}
                          invalid={touched.profession && !!errors.profession}
                        />
                        <FormFeedback>{errors.profession}</FormFeedback>

                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Contact</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" name="contact"
                          placeholder="contact"
                          id="text-input4"
                          value={values.contact}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          valid={!errors.contact}
                          invalid={touched.contact && !!errors.contact}
                        />
                        <FormFeedback>{errors.contact}</FormFeedback>
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
        )} />)
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(addAccuses(values))
  }
}


export default connect(null,mapDispatchToProps)(addAccused);