import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CaptureDocuments from "./pages/CaptureDocuments";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SendNoti from "./pages/SendNoti";
import GeneratedPolicies from "./pages/GeneratedPolicies";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const user = localStorage.getItem("token");

  const Logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  useEffect(() => {
    // Check for iOS
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    if ("Notification" in window) {
      setNotificationSupported(true);
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
    }
  }, []);

  const handlePermissionRequest = () => {
    if (notificationSupported) {
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
    }
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
              {user ? (
                <>
                  <Nav.Link as={Link} to="/captureDocuments">
                    Capture Documents
                  </Nav.Link>
                  <Nav.Link as={Link} to="/generatedPolicies">
                    Generated Policies
                  </Nav.Link>
                  <Nav.Link as={Link} to="/notification">
                    Notification
                  </Nav.Link>
                  <Nav.Link onClick={Logout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
            {!isRunningAsPWA() && !isIOS && (
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
            {!isRunningAsPWA() && isIOS && (
              <button
                onClick={() => setShowPopup(true)}
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
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/captureDocuments"
          element={
            <ProtectedRoute>
              <CaptureDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generatedPolicies"
          element={
            <ProtectedRoute>
              <GeneratedPolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <SendNoti />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isIOS ? "Install App on iOS" : "Notification Permission"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isIOS ? (
            <p>
              To install this app, tap the "Share" icon and select "Add to Home
              Screen".
            </p>
          ) : (
            <p>We'd like to send you notifications. Is that okay?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isIOS && (
            <>
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
            </>
          )}
          {isIOS && (
            <Button variant="primary" onClick={() => setShowPopup(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
