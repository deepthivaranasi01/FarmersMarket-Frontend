import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { registerthunk } from "../services/auth-thunks";
import { Form, Button, Container } from 'react-bootstrap';

function RegisterScreen() {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const handleRegister = async () => {
  try {
    let r = await dispatch(registerthunk({ username, password }));
    if (r.error) { 
      throw r.error;
    }
    navigate('/FarmersMarket/profileinfo');
  } catch (e) {
    alert("user already exists");
  }
};

 return (
    <Container className="mt-5">
        <h1 className="text-center">Register</h1>
        <Form className="mt-4">
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} 
                    onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" 
        onClick={(e) => {
            e.preventDefault(); 
            handleRegister();
        }}>
    Register
</Button>

        </Form>
    </Container>
 );
}

export default RegisterScreen;
