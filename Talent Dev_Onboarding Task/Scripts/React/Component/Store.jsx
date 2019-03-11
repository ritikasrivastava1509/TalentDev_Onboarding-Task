import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal,  Icon,  Form, Table, Label } from 'semantic-ui-react';
import $ from 'jquery';

{/* Model class store */ }
class Store extends React.Component {
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

    loadData() {
 // For binding all tha table details using Ajax call logic     
        $.ajax({
            url: '/Stores/GetStoreList',
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
            });
        });
    }

 //Add event functionalities performed by Ajax call logic
    add(event) {
           
        const formData = new FormData(event.target)
        let dataJSON = {};

        event.preventDefault()

        for (let entry of formData.entries()) {
            dataJSON[entry[0]] = entry[1];
        }

        console.log(dataJSON);

        fetch('/Stores/CreateStore', {
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
//
//Handle Change Event to Set th Values into StatesS
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
            url: '/Stores/EditStoreRecord',
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
//Delate functionalities with Ajax call logic
    delete(id) {
        var that = this;
        $.ajax({
            url: '/Stores/Delete',
            type: "POST",
            dataType: "JSON",
            data: {'id':id},
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
   //Edit Modal using Semantic UI
                        <Modal id="modal" trigger={<Button color="yellow" ><Icon name="edit" />Edit</Button>}  >
                            <Modal.Header >Details store</Modal.Header>
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
  //Delete Modal using Sematic UI
                    <Table.Cell>
                        <Modal id="deleteModal" onClose={this.props.onClose} trigger={<Button color="red" onClick={() => this.setState({ isHidden: true })}><Icon name="trash" />Delete</Button>}>
                            <Modal.Header>Delete Store</Modal.Header>
                            <Modal.Content>
                                {this.state.isHidden && <Label>Are you sure, you want to delete?</Label>}
                                {!this.state.isHidden && <Label >Sorry!you can not delete this Storet</Label>}
                                <Button id="btnDelete" onClick={this.delete.bind(this, service.ID)} color="red"><Icon name="trash" />Delete</Button>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            );
     }
  //Add Modal
        return (
            <React.Fragment>
                <div>
                    <Modal id="modal" trigger={<Button color="blue" id="buttonModal">Add a new store</Button>}  >
                        <Modal.Header >Add a new store</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.add} ref="form" method="POST">
                                <Form.Field>
                                    <Label color="grey">Name</Label><br />
                                    <input type="text" placeholder="Type a name for the store" name="name" required minlength="3" maxlength="20" /><br />
                                </Form.Field>
                                <Form.Field>
                                    <Label color="grey">Address</Label><br />
                                    <input placeholder="Type an address" name="address" /><br />
                                </Form.Field>
                                <Button type='submit'><Button color="green"><Icon name="save" required />save</Button></Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
    //Table Detalis
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Store name</Table.HeaderCell>
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
const app = document.getElementById('stores');
ReactDOM.render(<div><h1 className="anim">Stores Details</h1><Store /></div>, app);
export default Store;