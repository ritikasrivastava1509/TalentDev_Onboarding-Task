import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Header, Image, Container, Divider, Grid, Menu, Segment, Icon, Popup, Form, Table, Label } from 'semantic-ui-react';
import $ from 'jquery';

{/* Model class product */ }
class Product extends React.Component {
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
            url: '/Products/GetProductList',
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
// Add New Product (ajax call logic) 
    add(event) {
        
        const formData = new FormData(event.target);
        let dataJSON = {};

        event.preventDefault();

        for (let entry of formData.entries()) {
            dataJSON[entry[0]] = entry[1];
        }
        console.log(dataJSON);
        fetch('/Products/CreateProduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json,charset=utf-8',
            },
            body: JSON.stringify(dataJSON)
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                window.location.reload();
            });
        });
    }
    // Handle change and set the values in state

    handleChange(e) {
        let convert = "";
        if (e.target.name === "price") {
            convert = parseFloat(e.target.value).toFixed(1); // convert to decimal
            this.setState({
                [e.target.name]: convert
            });
        }
        if (e.target.name === "name"); {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }
 //Edit or Update event performed by Ajax call logic
    update(id) {
         let data = {
            name: this.state.name,
            price: this.state.price,
            id: id
        };
        $.ajax({
            url: '/Products/EditProductRecord',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json,charset=utf-8',
            data: JSON.stringify(data)
        }).done((data) => {
            console.log(data);
            this.setState({
                serviceList: data

            });

        });
        window.location.reload();
    }
 //Delete event performed by Ajax call logic
    delete(id) {
        var that = this;
        //ajax call logic
        $.ajax({
            url: "/Products/Delete",
            type: "POST",
            dataType: "JSON",
            data: { 'id': id },
            success: function (response){
                
                if (response.isExist === true) {
                    //$("errorMessageText").text("Sorry you cannot delete this product");

                    that.setState({ isHidden: false });
                    $("#btnDelete").prop('disabled', true);
                }
                else {
                    that.setState({ isHidden: true });
                    window.location.reload();
                }

                 // refresh the page
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                 }
        });
        //window.location.reload();
    }
    render() {
        let serviceList = this.state.serviceList;
        let tableData = null;

        if (serviceList !== "") {

            tableData = serviceList.map(service =>
                <Table.Row key={service.ID}>
                    <Table.Cell >{service.Name}</Table.Cell>
                    <Table.Cell >{"$ " + parseFloat(service.Price).toFixed(2)} </Table.Cell>
  ////Edit Modal with Semantic UI
                    <Table.Cell >
                        <Modal id="modal" trigger={<Button color="yellow"><Icon name="edit" />Edit</Button>}>   
                            <Modal.Header >Details product</Modal.Header>
                            
                            <Modal.Content>
                                <Form ref="form" method="POST" onSubmit={this.update.bind(this, service.ID)}>
                                    <Form.Field>
                                        <Label color="grey">Name</Label><br />
                                        <input type="text" name="name" required onChange={this.handleChange} defaultValue={service.Name} /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label color="grey">Price</Label><br />
                                        <input type="number" step="0.1" name="price" min="0" onChange={this.handleChange} required defaultValue={service.Price} /><br />
                                    </Form.Field>
                                    <Button type='submit'><Button color="green"><Icon name="save" />save</Button></Button>
                                     </Form>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
// Delete Modal with Semantic UI
                    <Table.Cell>
                        <Modal id="deleteModal" onClose={this.props.onClose} trigger={<Button color="red" onClick={() => this.setState({ isHidden: true })}><Icon name="trash" />Delete</Button>}>
                            <Modal.Header>Delete product</Modal.Header>
                           <Modal.Content>
                               {this.state.isHidden && <Label>Are you sure, you want to delete?</Label>}
                                {!this.state.isHidden && <Label >Sorry!you can not delete this product</Label>}
                                <Button id="btnDelete" onClick={this.delete.bind(this, service.ID)} color="red"><Icon name="trash" />Delete</Button>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            );
        }
  //Add Modal with Semantic UI
        return (
            <React.Fragment>
                <div>
                    <Modal id="modal" trigger={<Button color="blue" id="buttonModal">Add a new price</Button>}  >
                        <Modal.Header >Add a new product</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.add} ref="form" method="POST">
                                <Form.Field>
                                    <Label color="grey">Name</Label><br />
                                    <input type="text" placeholder="Type a name for the product" name="name" required /><br />
                                </Form.Field>
                                <Form.Field>
                                    <Label color="grey">Price</Label><br />
                                    <input type="number" step="0.1" min="0" placeholder="Type an price" name="price" /><br />
                                </Form.Field>
                                <Button type='submit'><Button color="green"><Icon name="save" required />save</Button></Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
  //Table Details using Semantic UI
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Product name</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
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
const app = document.getElementById('products');
ReactDOM.render(<div><h1 className="anim">Products Details</h1><Product /></div>, app);
export default Product;