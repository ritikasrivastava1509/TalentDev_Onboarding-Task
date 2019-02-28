import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Header, Image, Container, Divider, Grid, Menu, Segment, Icon, Popup, Form, Table, Label } from 'semantic-ui-react';
import $ from 'jquery';

class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: []
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

    loadData() {
        $.ajax({
            url: '/Customers/GetCustomersDetails',
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

    add(event) {
        // ajax call logic     
        const formData = new FormData(event.target)
        let dataJSON = {}

        event.preventDefault()

        for (let entry of formData.entries()) {
            dataJSON[entry[0]] = entry[1]
        }

        console.log(dataJSON)

        fetch('/Customers/PostAddOneCustomer', {
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
            })
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    update(id) {
        //ajax call logic
        var data = {
            name: this.state.name,
            address: this.state.address,
            id: id
        }

        $.ajax({
            url: '/Customers/PostUpdateOneCustomer',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done((data) => {
            console.log(data);
            this.setState({
                serviceList: data
            })

        });

    }

    delete(id) {
        //ajax call logic
        $.ajax({
            url: "/Customers/DeleteOneCustomer?customerId=" + id,
            type: "POST",
            dataType: "JSON",
            success: function (response) {
                NotificationManager.success('Success message', 'Title here');
                window.location.reload(); // refresh the page
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }

    render() {
        let serviceList = this.state.serviceList;
        let tableData = null;

        if (serviceList != "") {
            tableData = serviceList.map(service =>
                <Table.Row key={service.Id}>
                    <Table.Cell >{service.Name}</Table.Cell>
                    <Table.Cell >{service.Address}</Table.Cell>
                    <Table.Cell >
                        <Modal id="modal" trigger={<Button color="yellow" ><Icon name="edit" />Edit</Button>}  >
                            <Modal.Header >Details customer</Modal.Header>
                            <Modal.Content>
                                <Form ref="form" method="POST" onSubmit={this.update.bind(this, service.Id)}>
                                    <Form.Field>
                                        <label>Name</label><br />
                                        <input type="text" placeholder="Type a name" name="name" placeholder={service.Name}
                                            onChange={this.handleChange} required minlength="3" maxlength="20" /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Address</label><br />
                                        <input placeholder="Type an address" name="address" placeholder={service.Address} onChange={this.handleChange} required /><br />
                                    </Form.Field>
                                    <Button type='submit'><Icon name="save" />save</Button>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
                    <Table.Cell>
                        <Button color="red" onClick={this.delete.bind(this, service.Id)}><Icon name="trash" />Delete</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }
        return (
            <React.Fragment>
                <div>

                    <Modal id="modal" trigger={<Button color="blue" id="buttonModal">Add a new customer</Button>}  >
                        <Modal.Header >Add a new customer</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.add} ref="form" method="POST">
                                <Form.Field>
                                    <label>Name</label><br />
                                    <input type="text" placeholder="Type a name" name="name" required
                                        minlength="3" maxlength="20" /><br />
                                </Form.Field>
                                <Form.Field>
                                    <label>Address</label><br />
                                    <input placeholder="Type an address" name="address" required /><br />
                                </Form.Field>
                                <Button type='submit'><Icon name="save" />save</Button>
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
                        <Table.Footer>
                        </Table.Footer>
                    </Table>
                </div>
                <div id="loading"><img id="loading-image" src="/images/ajax-loader.gif" /></div>
            </React.Fragment>
        );
    }
}

{/* rendering the component */ }
const app = document.getElementById('customers');
ReactDOM.render(<div><h1 className="anim">Customer Details</h1><Customer /></div>, app);
export default Customer;