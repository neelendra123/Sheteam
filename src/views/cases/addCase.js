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
  Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import Select from "react-select";
// import "react-select/dist/react-select.min.css";

import { AppSwitch } from '@coreui/react';
import axios from '../../containers/Axios/config'
import swal from 'sweetalert';
import * as Yup from 'yup';
import { useState } from "react";
import { useEffect } from "react";
import addDropdown from "../dropdown/addDropdown";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { addCases } from "./casesSlice";
import { connect } from "react-redux";
function addCase(props) {
  // console.log(props);
  let [caseDetails, setcaseDetails] = useState({
    complaint_name: '',
    case_type: null,
    section: null,
    police_station: null,
    name_of_policeteam: null,
    title: '',
    case_status: null,
    case_typeoptions: '',
    case_statusoptions: '',
    case_report: null,
    accused_id: null,
    accusesoptions: '',
    status: true
  });
  let [status, setStatus] = useState({
    popoverOpen: false
  });
  let [status2, setStatus2] = useState({
    popoverOpen: false
  });
  let [dropdown, setDropdown] = useState({
    value: '',

  })

  let routeChange = () => {
    props.history.push('/cases/searchcases');
  }

  useEffect(() => {
    displaydropDown();
    if (props.match.params.id) {
      // console.log(props.match.params.id);
      let stateValues = caseDetails;
      axios.get('http://localhost:3005/displayonecase/' + props.match.params.id).then(res => {
        console.log(res.data.data.accused_id);
        let accusedList = res.data.data.accused_id;
        let accusedArray = [];
        for (let i = 0; i < accusedList.length; i++) {
          let accusedOptions = accusedList;
          // console.log(accusedOptions);
          accusedArray.push({ label: accusedOptions[i].name, value: accusedOptions[i]._id });

        }
        stateValues.accused_id = accusedArray;
        console.log(stateValues.accused_id);
        setcaseDetails({
          ...stateValues
        })

        //  let accusedOptions = res.data.data.accused_id.map((data)=>{
        //           return {label : data.name, value : data._id};
        //   });


        // console.log(accusedOptions);

        let optionsCaseType = { label: res.data.data.case_type.value, value: res.data.data.case_type._id };
        let optionscaseStatus = { label: res.data.data.case_status.value, value: res.data.data.case_status._id };

        stateValues.complaint_name = res.data.data.complaint_name;
        stateValues.case_type = optionsCaseType;
        stateValues.section = res.data.data.section;
        stateValues.police_station = res.data.data.police_station;
        stateValues.name_of_policeteam = res.data.data.name_of_policeteam;
        stateValues.case_report = res.data.data.case_report;
        stateValues.case_status = optionscaseStatus;
        // stateValues.case_typeoptions = optionsaccused;
        // stateValues.case_statusoptions = accusedOptions;
        // console.log(stateValues.case_statusoptions);
        stateValues.title = 'Edit';
        setcaseDetails({
          ...stateValues
        })
      });
      // console.log(caseDetails);
    }

  }, []);

  let displaydropDown = () => {
    // console.log('1');
    let stateValues = caseDetails;
    axios.get('http://localhost:3005/filtertypedropdown').then(res => {
      // console.log(res.data);
      let resultCaseType = res.data.data.filter((status) => {
        if (status.status == true) {
          return status;
        }
      });
      res.data.data = resultCaseType;
      let caseTypearray = [];
      res.data.data.map((data, index) => {
        caseTypearray.push({
          label: data.value,
          value: data._id
        })

      });
      // console.log(caseTypearray);
      stateValues.case_typeoptions = caseTypearray;
      axios.get('http://localhost:3005/filterstatusdropdown').then(res => {
        // console.log(res.data);
        let resultCaseStatus = res.data.data.filter((status) => {
          if (status.status == true) {
            return status;
          }
        });
        res.data.data = resultCaseStatus;
        let caseStatusarray = [];
        res.data.data.map((caseStatus, index) => {
          caseStatusarray.push({
            label: caseStatus.value,
            value: caseStatus._id
          })
        })
        //  console.log(caseStatusarray);
        stateValues.case_statusoptions = caseStatusarray;
        //  console.log(stateValues.case_statusoptions);
        setcaseDetails({
          ...stateValues
        });
      });
      // console.log(stateValues);

      setcaseDetails({
        ...stateValues

      })


    }).catch((e) => {
      console.log(e);
    })

    axios.get('http://localhost:3005/displayaccused/' + localStorage.getItem('roleId')).then(res => {
      // console.log(res.data);
      let accusedArray = [];
      res.data.data.data.map((accused, index) => {
        accusedArray.push({
          label: accused.name,
          value: accused._id
        })
      })
      // console.log(accusedArray);
      stateValues.accusesoptions = accusedArray;
      // console.log(stateValues.accusesoptions);
      setcaseDetails({
        ...stateValues
      })
    }).catch((e) => {
      console.log(e)
    })

  };

  // console.log(caseDetails.case_typeoptions);
  // console.log(caseDetails.case_statusoptions);

  let Inputchange = (e) => {
    // console.log(e);
    setcaseDetails({
      ...caseDetails,
      case_type: e
    });
  }
  let Inputchange2 = (e) => {
    // console.log(e);
    setcaseDetails({
      ...caseDetails,
      case_status: e
    });
  }

  let Inputchange3 = (e) => {
    // console.log(e);
    setcaseDetails({
      ...caseDetails,
      accused_id: e
    })
  }
  // console.log(caseDetails.accused_id);

  let onSubmit = (e) => {
    // console.log(e);
    let accuses = caseDetails.accused_id.map((data) => {
      return data.value;
    });
    // console.log(accuses);
    const updateCase = {
      complaint_name: caseDetails.complaint_name,
      case_type: caseDetails.case_type.value,
      section: caseDetails.section,
      police_station: caseDetails.police_station,
      name_of_policeteam: caseDetails.name_of_policeteam,
      case_report: caseDetails.case_report,
      case_status: caseDetails.case_status.value,
      accused_id: accuses
    }
    const addCase = {
      complaint_name: e.complaint_name,
      case_type: caseDetails.case_type.value,
      section: e.section,
      police_station: e.police_station,
      name_of_policeteam: e.name_of_policeteam,
      case_report: e.case_report,
      case_status: caseDetails.case_status.value,
      accused_id: accuses

    }
    // console.log(addCase);
    if (props.match.params.id) {
      // console.log(props.match.params.id);
      swal({
        title: "Edit Case!!",
        text: "Enter Data Want To Change in Case?",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        buttons: true
      }).then(willUpdate => {
        if (willUpdate) {
          axios.put('http://localhost:3005/updatecase/' + props.match.params.id, updateCase).then(res => {
            // console.log(res.data);
            if (res.status == 200) {
              props.history.push('/cases/searchcases');
            }
            else {
              console.log(res);
            }


          }).catch((e) => {
            swal('OOPS!', e.response.message);
            // console.log(e);
          });
        }

      }).catch((e) => {
        // console.log(e);
        swal('OOPs', e.response.data.message);
      })

    }
    else {
      // console.log(props.match.params.id);
      props.reduxData(addCase);
      axios.post('http://localhost:3005/createcase', addCase).then(res => {
        // console.log(res.data);
        swal({
          title: 'Success!',
          text: 'Case Added Succesfully!',
          icon: 'success',
          button: 'OK!'
        });
        props.history.push('/cases/searchcases');
      }).catch((e) => {
        console.log(e);
        swal('OOPS!', e.response.data.message);
      });
    }

  }

  let validationSchema =
    Yup.object({
      complaint_name: Yup.string().required('Compliant Required').nullable(),
      // case_type : Yup.string().required('case type required').nullable(),
      case_report: Yup.string().required('case report required!').nullable(),
      police_station: Yup.string().required('police station required!').nullable(),
      section: Yup.number().required('section required!').nullable(),
      name_of_policeteam: Yup.string().required('police station required!').nullable(),
      // case_status : Yup.string().required('case status required!').nullable()
    });

  let toggle2 = () => {
    setStatus({
      popoverOpen: !status.popoverOpen
    });
  }


  let caseTypeChange2 = (e) => {
    // console.log(e.target.value);
    setDropdown({
      value: e.target.value,

    })

  }

  let onSubmit2 = (e) => {
    e.preventDefault();

    // console.log(e);
    let dropdownData = {
      value: dropdown.value,
      DropdownType: 'Case Type'
    }
    // console.log(dropdownData);

    axios.post('http://localhost:3005/createdropdown', dropdownData).then(res => {
      // console.log(res.data);
      swal('dropdown successfully added!');
      displaydropDown();
      setcaseDetails({
        ...caseDetails
      })
    }).catch((e) => {
      console.log(e);
      swal(e.response.data.message);
    })

  }

  let toggle3 = () => {
    setStatus2({
      popoverOpen: !status2.popoverOpen
    });
  }

  let caseStatusonChange = (e) => {
    // console.log(e.target.value);
    setDropdown({
      value: e.target.value,

    })

  }

  let onSubmitcaseStatus = (e) => {
    e.preventDefault();
    // console.log(e);
    let addDropdown = {
      value: dropdown.value,
      DropdownType: 'Case Status'
    }
    // console.log(addDropdown);

    axios.post('http://localhost:3005/createdropdown', addDropdown).then(res => {
      console.log(res.data);
      swal('dropdown successfully added!');
      displaydropDown();
      setcaseDetails({
        ...caseDetails,
      })
    }).catch((e) => {
      console.log(e);
      swal(e.response.data.message);
    })

  }

  return (
    <Formik
      initialValues={caseDetails}
      // validate = {validationSchema}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
        } = formik;
        // console.log(values);
        return (
          <>
            <Row>
              <Col xs="12" md="6">
                <Card >

                  <CardHeader>
                    <strong> {caseDetails.title
                      ? caseDetails.title
                      : 'Create'}</strong>
                  </CardHeader>
                  <CardBody>
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Compliant Name</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input type="text" name="complaint_name" placeholder="Compliant Name" value={values.complaint_name} onChange={handleChange} onBlur={handleBlur} />

                          <span style={{ color: "red" }}>
                            {formik.touched.complaint_name && formik.errors.complaint_name ? formik.errors.complaint_name : null}
                          </span>

                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Case Type</Label>
                        </Col>
                        <Col xs="12" md="5">
                          {/* {console.log(caseDetails.case_typeoptions)} */}
                          <Select name='case_type' onChange={Inputchange} options={caseDetails.case_typeoptions} value={caseDetails.case_type} />

                          <span style={{ color: "red" }}>
                            {formik.touched.case_type && formik.errors.case_type ? formik.errors.case_type : null}
                          </span>
                        </Col>
                        <Button style={{ marginLeft: '15px', width: '25%' }} id="Popover1" onClick={toggle2}>
                          Add caseType
                        </Button>
                        <Popover placement="bottom" isOpen={status.popoverOpen} target="Popover1" toggle={toggle2}>
                          <PopoverHeader>Case Type</PopoverHeader>
                          <PopoverBody>
                            <form onSubmit={onSubmit2}>
                              <input type="text" name="value" value={dropdown.value} onChange={caseTypeChange2} />
                              <Button type="submit">Submit</Button>
                            </form>
                          </PopoverBody>
                        </Popover>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Section</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input type="number" name="section" id="text-input2" value={values.section} placeholder="Section" onChange={handleChange} onBlur={handleBlur} />
                          <span style={{ color: "red" }}>
                            {formik.touched.section && formik.errors.section ? formik.errors.section : null}
                          </span>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Police Station</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input type="text" name="police_station" id="text-input3" value={values.police_station} placeholder="Police Station" onChange={handleChange} onBlur={handleBlur} />
                          <span style={{ color: "red" }}>
                            {formik.touched.police_station && formik.errors.police_station ? formik.errors.police_station : null}
                          </span>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Name Of Polce Team</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input type="text" name="name_of_policeteam" placeholder="Name Of Polce Team" id="text-input4" value={values.name_of_policeteam} onChange={handleChange} onBlur={handleBlur} />
                          <span style={{ color: "red" }}>
                            {formik.touched.name_of_policeteam && formik.errors.name_of_policeteam ? formik.errors.name_of_policeteam : null}
                          </span>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Case Report</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input type="textarea" name="case_report" placeholder="Case Report" id="text-input4" value={values.case_report} onChange={handleChange} onBlur={handleBlur} />
                          <span style={{ color: "red" }}>
                            {formik.touched.case_report && formik.errors.case_report ? formik.errors.case_report : null}
                          </span>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Case Status</Label>
                        </Col>
                        <Col xs="12" md="6">
                          {/* {console.log(values.case_statusoptions)} */}
                          <Select name='case_status' onChange={Inputchange2} options={caseDetails.case_statusoptions} value={caseDetails.case_status} />
                          <span style={{ color: "red" }}>
                            {formik.touched.case_status && formik.errors.case_status ? formik.errors.case_status : null}
                          </span>
                        </Col>
                        <Col>
                          <Button style={{ marginLeft: '15px', width: '90%' }} id="Popover3" onClick={toggle3}>
                            Add case status
                          </Button>
                          <Popover placement="top" isOpen={status2.popoverOpen} target="Popover3" toggle={toggle3}>
                            <PopoverHeader>Case Status</PopoverHeader>
                            <PopoverBody>
                              <form onSubmit={onSubmitcaseStatus}>
                                <input type="text" name="value" value={dropdown.value} onChange={caseStatusonChange} />
                                <Button type="submit">Submit</Button>
                              </form>
                            </PopoverBody>
                          </Popover>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">Accuses</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Select name='accused_id' isMulti onChange={Inputchange3} options={values.accusesoptions} value={caseDetails.accused_id} />
                        </Col>
                      </FormGroup>
                      <CardFooter>
                        <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        <Button type="reset" size="sm" color="danger" style={{ marginLeft: '3px' }} onClick={routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                      </CardFooter>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>

        )
      }

      }
    </Formik>
  )
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(addCases(values))
  }
}

export default connect(null,mapDispatchToProps)(addCase);