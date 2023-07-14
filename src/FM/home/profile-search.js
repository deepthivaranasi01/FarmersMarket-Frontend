import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Collapse, Alert } from 'react-bootstrap';
import { useSelector } from "react-redux";
import ProfileScreen from '../user/profile-screen';

const ProfileSearch = () => {
  const { currentUser } = useSelector((state) => state.user); 
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const SERVER_API_URL = process.env.REACT_APP_API_BASE;
    const PRODUCTS_URL = `${SERVER_API_URL}/users`;
    axios
      .get(PRODUCTS_URL)
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (searchInput) {
      const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  }, [searchInput, users]);

  const handleSearch = event => {
    event.preventDefault();
    if (searchInput) {
      const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const UserCard = ({ user }) => {
    const [showReviews, setShowReviews] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const toggleReviews = () => {
      if (!user.reviews || user.reviews.length === 0) {
        setShowAlert(true);
      }
      setShowReviews(prevState => !prevState);
    };

    return (
      <Card style={{ width: '80%', marginBottom: '1rem', margin: 'auto' }}>
        <Card.Img variant="top" src="/images/profile.jpg" style={{ height: '10rem', objectFit: 'cover' }} />
        <Card.Body>
          <Card.Title>
            {user.firstName} {user.lastName}
          </Card.Title>
          <Card.Text>
            <strong>Email:</strong> {user.email}<br/>
            <strong>User Type:</strong> {user.userType}<br/>
          </Card.Text>
          <Button
            variant="secondary"
            onClick={toggleReviews}
            style={{ marginBottom: '1rem' }}
          >
            View More 
          </Button>
          {showAlert && <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible> No Details to show </Alert>}
          <Collapse in={showReviews}>
            <div>
              {user.userType === 'normal' && (
                <>
                  <h6>Reviews</h6>
                  {user.reviews.map((review, index) => (
                    <div key={index}>
                      <strong>Review Date:</strong> {review.reviewDate}
                      <br />
                      <strong>Order Date:</strong> {review.orderDate}
                      <br />
                      <strong>Food ID:</strong> {review.foodId}
                      <br />
                      <strong>Rating:</strong> {review.rating}
                      <br />
                      <strong>Text:</strong> {review.text}
                      <br />
                      <br />
                    </div>
                  ))}
                </>
              )}
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          placeholder="Search profiles"
          className="form-control rounded-pill ps-5"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
        />
      </form>

      <Container style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <Row className="gx-4 gy-4">
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4" style={{ maxWidth: '100%' }}>
                <UserCard user={user} />
              </Col>
            ))
          ) : (
            <div>
            <h5>No results found</h5>
            <h3> Search for profiles here </h3>
            <h3> No Profile yet? Click on register to get a new account or login if you are already a user. </h3>
</div>
          )}
        </Row>
      </Container>
      <p></p>
      <p></p>
      <p></p>

      {currentUser && <ProfileScreen />}
    </div>
  );
};

export default ProfileSearch;
