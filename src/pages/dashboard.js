import React, { useEffect, useState } from "react";
import { Table, Card, Image, Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import NoLoggedInView from "../components/notLoggedView";
import firebase from "firebase";
import firestoreService from "../utils/services/firestoreService";

function Dashboard(props) {

    const [user, setUser] = useState(null);
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    setUser(user);
    } else {
    setUser(null);
    }
    })

    const [ showAddEditForm, setShowAddEditForm] = useState(false);
    const [ AddEditForm, setAddEditForm] = useState('add');
    const [menuItens, setMenuItens] = useState([]);
    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
    const [currentMenuItem, setCurrentMenuItem] = useState({
        "itemName": '',
        "itemCategory": '',
        "itemPrice": 0
        })

    const [ validated, setValidated] = useState(false);
    const handleModalClose = () => {
        setShowAddEditForm(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { itemName, itemCategory, itemPrice } = e.target.elements;
        if (itemPrice.value && itemName.value) {
           if (AddEditForm === "Add") {
              firestoreService.AddNewMenuItem(itemName.value, itemCategory.value, itemPrice.value).then(() => {
              alert(`${itemName.value} is successfully added to the menu.`)
              setCurrentMenuItem({ "itemName": '', "itemCategory": '', "itemPrice": 0 })
              handleModalClose();
              window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                  })
                  }}
                  setValidated(true)
                  }


    const handleMenuItemDelete = (e) => {
        alert('Disponivel em breve');
    }

    function fetchMenuItems() {
        firestoreService.GetAllMenuItems().then((response) => {
        setMenuItens(response._delegate._snapshot.docChanges);
    }).catch((e) => {
        alert('erro ao buscar itens do menu')
    })
    }

    useEffect(() => {
        if (user !== null) {
            if (menuItens.length <= 0) {
              fetchMenuItems();
            }
          fetchMenuItems();
        }}, [user])

    return(
        <><>
            {/* <h1>You're not logged in. Please <a href="/login">login</a> first then come to dashboard.</h1> */}
            {(user === null) && <NoLoggedInView />}
            </>

            {(user !== null) && <>
                {/* Add/Edit Form START */}
                <Modal show={showAddEditForm} onHide={handleModalClose}>
                    <Form noValidate validated={validated} onSubmit={handleAddEditFormSubmit}>
                        <Modal.Header>
                            <Modal.Title>{(AddEditForm === 'Add') ? 'Add Menu Item' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="itemName" label="Item Name" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter item name' size='md' />
                                <Form.Control.Feedback type='invalid'>Item name is required</Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel controlId="itemCategory" label="Item Category" className="mb-3" >
                                <Form.Select>
                                {(menuItens) && (menuItens.map((menuCategory, index) => (
                                <option key={index} value={menuCategory.doc.data.value.mapValue.fields.NomeItem.stringValue}>
                                {menuCategory.doc.data.value.mapValue.fields.NomeItem.stringValue}</option>
                                )))}
                                </Form.Select>
                                </FloatingLabel>
                            <FloatingLabel controlId="itemPrice" label="Price" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter item price' size='md' />
                                <Form.Control.Feedback type='invalid'>Item Price is required</Form.Control.Feedback>
                            </FloatingLabel>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit">{(AddEditForm === 'Add') ? 'Add' : 'Update'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Add/Edit Form END */}

                {/* Delete Confirmation Dialogue START */}
                <Modal show={showDeleteDialogue} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Menu Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this menu item?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleMenuItemDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                            <Image src={'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Nandos_logo.svg/1200px-Nandos_logo.svg.png'} style={{ width: 80 }} />
                            <h4 style={{ marginTop: 8, }}>Dashboard</h4>
                        </div>
                        <Button onClick={() => {setShowAddEditForm(true)}} style={{ backgroundColor: '#000', borderWidth: 0, }}>Add New Item</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Price (USD)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
{(menuItens) && (menuItens.map((menuItem, index) => (
<tr key={index}>
<td>{index + 1}</td>
<td>{menuItem.doc.data.value.mapValue.fields.NomeItem.stringValue}</td>
<td>{menuItem.doc.data.value.mapValue.fields.CategoriaItem.stringValue}</td>
<td>{menuItem.doc.data.value.mapValue.fields.PrecoItem.string ? menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue : menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue}</td>
<td>
<Button variant='primary' onClick={() => {
alert("Edit functionality coming soon")
}}>✎ Edit</Button>{' '}
<Button variant='danger' onClick={() => {
alert("Delete functionality coming soon")
}}>x Delete</Button>
</td>
</tr>
)))}
</tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between align-items-center">
                        <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>Nandos Menu v1.0.0 - <a href="/login">Logout</a></p>
                    </Card.Footer>
                </Card>
            </>}</>
)
}

export default Dashboard;