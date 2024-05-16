import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CaptureDocuments from "./pages/CaptureDocuments";
import RandomImages from "./pages/RandomImages";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Notification from "./pages/Notification";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if notifications are allowed
    if (Notification.permission === "default" && !isRunningAsPWA()) {
      setShowPopup(true);
    }
    if (isRunningAsPWA()) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          // Notifications allowed
        } else if (result === "denied") {
          // Notifications blocked
        }
        setShowPopup(false);
      });
    }
  }, []);

  const handlePermissionRequest = () => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        // Notifications allowed, do nothing
        setShowPopup(false);
      } else if (result === "denied") {
        // Notifications blocked
        alert("Notifications blocked.");
        setShowPopup(false);
      }
    });
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const isRunningAsPWA = () => {
    return !window.matchMedia("(display-mode: browser)").matches;
  };

  return (
    <>
      <Navbar expand="lg" bg="primary" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/">
            TATA AIG
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/captureDocuments">
                Capture Documents
              </Nav.Link>
              <Nav.Link as={Link} to="/randomImages">
                Random Images
              </Nav.Link>
              <Nav.Link as={Link} to="/notification">
                Notification
              </Nav.Link>
            </Nav>
            {!isRunningAsPWA() && (
              <button
                onClick={handleInstallClick}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background-color 0.3s ease",
                  marginRight: "15px",
                }}
              >
                Install App
              </button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/captureDocuments" element={<CaptureDocuments />} />
        <Route path="/randomImages" element={<RandomImages />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We'd like to send you notifications. Is that okay?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handlePermissionRequest("denied")}
          >
            Block
          </Button>
          <Button
            variant="primary"
            onClick={() => handlePermissionRequest("granted")}
          >
            Allow
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
