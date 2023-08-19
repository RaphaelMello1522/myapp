import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Menu from './pages/menu';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

ReactDOM.render(
<BrowserRouter>
  <Routes>
    <Route exact path='/' element={<Menu/>}/>
    <Route path='*' element={<Navigate replace to="/login" />}/>
    <Route exact path='/login' element={<Login/>}/>
    <Route exact path='/dashboard' element={<Dashboard/>}/>
  </Routes>
</BrowserRouter>,
document.getElementById('root')
);