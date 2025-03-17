import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import Header from 'component/layout/Header';
//import Sidebar from 'component/layout/Sidebar';
//import { BrowserRouter } from 'react-router-dom';
//import { Outlet } from 'react-router-dom';
//import Footer from 'component/layout/Footer';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /*
    <BrowserRouter>
    <Header/>
    <div id='layoutSidenav'>
    <Sidebar/>
    <App />
    </div>
    <Footer />
    </BrowserRouter>
    */
    <App />
);
