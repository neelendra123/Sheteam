import React, { Component } from 'react';
import { Col, Nav} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import DefaultHeaderDropdown  from './DefaultHeaderDropdown'
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { connect } from 'react-redux';
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        
        <AppNavbarBrand>
          <strong>SHE TEAM</strong>
        </AppNavbarBrand>
        {/* // full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          // minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }} */}
        <AppSidebarToggler className="d-md-down-none" display="lg" />
       
        <Nav className="ml-auto" navbar>
        <Col>
        {/* User Name : {localStorage.getItem('userName')} <br/> */}
        User Role : {localStorage.getItem('roleName')}<br/>
        Email : {this.props.email}
        </Col>
          <DefaultHeaderDropdown onLogout={this.props.onLogout} accnt/>
        </Nav>
      
      </React.Fragment>
    );
  }
}

const mapStateToProps = state =>{
  console.log(state.login.login.useremail);
  return {
      email : state.login.login.useremail
  }
}




DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default connect(mapStateToProps,null)(DefaultHeader);
