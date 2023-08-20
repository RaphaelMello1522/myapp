import React, { useEffect, useState } from "react";
import { Table, Card, Image, Button } from 'react-bootstrap';
import firestoreService from "../utils/services/firestoreService";
import imageLogo from '../assets/logoAlt.png';

function Menu(props){
    const [ menuItens, setMenuItens] = useState([]);

    useEffect(() => {
        firestoreService.GetAllMenuItems().then((response) => {
            setMenuItens(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            alert('erro ao buscar dados do firebase' + e);
        })
    }, [])
    return (
<>
<Card className="mx-auto" style={{ margin: 24, maxWidth: 767 }}>
<Card.Header className="d-flex justify-content-center align-items-center">
<div style={{ marginRight: 8 }}>
<Image src={imageLogo} style={{ width: 80 }} />
</div>
<h2>Quadro de Atendimentos</h2>
</Card.Header>
<Card.Body>
<Table responsive>
<thead>
<tr>
<th>#</th>
<th>Nome</th>
<th>Tipo de Atendimento</th>
<th>Preço</th>
</tr>
</thead>
<tbody>
{(menuItens) && (menuItens.map((menuItem, index) => (
<tr key={index}>
   <td>{index + 1}</td>
   <td>{menuItem.doc.data.value.mapValue.fields.NomeItem.stringValue}
   </td>
   <td>{menuItem.doc.data.value.mapValue.fields.CategoriaItem.stringValue}
   </td>
   <td>{menuItem.doc.data.value.mapValue.fields.PrecoItem.stringValue}
   </td>
</tr>
)))}
</tbody>
</Table>
</Card.Body>
<Card.Footer className="d-flex justify-content-between align-items-center">
<p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>© Mello S.A 2023</p>
<p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}><a href="/login">Login Administrativo</a> • <a href="#">Politica de Privacidade</a> • <a href="#">Contato</a></p>
</Card.Footer>
</Card>
</>
    );
}
export default Menu;