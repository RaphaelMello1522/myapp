import React, { useState } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import logoImage from '../assets/logoAlt.png';
import { useNavigate } from 'react-router-dom';

function Login(props) {
const [validate, setValidated] = useState(false);
const [user, setUser] = useState(null);

//Checking if user is logged in.
firebase.auth().onAuthStateChanged((u) => {
if (u) {
  setUser(u)
} else {
  setUser(null);
}
});

const LoginButtonPressed = (e) => {
e.preventDefault();
const { email, password } = e.target.elements;
firebase.auth().signInWithEmailAndPassword(email.value, password.value).then((userCredentails) => {
//SignedIn User
var user = userCredentails.user;
alert("Login Successful")
setUser(user);
setValidated(true);
}).catch((e) => {
alert(e.message);
setValidated(true);
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

const navigate = useNavigate();

return (
<>
{(user === null) && <Card className='mx-auto' style={{ width: 'auto', height: 'auto' }}>
<Card.Header>
<Image src={logoImage} style={{ width: 80, marginBottom: 8 }} />
<h4>Login Administrativo</h4>
<p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>Insira suas credênciais</p>
</Card.Header>
<Card.Body>
<Form noValidate validated={validate} onSubmit={LoginButtonPressed}>
<Form.Group className='mb-3' controlId='email'>
<Form.Label>Email</Form.Label>
<Form.Control type="email" placeholder='Insira seu email' size='md' />
<Form.Control.Feedback type='invalid'>Email invalido.</Form.Control.Feedback>
</Form.Group>
<Form.Group className='mb-3' controlId='password'>
<Form.Label>Senha</Form.Label>
<Form.Control type="password" placeholder='Insira sua senha' size='md' />
<Form.Control.Feedback type='invalid'>Senha invalida.</Form.Control.Feedback>
</Form.Group>
<Button variant='primary' type='submit' size='md' style={{ fontWeight: 'bold' }}>
Entrar ❯
</Button>
{/* <p>{user.email}</p> */}
</Form>
</Card.Body>
<Card.Footer>
<a href="/" style={{ marginTop: 8, fontSize: 12, }}>← Voltar ao Inicio</a>
</Card.Footer>
</Card>}
{(user !== null)}
{navigate("/dashboard")}
</>
);
}
export default Login;  