import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserThunk } from "../services/auth-thunks";
import { Card, Row, Col, Form, Button } from 'react-bootstrap';

function SellerLoginScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState(currentUser.products || []);

  useEffect(() => {
    setProducts(currentUser.products || []);
  }, [currentUser]);

  const handleUpdate = (index, quantity, price, description) => {
    const updatedUser = {
      ...currentUser,
      products: currentUser.products.map((product, productIndex) =>
        productIndex === index
          ? { ...product, quantity, price, description }
          : product
      ),
    };
    dispatch(updateUserThunk(updatedUser));
  };

  return (
    <div>
      <h1>Selling</h1>
      <p>Whether you're a farmer with sun-kissed fields or a seafarer with a love for the open waters, our website welcomes you to share your exceptional produce with the world. Together, we'll create a gastronomic experience that celebrates nature's diverse offerings and the remarkable individuals who make it all possible.</p>
      <p>So, gather your harvest, pack your crates, and let the world experience the fruits of your labor</p>
      <Row>
        {products.map((product, index) => (
          <Col sm={12} md={6} lg={4} xl={3} key={index}>
            <Card className="my-3 p-3 rounded">
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.foodId}</Card.Title>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(index, e.target.quantity.value, e.target.price.value, e.target.description.value);
                }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" defaultValue={product.quantity} name="quantity" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" defaultValue={product.price} name="price" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" defaultValue={product.description} name="description" />
                  </Form.Group>
                  <Button variant="primary" type="submit">Update</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default SellerLoginScreen;
