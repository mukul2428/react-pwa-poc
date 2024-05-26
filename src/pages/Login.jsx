import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getCredentials, saveCredentials } from "../utils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/login`, {
        email,
        password,
      });
      if (response?.data?.token) {
        toast(response?.data?.message);
        localStorage.setItem("token", response.data.token);
        await saveCredentials(email, password);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      if (!navigator.onLine) {
        offlineLogin();
      } else {
        toast(error?.response?.data?.message);
      }
    }
  };

  async function offlineLogin() {
    const credentials = await getCredentials();
    if (credentials) {
      // Use the decrypted credentials to log in
      if (credentials.email === email && credentials.password === password) {
        toast("Login Success");
        localStorage.setItem("token", "offline");
        navigate("/");
        window.location.reload();
      } else {
        toast("Invalid Credentials");
      }
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100" style={{ maxWidth: "400px" }}>
        <Col>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster />
    </Container>
  );
}

export default Login;
