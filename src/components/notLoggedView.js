import React from 'react';
import { Col, Image, Row, Container } from 'react-bootstrap';
import notLoggedInImage from '../assets/23988775.jpg'

function NoLoggedInView(props) {
return (
<>
<Container>
<Row className="align-items-center">
<Col>
<Image src={`${notLoggedInImage}`} style={{ width: '100%'}} />
</Col>
<Col style={{marginBottom: 150}}>
<h2>Você precisa de um login administrativo para acessar o quadro de atendimentos</h2>
<p><a href='/login'>Se você tiver um acesso clique aqui para entrar</a></p>
</Col>
</Row>
</Container>
</>
);
}
export default NoLoggedInView;