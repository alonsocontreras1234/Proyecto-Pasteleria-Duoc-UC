import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Checkout from './pages/Checkout';
import Boleta from './pages/Boleta';
import Seguimiento from './pages/Seguimiento';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 app-layout">
      <Navigation />
      <CartDrawer />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/boleta" element={<Boleta />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;