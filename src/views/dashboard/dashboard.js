import React from 'react';
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
  } from 'reactstrap';
import { BootstrapTable ,TableHeaderColumn, DeleteButton} from 'react-bootstrap-table';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Badge,Card, CardBody, CardHeader} from 'reactstrap';
import {Link} from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; 
import swal from 'sweetalert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {AppSwitch} from '@coreui/react';
import axios from '../../containers/Axios/config'
import { connect } from 'react-redux';
class dashboard extends React.Component{
    state = {
        cases : [],
        accuses : []
    }
    constructor(props){
        super(props)
    }

    componentDidMount(){
        axios.get('http://localhost:3005/displaycases/'+localStorage.getItem('roleId')).then(res=>{
            //console.log(res.data);
            this.setState({
                cases : (res.data.data.data),
            });
        }).catch((e)=>{
            console.log(e)
        })
        axios.get('http://localhost:3005/displayaccused/'+localStorage.getItem('roleId')).then(res=>{
          this.setState({
            accuses : (res.data.data.data)
          })
        }).catch((e)=>{
          console.log(e)
        })
    }
    dateFormat = (cell,row) => {
        var timestamp = new Date(row.createdAt);
        var month = timestamp.getDate();
        var year = timestamp.getFullYear();
        var options = { month: 'long'};
        let month2 =new Intl.DateTimeFormat('en-US', options).format(timestamp);
      
       return(
         <p>{month} {month2} {year}</p>
       )
  
      }
      indexNum = (cell, row, enumObject, index) => {
        let row_index = (index+1);
       
        return (<div>{row_index}</div>) 
      }
      toggleSwitch = (cell,row) => {

        return(
          <AppSwitch className={'mx-1'} variant={'pill'} name="status" color={'primary'} value= {row.status}  checked= {Boolean(row.status) === true? true : false} 
          onChange ={(e)=>{this.onChange(e,row)}}
          />
        )
      }
  
      onChange = (e,row) => {
        let data = row;
        data.status = !row.status;
        if(data.status === true){
          swal('case enabled succefully!', row.complaint_name)
        }
        else{
          swal('case disabled succefully!',row.complaint_name)
        }
        axios.put('http://localhost:3005/updatecase/'+row._id,data).then(res=>{
          console.log(res.data);
        }).catch((e)=>{
          console.log(e);
        })
  
      }

      actionsHandle = (cell,row) => {
        // console.log(row._id);
        return (
          <span>
            <Link to={`/cases/updatecases/${row._id}`}>
                <i class="fa fa-pencil" aria-hidden="true"></i>
                </Link>
                <Link to = {`/cases/viewcases/${row._id}`}>
                <i class="fa fa-eye" aria-hidden="true" style={{marginLeft : '10px'}} ></i>
                </Link>
          </span>
        )
      }
      casesRoute = () => {
        this.props.history.push('/cases/searchcases');
      }
      accusesRoute = () => {
        this.props.history.push('/cases/accuses');
      }


    render(){
        return(
            <>
           <div className='row'> 
             <div className='col-sm-10 col-lg-3' onClick={this.casesRoute} style={{backgroundColor : 'skyblue', height : '100px', cursor : 'pointer'}}>
               <p style={{ justifyContent : 'center', marginTop : '10px'}}>{this.state.cases.length}</p> 
                <p>Total Cases</p>
             </div>
             <div className='col-sm-10 col-lg-3' style={{marginLeft : '15px' , height : '70px', backgroundColor : '#39f' }}>
          <p style={{ justifyContent : 'center', marginTop : '10px'}}>Cases Under Trial</p>
             </div>
             <div className='col-sm-6 col-lg-2' style={{marginLeft : '15px' ,backgroundColor : '#f9b115' , height : '70px'}}>
          <p style={{ justifyContent : 'center', marginTop : '10px'}}>Convicted cases</p>
             </div>
             <div className='col-sm-6 col-lg-3' onClick={this.accusesRoute} style={{marginLeft : '15px' ,backgroundColor : '#e55353', cursor : 'pointer'}}>
          <p style={{ justifyContent : 'center', marginTop : '10px'}}>{this.state.accuses.length}</p>
          <p >Total Accused</p>
             </div>
           </div>
         
             <Card style={{ marginTop : '30px'}}>
               <CardHeader>
               <i className="icon-menu"></i>Cases
               </CardHeader>
               <CardBody>
               <BootstrapTable  data={this.state.cases} striped={true}  hover search pagination={true}    deleteRows >
               <TableHeaderColumn  width='50px'  isKey dataField="id" dataFormat={this.indexNum}>No</TableHeaderColumn>
                <TableHeaderColumn dataField="complaint_name" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn width='90px' dataField="section" dataSort>section</TableHeaderColumn>
                <TableHeaderColumn  dataField="police_station">Police Station</TableHeaderColumn>
                <TableHeaderColumn  dataField="name_of_policeteam">Police Team</TableHeaderColumn>
                <TableHeaderColumn  dataField="case_report">Description</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.dateFormat}>Case Date</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.toggleSwitch}>Status</TableHeaderColumn>
                <TableHeaderColumn  dataFormat={this.actionsHandle} >Actions</TableHeaderColumn>
              </BootstrapTable>
            </CardBody>
            </Card>
         
            </>
        )
    }

}


export default dashboard;