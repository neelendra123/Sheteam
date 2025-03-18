import React from 'react';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import {
    Badge, Button,
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
import axios from '../../containers/Axios/config';
import swal from 'sweetalert';

class CustomForm extends React.Component {

    state = {
        id: this.props.match.params.id,
        form_name: '',
        formData: [],
        formNameError: '',
       
    }

    componentDidMount() {
        if (this.state.id != 'new') {

            axios.get('http://localhost:3005/displayonefeild/' + this.props.match.params.id).then(res => {
                console.log(res.data.data);
                if(res.status == 200){
                    this.setState({
                        form_name: res.data.data.form_name,
                        formDisplayData: res.data.data.formData
                    })
                }
               
            }).catch((e) => {
                console.log(e);
                swal('OOPS', `${e.response.data.message}`);
            })
        }

    }

    onChange = (e) => {
        this.setState({
            form_name: e.target.value
        })
    }
    loadFun = (e) => {
        console.log(e);
        this.setState({
            formData: e.task_data
        })

    }

    onSubmit = (e) => {
        e.preventDefault();
        let count = 0;
        if (this.state.form_name == '') {
            count++;
            this.state.formNameError = 'please enter form name!'
        }
        this.setState({
            ...this.state
        })

        if (count == 0) {
            const formPostData = {
                form_name: this.state.form_name,
                formData: this.state.formData
            }
            console.log(formPostData);
            if (this.state.id != 'new') {
            swal({
                title: "Edit Form!!",
                text: "Enter Data Want To Change Form",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                buttons : true
              }).then(willUpdate=>{
                if(willUpdate){
                    axios.put('http://localhost:3005/updateform/' + this.state.id, formPostData).then(res => {
                        console.log(res.data);
                        if (res.status == 200) {
                            this.props.history.push('/customfields');
                        }
                    }).catch((e) => {
                        swal('Not Updated', `please check with ${e.response.data.message}`);
                    })
                }
                else{
                }
              })
            }
           
            if (this.state.id == 'new') {
                axios.post('http://localhost:3005/createform', formPostData).then(res => {
                    console.log(res.data);
                    if (res.status == 200) {
                        swal({
                            title: 'Success!',
                            text: 'Role Added Succesfully!',
                            icon: 'success',
                            button: 'OK!'
                        });
                    }
                    this.props.history.push('/customfields');
                }).catch((e) => {
                    console.log(e.response.data.message);
                    swal(`OOPS!${e.response.data.message}`);
                })
            }
        }
    }

    routeChange = () => {
        this.props.history.push('/customfields');
    }

    items = [
        {
            key: "Header",
            name: "Header Text",
            type: "text",
            icon: "fa fa-header",
            static: true,
            content: "Placeholder Text..."
        },
        {
            key: "TextArea",
            name: "Paragraph",
            type: 'textarea',
            static: true,
            icon: "fa fa-paragraph",
            content: "Placeholder Text..."
        },
        {
            key: "Checkboxes",
            
        },
        {
            key: 'TextInput',
            name: "Input",
            type: 'input',
            static: true,
            icon: "fa fa-align-center",
            content: "Placeholder Text..."
        }, 
         {
            key: 'Image',
            name: "Image",
            type: 'image',
            static: true,
            icon : 'fas fa-camera'
        },
        {
            key: "NumberInput",
            name : 'Number Input',
            type : 'number',
            icon : 'fa fa-plus',
            static: true,
            content: "Placeholder Text..."
            
          },
        {
            key: "DatePicker",
            name : 'DatePicker',
            type : 'date',
            icon : 'fa fa-calendar',
            static: true,
        },
        {
            key: 'RadioButtons',
          
          }
    ];

    render() {
        return (
            <>
                <Card>
                    <CardHeader>
                        Create Custom Form
                    </CardHeader>
                    <Form onSubmit={this.onSubmit}>
                        <Col style={{marginBottom : '15px'}}>
                            Form Name : <Input type='text'
                                name='form_name'
                                value={this.state.form_name}
                                style={{ width: '50%' }}
                                onChange={this.onChange}
                            ></Input>
                            <span style={{ color: 'red' }}>
                                {this.state.formNameError ? this.state.formNameError : null}
                            </span>
                        </Col>
                        <Col>
                            <ReactFormBuilder toolbarItems={this.items} onPost={(e) => { this.loadFun(e) }} />
                        </Col>
                        <CardFooter>
                        <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        <Button type="reset" size="sm" color="danger" style={{marginLeft : '3px'}} onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                        </CardFooter>
                    </Form>
                </Card>

            </>
        )
    }
}

export default CustomForm;