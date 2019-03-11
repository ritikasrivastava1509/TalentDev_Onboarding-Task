import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Form, Table, Label, Dropdown } from 'semantic-ui-react';
import $ from 'jquery';
import moment from 'moment';


{/* Model class customer */ }
class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: [],
            saleList: [],
            customersList: [],
            productsList: [],
            storesList: [],
            DateSold: "",



        };

        this.loadData = this.loadData.bind(this);
 // CRUD
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleChange = this.handleChange.bind(this); // dropdown to handle values;
        this.handleDate = this.handleDate.bind(this); // date
        this.handleChangeUpdate = this.handleChangeUpdate.bind(this); // for the update operation
        this.fillDropdown = this.fillDropdown.bind(this);
        this.fillCustomerDropdown = this.fillCustomerDropdown.bind(this);
        this.fillProductDropdown = this.fillProductDropdown.bind(this);
        this.fillStoreDropdown = this.fillStoreDropdown.bind(this);
    }


    componentDidMount() {
        this.loadData();
    }

    loadData() {
  //for binding all tha table details using Ajax call logic

        const day = new Date().getDay() + 1;
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        this.setState({
            curTime: day + '-' + month + '-' + year
        });


        fetch('/Sales/GetSalesList').then(response => { // dropdowns
            response.json().then(data => {

                this.setState({
                    saleList: data,
                    serviceList: data,
                    customersList: data,
                    productsList: data,
                    storesList: data
                });
            });
        });

        $.ajax({
            url: '/Sales/GetSalesList',
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            processData: false,
            beforeSend: function () { // loading...

            }
        }).done((data) => {

            this.setState({
                saleList: data
            });

        });
    }
// Add New Sales (ajax call logic) 
    add(e) {
        e.preventDefault();
     
        $.ajax({
            url: "/Sales/CreateSales",
            type: "POST",
            dataType: "JSON",
            data: {
                customerID: this.state.selectCustomer[0].key,
                productID: this.state.selectProduct[0].key,
                storeID: this.state.selectStore[0].key,
                date: this.state.selectDate
            },
            success: function (data) {

                window.location.reload()

            },
            error: function (error) {
                console.log(error);
            }
        });
    }

//Handle Change Event to Set th Values into States
    handleChangeUpdate(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

 //Edit or Update functionalities performed by Ajax call logic
    update(id) {
       let convert = moment(this.state.newDate).format("DD-MM-YYYY") // by default was MM-DD-YYYY

        let data = {
            customerID: this.state.selectUCustomer[0].key,
            productID: this.state.selectUProduct[0].key,
            storeID: this.state.selectUStore[0].key,
            dateSold: convert,
            id: id
        };

        $.ajax({
            url: '/Sales/UpdateSaleRecord',
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
//Edit or Update functionalities performed by Ajax call logic
    delete(id) {
        $.ajax({
            url: '/Sales/DeleteConfirmed',
            type: "POST",
            dataType: "JSON",
            data: { 'id': id },
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                alert(error);
            }
        });
    }

    // Handle dropdowns
    handleChange(e, data) // data represents the options with all attributes
    {
        e.preventDefault();
        const { value } = data;
        const { key } = data.options.find(o => o.value === value); // find id
        this.setState({ [data.name]: [{ key }, { value }] }); // create a list name of the field and [id,value]
    }

    // Handle date
    handleDate(e) {

        e.preventDefault();
        this.setState({ [e.target.value]: e.target.value });

    }
 /*dynamic list to fill up the dropdow*/
    fillCustomerDropdown(list) {


        let result = [];
        for (var key in list) {
            result.push({ key: list[key]["CustomerID"], text: list[key]["CustomerName"], value: list[key]["CustomerName"] });
        }
        return result;
    }
    fillProductDropdown(list) {


        let result = [];
        for (var key in list) {
            result.push({ key: list[key]["ProductID"], text: list[key]["ProductName"], value: list[key]["ProductName"] });
        }
        return result;
    }
    fillStoreDropdown(list) {


        let result = [];
        for (var key in list) {
            result.push({ key: list[key]["StoreID"], text: list[key]["StoreName"], value: list[key]["StoreName"] });
        }
        return result;
    }
    fillDropdown(list) {
 let result = [];
        for (var key in list) {
            result.push({ key: list[key]["ID"], value: list[key]["Name"] });
        }
        return result;
    }
 render() {

        let saleList = this.state.saleList;
        let serviceList = this.state.serviceList;
        let tableData = null;
        let add_sale = null;
 if (serviceList !== "") {
     const { name, value, key } = this.state; // set the value which would be selected into the dropdown
// Add Modal using Semantic UI

            add_sale = <Modal id="modal" trigger={<Button color="blue" id="buttonModal">Add a new sale record</Button>}  >
                <Modal.Header >Add a new sale</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.add.bind(this)} ref="form" method="POST">
                        <Form.Field>
                            <Label color='grey'>Customer Name</Label><br />
                            <Dropdown selection options={this.fillCustomerDropdown(this.state.customersList)} onChange={this.handleChange} name="selectCustomer" placeholder='Select Customer' /><br />
                        </Form.Field>
                        <Form.Field>
                            <Label color='grey'>Product Name</Label><br />
                            <Dropdown selection options={this.fillProductDropdown(this.state.productsList)} onChange={this.handleChange} name="selectProduct" placeholder='Select Product' /><br />
                        </Form.Field>
                        <Form.Field>
                            <Label color='grey'>Store Name</Label><br />
                            <Dropdown selection options={this.fillStoreDropdown(this.state.storesList)} onChange={this.handleChange} name="selectStore" placeholder='Select Store' /><br />
                        </Form.Field>
                        <Form.Field>
                            <Label color='grey'>Date</Label><br />
                            <input type="date" onChange={this.handleDate} name="selectDate" min={this.state.curTime} required /><br />
                        </Form.Field>
                        <Button type='submit'><Button color="green"><Icon name="save" />save</Button></Button>
                    </Form>
                </Modal.Content>
            </Modal>
        }
 // Edit Modal using Semantic UI
        if (this.state.saleList !== "") {

            tableData = saleList.map(service =>
                <Table.Row key={service.ID}>
                    <Table.Cell >{service.CustomerName}</Table.Cell>
                    <Table.Cell >{service.ProductName}</Table.Cell>
                    <Table.Cell >{service.StoreName}</Table.Cell>
                    <Table.Cell >{moment(service.DateSold).format("DD-MM-YYYY")}</Table.Cell>
                    <Table.Cell >
                        <Modal id="modal" trigger={<Button color="yellow"><Icon name="edit" />Edit</Button>}  >
                            <Modal.Header >Details sold</Modal.Header>
                            <Modal.Content>
                                <Form ref="form" method="POST" onSubmit={this.update.bind(this, service.ID)}>
                                    <Form.Field>
                                        <Label  color='grey'> Customer Name</Label><br />
                                        <Dropdown selection options={this.fillCustomerDropdown(this.state.customersList)} defaultValue={service.CustomerName} required onChange={this.handleChange} name="selectUCustomer"  /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label color='grey'>Product Name</Label><br />
                                        <Dropdown selection options={this.fillProductDropdown(this.state.productsList)} defaultValue={service.ProductName} required onChange={this.handleChange} name="selectUProduct"  /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <Label color='grey'>Store Name</Label><br />
                                        <Dropdown selection options={this.fillStoreDropdown(this.state.storesList)} defaultValue={service.StoreName} required onChange={this.handleChange} name="selectUStore" /><br />
                                    </Form.Field>
                                    <Form.Field>
                                        <label color='grey'>Date Sold</label><br />
                                        <input type="date" name="newDate" value={moment(service.DateSold).format("YYYY-MM-DD")} required onChange={this.handleDate} /><br />
                                    </Form.Field>
                                    <Button type='submit'> <Button color="green"><Icon name="save" />save</Button></Button>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
//Delete Modal using Semantic UI
                    <Table.Cell>
                        <Modal id="deleteModal" onClose={this.props.onClose} trigger={<Button color="red" onClick={() => this.delete.bind(this, service.ID)}><Icon name="trash" />Delete</Button>}>
                            <Modal.Header>Delete Sales</Modal.Header>
                            <Modal.Content>
                               <Label>Are you sure, you want to delete?</Label>
                                <Button id="btnDelete" onClick={this.delete.bind(this, service.ID)} color="red"><Icon name="trash" />Delete</Button>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell>
                </Table.Row>
            );
        }
 //Table to show All Sales Record using Semantic UI
        return (
            <React.Fragment>
                <div>
                    {add_sale}
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Customer name</Table.HeaderCell>
                                <Table.HeaderCell>Product name</Table.HeaderCell>
                                <Table.HeaderCell>Store name</Table.HeaderCell>
                                <Table.HeaderCell>Date sold</Table.HeaderCell>
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
const app = document.getElementById('sales');
ReactDOM.render(<div><h1 className="anim">Sales Details</h1><Sale /></div>, app);
export default Sale;