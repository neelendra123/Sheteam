import React from "react";
import axios from '../../containers/Axios/config';
import Select from "react-select";
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
import { ReactFormGenerator } from 'react-form-builder2';
import swal from 'sweetalert';

class addForm extends React.Component {

    state = {
        formOptions: [],
        formName: '',
        InputForm: '',
        formData : ''
    }

     routeChange = () =>{
        this.props.history.push('/customfields');
      }

    componentDidMount() {
        axios.get('http://localhost:3005/displayfields').then(res => {
            console.log(res.data);
            let formArray = [];
            res.data.data.map((data, index) => {
                formArray.push({
                    label: data.form_name,
                    value: data._id
                })
            })
            this.setState({
                formOptions: formArray
            })

        }).catch((e) => {
            console.log(e)
        })
    }

    Inputchange = (e) => {
        console.log(e);
        this.setState({
            formName: e
        })
        axios.get('http://localhost:3005/displayonefeild/' + e.value).then(res => {
            console.log(res.data.data.formData);
            if(res.status == 200){
                this.setState({
                    InputForm: res.data.data.formData
                })
            }
           
        }).catch((e) => {
            console.log(e);
        })

    }
    handleSubmit = (e) =>{
        console.log(e);
        let payload = {
            formData : e
        };
        axios.post('http://localhost:3005/addformdata',payload).then(res=>{
                console.log(res.data);
               if(res.status == 200){
                   swal('Form Data successfully saved!');
                   this.props.history.push('/customfields');
               }
        }).catch((e)=>{
            console.log(e);
            swal('OOPS!',e.response.data.message)
        })
    }


    render() {
        return (
            <>
                <Card>
                    <CardHeader>
                        CustomForm Feild
                    </CardHeader>
                    <CardBody>
                        <FormGroup>
                            <Col xs="12" md="6">
                                Select Custom Form :
                                <Select
                                    name='formName'
                                    options={this.state.formOptions}
                                    onChange={this.Inputchange}
                                    value={this.state.formName}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {this.state.InputForm ?
                                <ReactFormGenerator 
                                data={this.state.InputForm}
                                onSubmit = {this.handleSubmit}
                                />
                                : null}
                        </FormGroup>
                    </CardBody>
                    <CardFooter>
                    <Button type="reset" size="sm" color="danger" onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                    </CardFooter>
                </Card>
            </>
        )
    }
}

export default addForm;