import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Routes, Route } from "react-router-dom";
import Pokemon from "./pages/Pokemon";
import About from "./pages/About";
import CapturePokemon from "./pages/CapturePokemon";
import { generateToken, messaging } from "./firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification.body);
    });
  });
  return (
    <>
      <Navbar expand="lg" bg="primary" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/">
            My Pokemon App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/capturePokemon">
                Capture Pokemon
              </Nav.Link>
              <Nav.Link as={Link} to="/pokemon">
                Pokemon
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/capturePokemon" element={<CapturePokemon />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
