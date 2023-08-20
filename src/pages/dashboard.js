import React, { useEffect, useState } from "react";
import { Table, Card, Image, Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import NoLoggedInView from "../components/notLoggedView";
import firebase from "firebase";
import 'firebase/auth';
import firestoreService from "../utils/services/firestoreService";
import logoImage from '../assets/logo.png';

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
    const [ AddEditForm, setAddEditForm] = useState('Add');
    const [menuItens, setMenuItens] = useState([]);
    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
    const [currentMenuItemId, setCurrentMenuItemId] = useState("");

    const [currentMenuItem, setCurrentMenuItem] = useState({
        "itemName": '',
        "itemCategory": '',
        "itemPrice": '0'
        })

    const [ validated, setValidated] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setAddEditForm("Add");
        setCurrentMenuItemId("");
        setCurrentMenuItem({ "itemName": '', "itemCategory": '', "itemPrice": 0 })
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { itemName, itemCategory, itemPrice } = e.target.elements;
        if (itemPrice.value && itemName.value) {
           if (AddEditForm === "Add") {
              firestoreService.AddNewMenuItem(itemName.value, itemCategory.value, itemPrice.value).then(() => {
              alert(`${itemName.value} is successfully added to the menu.`)
              setCurrentMenuItem({ "itemName": '', "itemCategory": '', "itemPrice": '0' })
              handleModalClose();
              window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                  })
                  }
                  else if(AddEditForm === "Edit")
                  {firestoreService.UpdateMenuItem(currentMenuItemId, itemName.value, itemCategory.value, itemPrice.value).then(() => {
                    alert(`${itemName.value} is successfully updated.`);
                    setCurrentMenuItemId("");
                    setCurrentMenuItem({ "itemName": '', "itemCategory": '', "itemPrice": 0 })
                    handleModalClose();
                    window.location.reload(false);
                    }).catch((e) => {
                    alert("Error occured: " + e.message);
                    })
                    }
                }
                  setValidated(true)
                  }


    const handleMenuItemDelete = (e) => {
        firestoreService.DeleteMenuItem(currentMenuItemId).then(() => {
          alert(`Deletion Successful`);
          handleModalClose();
          window.location.reload(false);
        }).catch((e) => {
          alert("Error occured: " + e.message);
        })
    }

    function fetchMenuItems() {
        firestoreService.GetAllMenuItems().then((response) => {
        setMenuItens(response._delegate._snapshot.docChanges);
    }).catch((e) => {
        alert('erro ao buscar itens do menu')
    })
    }

    const LogoutButtonPressed = () => {
        firebase.auth().signOut().then(() => {
        //Signout Successful
        alert("Logout Successful");
        setUser(null);
        setValidated(false);
        }).catch((e) => {
        alert(e.message);
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
                                <Form.Control required type='text' placeholder='Enter item name' size='md' 
                                    value={currentMenuItem?.itemName} onChange={(e) => {
                                        setCurrentMenuItem({
                                            "itemName": (e.target.value) ? e.target.value : '',
                                            "itemCategory": currentMenuItem?.itemCategory,
                                            "itemPrice": currentMenuItem?.itemPrice
                                        })
                                    }} />
                                <Form.Control.Feedback type='invalid'>Item name is required</Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel controlId="itemCategory" label="Item Category" className="mb-3" >
                                <Form.Select value={currentMenuItem?.itemCategory} onChange={(e) =>{
                                    setCurrentMenuItem({
                                        "itemName": currentMenuItem?.itemName,
                                        "itemCategory": e.target.value,
                                        "itemPrice": currentMenuItem?.itemPrice
                                    })
                                }}>
                                {(menuItens) && (menuItens.map((menuCategory, index) => (
                                <option key={index} value={menuCategory.doc.data.value.mapValue.fields.NomeItem.stringValue}>
                                {menuCategory.doc.data.value.mapValue.fields.NomeItem.stringValue}</option>
                                )))}
                                </Form.Select>
                                </FloatingLabel>
                            <FloatingLabel controlId="itemPrice" label="Price" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter item price' size='md' 
                                    value={currentMenuItem?.itemPrice} onChange={(e) => {
                                        setCurrentMenuItem({
                                            "itemName": currentMenuItem?.itemName,
                                            "itemCategory": currentMenuItem?.itemCategory,
                                            "itemPrice": e.target.value
                                        })
                                    }} />
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
                <Card style={{ margin: 24, width: 'auto', height: 'auto' }}>
                <a style={{textAlign: 'right'}} onClick={LogoutButtonPressed}>Encerrar Sessão</a>
                    <Card.Header className="d-flex justify-content-between align-items-center" style={{backgroundColor: '#FF69B4'}}>
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                            <Image src={logoImage} style={{ width: 25 }} />
                            <h4 style={{ marginTop: 10 }}>Quadro de Atendimentos</h4>
                        </div>
                        <Button onClick={() => {setShowAddEditForm(true)}} style={{ backgroundColor: '#000', borderWidth: 0, borderRadius: 20 }}>Novo Atendimento</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Tipo de Atendimento</th>
                                    <th>Preço</th>
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
<Button onClick={() => {
setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1])
setCurrentMenuItem({
"itemName": menuItem.doc.data.value.mapValue.fields.NomeItem.stringValue,
"itemCategory": menuItem.doc.data.value.mapValue.fields.CategoriaItem.stringValue,
"itemPrice": menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue ? menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue : menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue
})
setAddEditForm("Edit");
setShowAddEditForm(true);
}}>✎</Button>
<Button variant='danger' onClick={() => {
setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1]);
setCurrentMenuItem({
"itemName": menuItem.doc.data.value.mapValue.fields.NomeItem.stringValue,
"itemCategory": menuItem.doc.data.value.mapValue.fields.CategoriaItem.stringValue,
"itemPrice": menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue
});
setShowDeleteDialogue(true);
}}><span className="bi bi-trash"></span>X</Button>
</td>
</tr>
)))}
</tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between align-items-center">
                        <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>Mello S.A v1.2.0 - <a href="/login">Encerrar Sessão</a></p>
                    </Card.Footer>
                </Card>
            </>}</>
)
}

export default Dashboard;