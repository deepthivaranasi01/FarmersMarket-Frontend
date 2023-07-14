import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { updateUserThunk } from '../services/auth-thunks';
import { addReviewToProductThunk } from '../services/product-thunk';

function OrderHistoryScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const bought = currentUser.bought || [];
  const [showModal, setShowModal] = useState(false);
  const [currentReview, setCurrentReview] = useState({ rating: 0, text: '' });
  const [currentItem, setCurrentItem] = useState(null);

  const handleReview = (item) => {
   
    if ((currentUser.reviews || []).some(review => review.foodId === item.foodId && review.orderDate === item.orderDate)) {
      alert("You have already reviewed this product for this order.");
    } else {
      setCurrentItem(item);
      setShowModal(true);
    }
  }

  const handleInputChange = (e) => {
    setCurrentReview({ ...currentReview, [e.target.name]: e.target.value });
  }


  const submitReview = async () => {
    const reviewForUser = {
      companyName: currentItem.companyName,
      reviewDate: new Date(),
      orderDate:currentItem.orderDate,
      foodId:currentItem.foodId,
      rating: currentReview.rating,
      text: currentReview.text,
    };
    const updatedProfile = {
      ...currentUser,
      reviews: [
        ...(currentUser.reviews || []),
        reviewForUser,
      ],
    };
  
    const reviewForProduct = {
      ...reviewForUser,
      userId: currentUser.username
    };
  
    await Promise.all([
      dispatch(updateUserThunk(updatedProfile)),
      dispatch(addReviewToProductThunk({ foodId: currentItem.foodId, review: reviewForProduct })),
    ]);
  
    setShowModal(false);
  }

  return (
    <div>
      <h1>Your Order History</h1>
      <Row>
        {bought.map((item, index) => (
          <Col sm={12} md={6} lg={4} xl={3} key={index}>
            <Card className="my-3 p-3 rounded">
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.foodId}</Card.Title>
                <Card.Text>Quantity: {item.quantity}</Card.Text>
                <Card.Text>Order Date: {(new Date(item.orderDate)).toLocaleString()}</Card.Text>
                {currentUser.userType === "normal" && (
                  <Button onClick={() => handleReview(item)}>Write Review</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Rating (0-5)</Form.Label>
              <Form.Control type="number" min="0" max="5" name="rating" value={currentReview.rating} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control as="textarea" name="text" value={currentReview.text} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={submitReview}>Submit Review</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderHistoryScreen;
