﻿import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Header, Image, Container, Divider, Grid, Menu, Segment, Icon, Popup, Form, Table, Label } from 'semantic-ui-react';
import $ from 'jquery';

class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: [],
            isHidden: true
        };

        this.loadData = this.loadData.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

 //// for binding all tha table details using Ajax call logic
    loadData() {
        $.ajax({
            url: '/Customers/GetCustomerList',
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            processData: false,
            beforeSend: function () { // loading...
                $('#loading').show();
            }
        }).done((data) => {

            $('#loading').hide();
            this.setState({
                serviceList: data
            })
        });
    }

 //Add event functionalities performed by Ajax call logic
    add(event) {
          const formData = new FormData(event.target);
        let dataJSON = {};

        event.preventDefault();

        for (let entry of formData.entries()) {
            dataJSON[entry[0]] = entry[1];
        }
 console.log(dataJSON);
fetch('/Customers/CreateCustomer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataJSON)
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                window.location.reload();
            });
        });
    }
//Handle Change Event to Set th Values into States
 handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //Edit or Update functionalities performed by Ajax call logic
    update(id) {

        var data = {
            name: this.state.name,
            address: this.state.address,
            id: id
        };
        $.ajax({
            url: '/Customers/EditCustomerRecord',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done((data) => {
            console.log(data);
            this.setState({
                serviceList: data
            });

        });
        window.location.reload();
    }

    //Delete functionalities performed by Ajax call logic
    delete(id) {
        var that = this;
        $.ajax({
            url: '/Customers/Delete',
            type: "POST",
            dataType: "JSON",
            data: { 'id': id },
            success: function (response) {

                if (response.isExist === true) {


                    that.setState({ isHidden: false });
                    $("#btnDelete").prop('disabled', true);
                }
                else {
                    that.setState({ isHidden: true });
                    window.location.reload();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);

            }
        });
    }

    render() {
        let serviceList = this.state.serviceList;
        let tableData = null;
        if (serviceList !== "") {
            tableData = serviceList.map(service =>
                <Table.Row key={service.ID}>
                    <Table.Cell >{service.Name}</Table.Cell>
                    <Table.Cell >{service.Address}</Table.Cell>

                    <Table.Cell >
                        <Modal id="modal" trigger={<Button color="yellow" ><Icon name="edit" />Edit</Button>}  >
                            <Modal.Header class="uiHeader" >Details customer</Modal.Header>
                            <Modal.Content>
                                <Form ref="form" method="POST" onSubmit={this.update.bind(this, service.ID)}>
                                    <Form.Field>
                                        <Label color="grey">Name</Label><br />
                                        <input type="text" name="name" required onChange={this.handleChange} defaultValue={service.Name} /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label color="grey">Address</Label><br />
                                        <input name="address" required onChange={this.handleChange} defaultValue={service.Address} /> <br />
                                    </Form.Field>
                                    <Button type='submit'><Button color="green"><Icon name="save" />save</Button></Button>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
 
                    <Table.Cell>
                        <Modal id="deleteModal" onClose={this.props.onClose} trigger={<Button color="red" onClick={() => this.setState({ isHidden: true })}><Icon name="trash" />Delete</Button>}>
                            <Modal.Header>Delete Customer</Modal.Header>
                            <Modal.Content>
                                {this.state.isHidden && <Label>Are you sure, you want to delete?</Label>}
                                {!this.state.isHidden && <Label >Sorry!you can not delete this Customer</Label>}
                                <Button id="btnDelete" onClick={this.delete.bind(this, service.ID)} color="red"><Icon name="trash" />Delete</Button>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            );
        }

        return (
            <React.Fragment>
                <div>

                    <Modal id="modal" trigger={<Button color="blue" id="buttonModal">Add a new customer</Button>}  >
                        <Modal.Header >Add a new customer</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.add} ref="form" method="POST">
                                <Form.Field>
                                    <Label color='grey'>Name</Label><br />
                                    <input type="text" placeholder="Type a name" name="name" required
                                        minlength="3" maxlength="20" /><br />
                                </Form.Field>
                                <Form.Field>
                                    <Label color='grey'>Address</Label><br />
                                    <input placeholder="Type an address" name="address" required /><br />
                                </Form.Field>
                                <Button type='submit'><Button color="green"><Icon name="save" />save</Button></Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
 
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Customer name</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>Action (Edit)</Table.HeaderCell>
                                <Table.HeaderCell>Action (Delete)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tableData}
                        </Table.Body>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

{/* rendering the component */ }
const app = document.getElementById('customers');
ReactDOM.render(<div><h1 className="anim">Customer Details</h1><Customer /></div>, app);
export default Customer;