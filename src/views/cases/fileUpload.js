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
import axios from '../../containers/Axios/config';
import { FileUploader } from "react-drag-drop-files";
import swal from 'sweetalert';
import sampleFile from './explaindataaccuses.xlsx';

class fileUpload extends React.Component {
    state = {
        selectedFile: ''
    }

    routeChange = () => {
        this.props.history.push('/cases/accuses');
    }

    onChange = (event) => {
        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0]
        })

    }

    dragnDroponChange = (e) => {
        this.setState({
            selectedFile: e
        })

    }
    onSubmit = () => {
        // console.log('1');
        console.log(this.state.selectedFile);
        const data = new FormData();
        data.append('file', this.state.selectedFile);
        axios.post('http://localhost:3005/uploadfileaccuses', data).then(res => {
            console.log(res.data);
            if (res.status == 200) {
                this.props.history.push('/cases/accuses');
                swal('File Uploaded Successfully!');
            }
        }).catch((e) => {
            console.log(e);
            swal('OOPS!',e.response.data.message);
        })
    }


    render() {
        const fileTypes = ["xlsx"];
        return (
            <>
                <Card>
                    <CardHeader>
                        <strong>
                            Upload File
                        </strong>
                        <strong>
                            <a style={{ float: 'right', color: 'green' }} href={sampleFile} download='explaindataaccuses2.xlsx'>
                                Please download the sample file for reference</a>
                        </strong>
                    </CardHeader>
                    <CardBody>
                        <FormGroup>
                            <Input type='file' hoverTitle = 'file' name='selectedFile' onChange={this.onChange}>Select File</Input>
                        </FormGroup>
                        <FormGroup>
                            <FileUploader handleChange={this.dragnDroponChange} name="file" types={fileTypes} />
                        </FormGroup>
                        <div style={{ width : '45%', fontSize : '16px' }}>
                            Instructions for importing the accuses :<br/>
                            1. Please download the sample file for reference and try <br/>to upload the accuses using that file,<br/>
                            2. Please upload maximum of 5,000 accuses at a time,<br/>
                            3. Mandatory Fields : name, father_name,age, profession,address and contact 
                              <br/>
                            4. Please don't change the column names<br/>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button type="button" size="sm" color="primary" onClick={this.onSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        <Button type="reset" size="sm" color="danger" style={{ marginLeft: '3px' }} onClick={this.routeChange}><i className="fa fa-ban"></i> Cancel</Button>
                    </CardFooter>
                </Card>
            </>
        )
    }

}

export default fileUpload;