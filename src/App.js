import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Routes, Route } from "react-router-dom";
import About from "./pages/About";
// import { generateToken, messaging } from "./firebase";
// import { onMessage } from "firebase/messaging";
// import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import CaptureDocuments from "./pages/CaptureDocuments";
import RandomImages from "./pages/RandomImages";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // generateToken();
    // onMessage(messaging, (payload) => {
    //   console.log(payload);
    //   toast(payload.notification.body);
    // });

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
    // Check if the app is running in standalone mode (as a PWA)
    const isStandalone = window.navigator.standalone;
  
    // Only prompt installation if not in standalone mode
    if (!isStandalone && deferredPrompt) {
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
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
            </Nav>
            {/* Button to trigger installation */}
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/captureDocuments" element={<CaptureDocuments />} />
        <Route path="/randomImages" element={<RandomImages />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {/* <Toaster /> */}
    </>
  );
}

export default App;
