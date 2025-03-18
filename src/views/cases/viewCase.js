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
import axios from '../../containers/Axios/config';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
class accused extends React.Component{
    constructor(props){
        super(props);
    }
    state = {
        id : this.props.match.params.id,
        cases : '',
        caseType : '',
        caseStatus : '',
        accuses : []
    }
    
    componentDidMount(){
        axios.get('http://localhost:3005/displayonecase/'+this.state.id).then(res=>{
            console.log(res.data);
            if(res.status == 200){
                this.setState({
                    cases : res.data.data,
                    caseType : res.data.data.case_type.value,
                    caseStatus : res.data.data.case_status.value,
                })
            }
            else{
                console.log(res);
            }
           
        }).catch((e)=>{
            console.log(e);
        });
        axios.get('http://localhost:3005/displayaccusesfromcases/'+this.state.id).then(res=>{
            console.log(res.data);
            if(res.status == 200){
                this.setState({
                    accuses : (res.data.data.accused_id)
                  })
            }
            else{
                console.log(res);
            }
        }).catch((e)=>{
            console.log(e);
            swal('Oops!', `${e.response.data.error}`);
        })
    }
    district = (cell,row) => {
        // console.log(row);
        if(row.district){
            return(
                <div>{row.district.dist_name}</div>
           )
        }
        else {
            return<div></div>
        }
       
    }
    city = (cell,row) =>{
        // console.log(row);
        if(row.city){
            return(
                <div>{row.city.city}</div>
            )
        }
        else{
          return <div></div>
        }
       
    }

     deleteAccused = (cell,row)=>{
         console.log(row);
        swal({
            title: "Are you sure?",
            text: "Are you sure you want delete?",
            icon: "warning",
            buttons : true,
            dangerMode: true,
          }).then(willDelete=>{
            if (willDelete) {
                axios.delete(`http://localhost:3005/deleteaccused/${row}`).then(res=>{
                     console.log(res.data);
                     if(res.status == 200){
                        this.setState({
                            accuses : (res.data.data.accused_id)
                         })
                     }
                     
             }).catch((e)=>{
                     console.log(e);
                     swal('Oops!', `${e.response.data.error}`);
            })
            }
          })
    }

    actions = (cell,row) => {
        return(
            <span>
                <Link to={`/cases/accuses/updateaccused/${row._id}`}><i class="fa fa-pencil" aria-hidden="true"></i></Link>
                <i class="fa fa-trash" aria-hidden="true" style={{marginLeft : '10px'}} onClick={()=>{this.deleteAccused(cell,row._id)}} ></i>
            </span>
        )
    }

    render(){
        
        var timestamp = new Date(this.state.cases.createdAt).getDate();
        var timestamp2 = new Date(this.state.cases.createdAt).getFullYear();
        var timestamp3 = new Date(this.state.cases.createdAt).getMonth();
        
        const date = new Date(timestamp2,timestamp3,timestamp);
        const month = date.toLocaleString('default', { month: 'long' });
        
        return(
            <>
          <div class="row">
                <div class="col-sm-3">
                         <CardHeader>
                             <strong>
                                Case Report Information
                                </strong>
                </CardHeader>
                {""}
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>case Number</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.section}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Complaint Name</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.complaint_name}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Case Type</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.caseType}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Section</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.section}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Report Date</Label>
                        </Col>
                        <Col sm={4}>
                       {timestamp} {month} {timestamp2}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Police Station</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.police_station}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Police Team</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.name_of_policeteam}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Case Details</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.cases.case_report}
                        </Col>
                    </Row>
                    <hr/>
                    <Row sm={4}>
                        <Col sm={4}>
                        <Label>Status</Label>
                        </Col>
                        <Col sm={4}>
                        {this.state.caseStatus}
                        </Col>
                    </Row>
                    <hr/>
  </div>
  <div class="col-sm-9">
               <CardHeader>
                   <strong>
                   <i className="icon-menu"></i> Accused Details
                   </strong>
                   {/* <Link to = {`/cases/addaccused/new`}>
                 <Button color="primary" align="right" className="float-right">Add Accused</Button>
               </Link> */}
               </CardHeader>
              
               <BootstrapTable  data={this.state.accuses} striped={true}  hover search pagination={true}   deleteRows >
               {/* <TableHeaderColumn width='80px'  dataField="id" dataFormat={this.indexNum}>S.No</TableHeaderColumn> */}
                <TableHeaderColumn isKey dataField="name" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn  dataField="father_name" dataSort>Father Name</TableHeaderColumn>
                <TableHeaderColumn width='60px'  dataField="age">Age</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.district}>District</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.city}>City</TableHeaderColumn>
                <TableHeaderColumn  dataField='address' >Address</TableHeaderColumn>
                <TableHeaderColumn  dataField='profession' >Profession</TableHeaderColumn>
                <TableHeaderColumn  dataField='contact' >Contact</TableHeaderColumn>
                <TableHeaderColumn  dataFormat={this.actions} >Actions</TableHeaderColumn>
              </BootstrapTable>
      </div>
</div>
            </>
        )
    }
}
export default accused;
 


