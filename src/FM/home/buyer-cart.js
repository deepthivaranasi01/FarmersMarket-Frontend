import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserThunk } from "../services/auth-thunks";
import { Card, Row, Col, Form, Button } from 'react-bootstrap';

function BuyerCartScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [cart, setCart] = useState(currentUser.cart || []);

  const handleUpdate = (index, quantity) => {
    if (quantity > 0) {
      const updatedUser = {
        ...currentUser,
        cart: currentUser.cart.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, quantity }
            : item
        ),
      };
      dispatch(updateUserThunk(updatedUser));
    } else {
      alert('Quantity cannot be zero!');
    }
  };

  const handleDelete = (index) => {
    const updatedCart = currentUser.cart.filter((item, itemIndex) =>
      itemIndex !== index
    );
  
    const updatedUser = {
      ...currentUser,
      cart: updatedCart,
    };
  
    dispatch(updateUserThunk(updatedUser));
    setCart(updatedCart);
  };

  const placeOrder = () => {
    const orderDate = new Date();

    const updatedUser = {
      ...currentUser,
      bought: [
        ...(currentUser.bought || []),
        ...currentUser.cart.map(item => ({...item, orderDate: orderDate.toISOString()}))
      ],
      cart: []
    };
    dispatch(updateUserThunk(updatedUser));
    setCart([]);
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <Row>
        {cart.map((item, index) => (
          <Col sm={12} md={6} lg={4} xl={3} key={index}>
            <Card className="my-3 p-3 rounded">
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.foodId}</Card.Title>
                <Card.Text><b>Seller:</b> {item.seller}</Card.Text>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(index, e.target.quantity.value);
                }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" defaultValue={item.quantity} name="quantity" />
                  </Form.Group>
                  <Button variant="primary" type="submit">Update</Button>
                  <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="success" onClick={placeOrder}>Place Order</Button>
    </div>
  );
}

export default BuyerCartScreen;
