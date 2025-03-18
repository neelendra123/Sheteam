import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../containers/Axios/config'
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import {
   Button, Card, CardBody, CardHeader,
  Popover, PopoverHeader, PopoverBody, Label
} from 'reactstrap';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Select from "react-select";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AppSwitch } from '@coreui/react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import './cases.css';
import { displayCases } from './casesSlice';
import { connect } from 'react-redux';
class searchCase extends React.Component {
  state = {
    cases: [],
    case_type: '',
    case_typeoptions: '',
    case_statusoptions: '',
    case_status: '',
    filter_caseType: '',
    filter_caseStatus: '',
    filter_type: '',
    filter_status: '',
    popoverOpen: false,
    checked: false,
    selectedRows: [],
    permissions: { canCreate: false, canView: false, canDelete: false, canUpdate: false }
  }
  constructor(props) {
    super(props);

    this.options = {
      noDataText: 'Empty Table'
    }
  }

  componentDidMount() {
    this.caseTypeOptions();
    axios.get('http://localhost:3005/displaycases/'+localStorage.getItem('roleId')).then(res => {
      console.log(res.data);
      this.props.reduxData(res.data.data.data);
      if(res.status == 200){
        if(res.data.data.permissions.canView == true){
          this.setState({
            cases: (res.data.data.data),
            permissions : res.data.data.permissions
          });
        }
        else{
          swal('OOPS!', 'you are not authenticate user to display cases');
          this.props.history.push('/');
        }
      }
      
    }).catch((e) => {
      console.log(e);
      swal('Oops!', `${e.response.data.error}`);
    })
  }
  caseTypeOptions = () => {
    let stateValues = this.state;
    axios.get('http://localhost:3005/filtertypedropdown').then(res => {

      let caseTypearray = [];
      if(res.status == 200){
        res.data.data.map((data, index) => {
          caseTypearray.push({
            label: data.value,
            value: data._id
          })
        });
        stateValues.case_typeoptions = caseTypearray;
        // console.log(stateValues);
        this.setState({
          // ...stateValues
          case_typeoptions: caseTypearray
        })
      }
     
    }).catch((e) => {
      console.log(e);
      swal('Oops!', `${e.response.data.error}`);
    })

    axios.get('http://localhost:3005/filterstatusdropdown').then(res => {
      let caseStatusarray = [];
      if(res.status == 200){
        res.data.data.map((caseStatus, index) => {
          caseStatusarray.push({
            label: caseStatus.value,
            value: caseStatus._id
          })
        })
        stateValues.case_statusoptions = caseStatusarray;
        this.setState({
          case_statusoptions: caseStatusarray
        })
      }
    }).catch((e) => {
      console.log(e);
      swal('Oops!', `${e.response.data.error}`);
    })

  }

  dateFormat = (cell, row) => {
    var timestamp = new Date(row.createdAt);
    var month = timestamp.getDate();
    var year = timestamp.getFullYear();
    var options = { month: 'long' };
    let month2 = new Intl.DateTimeFormat('en-US', options).format(timestamp);

    return (
      <p>{month} {month2} {year}</p>
    )

  }
  indexNum = (cell, row, enumObject, index) => {
    // console.log(row);
    let row_index = (index + 1);

    return (<div>{row_index}</div>)
  }
  toggleSwitch = (cell, row) => {

    return (
      <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value={row.status} checked={Boolean(row.status) === true ? true : false}
        onChange={(e) => { this.onChange(e, row) }}
      />
    )
  }

  caseType = (cell, row) => {

    if (row.case_type) {
      return (
        <div>{row.case_type.value}</div>
      )
    }
    else {
      return <div></div>
    }
  }
  caseStatus = (cell, row) => {
    // console.log(row);

    if (row.case_status) {
      return (
        <div>{row.case_status.value}</div>
      )
    }
    else {
      return <div></div>
    }
  }

  onChange = (e, row) => {
    let data = row;
    data.status = !row.status;
    axios.put('http://localhost:3005/updatecase/' + row._id, data).then(res => {
      console.log(res.data);
      if(res.status == 200){
        if(row.status === true){
          swal('user enabled succefully!', row.complaint_name)
        }
        if(row.status == false){
          swal('user disabled succefully!',row.complaint_name)
        }
       }
       else{
         console.log(res);
       }
    }).catch((e) => {
      console.log(e);
      swal('OOPS!',e.response.data.message);
    })

  }

  actionsHandle = (cell, row) => {
    return (
      <span>
        {this.state.permissions.canUpdate ?
        <Link to={`/cases/updatecases/${row._id}`}>
          <i class="fa fa-pencil" aria-hidden="true"></i>
        </Link>
      :null}
        {this.state.permissions.canView ?
        <Link to={`/cases/viewcases/${row._id}`}>
          <i class="fa fa-eye" aria-hidden="true" style={{ marginLeft: '10px' }} ></i>
        </Link>
      :null}
      </span>
    )
  }

  Inputchange = (e) => {
    console.log(e);
    let filterName = e.map((label) => {
      return label.label;
    })
    this.setState({
      case_type: e,
      filter_caseType: filterName,
      filter_type: 'Case Type :'
    })

  }


  InputchangeCaseStatus = (e) => {
    // console.log(e);

    let filterName = e.map((label) => {
      return label.label;
    });
    this.setState({
      case_status: e,
      filter_caseStatus: filterName,
      filter_status: 'Case Status :'
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    var stateValues = this.state;

    if (this.state.case_type) {
      let caseTypeInfo = this.state.case_type.map((data) => {
        return data.value;
      });
      stateValues.case_type = caseTypeInfo;
      this.setState({
        case_type: stateValues.case_type
      })
    }

    if (this.state.case_status) {
      let caseStatusInfo = this.state.case_status.map((data) => {
        return data.value;
      });
      stateValues.case_status = caseStatusInfo;
      this.setState({
        case_status: stateValues.case_status
      })
    }
    let caseInfo = {
      case_type: this.state.case_type,
      case_status: this.state.case_status
    }

    console.log(caseInfo);

    axios.post('http://localhost:3005/filtermultiplecases', caseInfo).then(res => {
      console.log(res.data);
      if(res.status == 200){
        this.setState({
          cases: (res.data.data)
        })
      }
    
    }).catch((e) => {
      console.log(e);
      swal('Oops!', `${e.response.data.error}`);
    })

    this.toggle2();
    this.setState({
      case_type: '',
      case_status: ''
    })


  }

  clearStatusData = () => {
    this.setState({
      case_type: '',
      case_status: ''
    })
  }

  toggle2 = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    })
  }



  exportToExcel = (cell, row) => {
    console.log(row);
    const fileType = "xlsx";
    const ws = XLSX.utils.json_to_sheet(this.state.cases);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "myfile" + ".xlsx");
  }

  exportData = () => {
    axios.post('http://localhost:3005/exportdata').then(res => {
      console.log(res);
    }).catch((e) => {
      console.log(e);
      swal('Oops!', `${e.response.data.error}`);
    })
  }

  selectRow = {
    mode: "checkbox"
  };

  filterButton = () => {
    if (this.state.filter_caseType) {
      return (
        <button class="btn btn-primary" ><i class="fa fa-close"></i> {this.state.filter_caseType}</button>
      )
    }
  }
  
  render() {
    const options = {
      withoutNoDataText: true,
    }
  
    return (
      <>
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Cases
            <Button type='button' className='btn btn-info' style={{ float: 'right' }} onClick={this.exportToExcel}>Export</Button>
            <button class="btn" style={{ marginRight: '15px', width: '10%', float: 'right' }} id="Popover3" onClick={this.toggle2}>
              <i class="fa fa-filter" aria-hidden="true" style={{ fontSize: '35px' }}></i>
            </button>
            <Popover placement="top" isOpen={this.state.popoverOpen} target="Popover3" toggle={this.toggle2}>
              <PopoverHeader >Case Type</PopoverHeader>
              <PopoverBody >
                <form onSubmit={this.onSubmit}>
                  <Label for='html' style={{ marginTop: '5px' }}>Case Type</Label>
                  <Select style={{ width: '120%' }} name='case_type' isMulti onChange={this.Inputchange} options={this.state.case_typeoptions} value={this.state.case_type} />

                  {''}
                  <Label for='html' style={{ marginTop: '5px' }}>Case Status</Label>
                  <Select name='case_status' isMulti onChange={this.InputchangeCaseStatus} options={this.state.case_statusoptions} value={this.state.case_status} />

                  <Button type="submit" size="sm" color="primary" style={{ marginTop: '15px' }} ><i className="fa fa-dot-circle-o"></i> Apply </Button>
                  <Button type="reset" size="sm" color="danger" style={{ marginLeft: '23px', marginTop: '10px' }}
                    onClick={this.clearStatusData}><i className="fa fa-ban"></i> Reset</Button>

                </form>
              </PopoverBody>
            </Popover>
          </CardHeader>
          <CardBody>
           
            <BootstrapTable
              data={this.state.cases} striped={true}
              hover search pagination={true} options={options}
              selectRow={this.selectRow} deleteRows >

              <TableHeaderColumn width='80px' isKey={true} dataField="id" dataFormat={this.indexNum}>S.No</TableHeaderColumn>
              <TableHeaderColumn dataField="complaint_name" dataSort>Name</TableHeaderColumn>
              <TableHeaderColumn width='80px' dataField="section" dataSort>section</TableHeaderColumn>
              <TableHeaderColumn dataField="police_station">Police Station</TableHeaderColumn>
              <TableHeaderColumn dataField="name_of_policeteam">Police Team</TableHeaderColumn>
              <TableHeaderColumn dataField="case_report">Description</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.caseType}>Case Type</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.caseStatus}>Case Status</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.dateFormat}>Case Date</TableHeaderColumn>
              <TableHeaderColumn width='70px' dataFormat={this.toggleSwitch}>Status</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.actionsHandle} >Actions</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </>

    )
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    reduxData : (values) => dispatch(displayCases(values))
  }
}


export default connect(null,mapDispatchToProps)(searchCase);