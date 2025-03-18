import React from 'react';
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
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
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import axios from '../containers/Axios/config';
import { Link } from 'react-router-dom';
import { AppSwitch } from '@coreui/react';
import * as Yup from 'yup';
import swal from 'sweetalert';
import object from 'core-js/core/object';
import { createRole } from './rolesSlice';
import { connect } from 'react-redux';

class addPermission extends React.Component {

  state = {
    role_name: "",
    initialRolesData: [{ menu: 'Select All', id: 0, identifier: 'select_all' },
    { menu: 'Dashboard', id: 1, identifier: 'dashboard' },
    { menu: 'Case', id: 2, identifier: 'cases' },
    { menu: 'AddCase', id: 3, identifier: 'addCase' },
    { menu: 'SearchCase', id: 4, identifier: 'searchCase' },
    { menu: 'Accused', id: 5, identifier: 'accused' },
    { menu: 'Management', id: 6, identifier: 'management' },
    { menu: 'Users', id: 7, identifier: 'users' },
    { menu: 'Permissions', id: 8, identifier: 'permissions' },
    { menu: 'Locations', id: 9, identifier: 'locations' },
    { menu: 'District', id: 10, identifier: 'district' },
    { menu: 'City', id: 11, identifier: 'city' },
    { menu: 'Extras', id: 12, identifier: 'extras' },
    { menu: 'Dropdown', id: 13, identifier: 'dropdowns' },
    { menu: 'Contact Us', id: 14, identifier: 'contactUs' },
    { menu: 'Custom Forms', id: 15, identifier: 'customforms' },
    { menu: 'Add Forms', id: 16, identifier: 'addforms' },
    { menu: 'Use Form', id: 17, identifier: 'useforms' },
    ],
    updatedData: [],
    role_id: this.props.match.params.id
  }

  componentDidMount() {
    let ChangeRole = [];

    if (this.props.match.params.id == 'new') {
      this.state.initialRolesData.map((data, index) => {
        // console.log(data);
        ChangeRole.push({
          menu: data.menu,
          id: data.id,
          [data.identifier]: { canView: false, canCreate: false, canUpdate: false, canDelete: false }
        })
        //   [{menu : 'select All',id : 0, select_all :{canView : false, canCreate : false, canUpdate : false, canDelete : false} }, 
        //   {menu : 'Dashboard', id : 1, dashboard : {canView : false, canCreate : false, canUpdate : false, canDelete : false}},
        //   {menu : 'Case', id : 2, cases : {canView : false, canCreate : false, canUpdate : false, canDelete : false}},
        //   {menu : 'AddCase', id : 3, addCase : {canView : false, canCreate : false, canUpdate : false, canDelete : false}},
        //   {menu : 'SearchCase', id : 4, searchCase : {canView : false, canCreate : false, canUpdate : false, canDelete : false}},
        //   {menu : 'Accused', id : 5, accused : {canView : false, canCreate : false, canUpdate : false, canDelete : false}},
        // ]

      })
      this.setState({
        updatedData: ChangeRole
      })
    }

    if (this.props.match.params.id != 'new') {
      axios.get('http://localhost:3005/displayonerole/' + this.state.role_id).then(res => {
        console.log(res);
        // console.log(this.state.initialRolesData);
        this.state.role_name = res.data.data.data.role_name;
        let updateRoleData = [];
        this.state.initialRolesData.map((data, index) => {
          updateRoleData.push({
            id: data.id,
            [data.identifier]: res.data.data.data[data.identifier]
          })
        })

        // console.log(updateRoleData);
        this.setState({
          ...this.state.role_name,
          updatedData: updateRoleData
        })

      }).catch((e) => {
        console.log(e)
      })

    }

  }

  routeChange = () => {
    this.props.history.push('/management/roleslist');
  }

  submitForm = (value) => {
    //  console.log(value);
    let object = {};
    object['role_name'] = value.role_name;
    this.state.initialRolesData.map((data, index) => {
      console.log(data.identifier);
      object[data.identifier] = this.state.updatedData[index][data.identifier];
      // console.log(object[data.identifier]=this.updatedData[index][data.identifier]);
    });

    // console.log(object);


    let userId = localStorage.getItem('userId');

    if (this.props.match.params.id != 'new') {
      swal({
        title: "Edit Accused!!",
        text: "Enter Data Want To Change in Role?",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        buttons: true
      }).then((willUpdate) => {
        if (willUpdate) {
          axios.put('http://localhost:3005/updaterole/' + this.props.match.params.id, object).then(res => {
            console.log(res.data);
            this.props.history.push('/management/roleslist');
            window.location.reload(true);
          }).catch((e) => {
            console.log(e);
          }).catch((e) => {
            console.log(e);
            swal('OOPS!', e.response.data.message);
          })
        }

      })

    }

    else {
      if (this.props.match.params.id == 'new') {
        this.props.reduxData(object);
        axios.post('http://localhost:3005/createrole/' + userId, object).then(res => {
          console.log(res.data.data._id);
          if (res.status == 200) {
            localStorage.setItem('role_id', res.data.data._id);
            swal({
              title: 'Success!',
              text: 'Role Added Succesfully!',
              icon: 'success',
              button: 'OK!'
            });
          }
          this.props.history.push('/management/roleslist');
        }).catch((e) => {
          console.log(e.response.data.message);
          swal('OOPS!', e.response.data.message);
        })
      }

    }


  }



  toggleSwitch = (cell, row, object) => {
    // let a = []; a[row.id]


    // console.log(this.state.updatedData[row.id]); 
    var toggle = this.state.updatedData[row.id] ? this.state.updatedData[row.id][row.identifier][object] : false
    // console.log(toggle);
    // console.log(this.state.updatedData[row.id] ? this.state.updatedData[row.id][row.identifier][object] : false);
    // this.state.updatedData[row.id] -> {menu : "dashboard", id : 1, identifier : {canView : false, canCreate : false, canDelete: false, canUpdate : false }}
    // this.state.updatedData[row.id][row.identifier] -> {canView : false, canCreate : false, canDelete : false, canUpdate : false}
    //this.state.updatedData[row.id][row.identifier][object] ->  false
    //  console.log(this.state.updatedData);

    return (
      <AppSwitch className={'mx-1'}

        variant={'pill'}
        color={'primary'}
        checked={toggle}
        // value = {this.state.updatedData}
        onChange={() => this.toggleChange(row, toggle, object)}
      />
    )
  }
  toggleChange = (row, toggle, object) => {
    //  console.log(row,toggle,object);
    var changeRoles = this.state.updatedData;
    if (row.identifier === 'select_all') {
      this.state.initialRolesData.map((e, index) => {
        changeRoles[index][e.identifier][object] = !toggle;
      })

      this.setState({
        updatedData: changeRoles
      })

    }
    else {
      changeRoles[row.id][row.identifier][object] = !changeRoles[row.id][row.identifier][object];
      if (changeRoles[row.id][row.identifier][object] == false) {
        changeRoles[0]['select_all'][object] = false;
      }



      this.setState({
        updatedData: changeRoles
      })
    }
  }

  schema = () => {
    return (
      Yup.object().shape({
        role_name: Yup.string().required('Role Name Required')
      })
    )

  }

  render() {
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
          <>
            <Form className="form-horizontal" onSubmit={handleSubmit} noValidate>
              <Row>
                Role Name :
                <Input style={{ width: '25%', marginBottom: '15px', marginLeft: '10px' }}
                  type="text"
                  name="role_name"
                  placeholder="Role Name"
                  value={values.role_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={!errors.role_name}
                  invalid={touched.role_name && !!errors.role_name}
                />
                <FormFeedback>{errors.role_name}</FormFeedback>
              </Row>
              <BootstrapTable data={this.state.initialRolesData}  >
                <TableHeaderColumn isKey={true} dataField="menu">Menu</TableHeaderColumn>
                <TableHeaderColumn dataField='view' formatExtraData='canView' dataFormat={this.toggleSwitch}>View</TableHeaderColumn>
                <TableHeaderColumn dataField='create' formatExtraData='canCreate' dataFormat={this.toggleSwitch}>Create</TableHeaderColumn>
                <TableHeaderColumn dataField='update' formatExtraData='canUpdate' dataFormat={this.toggleSwitch}>Update</TableHeaderColumn>
                <TableHeaderColumn dataField='delete' formatExtraData='canDelete' dataFormat={this.toggleSwitch}>Delete</TableHeaderColumn>
              </BootstrapTable>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger" style={{ marginLeft: '3px' }} onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
              </CardFooter>
            </Form>
          </>
        )} />)
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(createRole(values))
  }
}


export default connect(null,mapDispatchToProps)(addPermission);
