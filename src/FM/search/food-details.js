import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { updateUserThunk, fetchUserCompanyNameThunk} from "../services/auth-thunks";
import { createProductThunk, getProductThunk } from "../services/product-thunk";

function FoodDetailsPage() {
  const { foodId } = useParams();
  const [foodDetails, setFoodDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({ price: '', description: '' });
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDetails();
    fetchSellers();
  }, [foodId]);


  const fetchSellers = async () => {
    dispatch(getProductThunk(foodId))
      .then(res => { 
        if (res.payload && Array.isArray(res.payload.otherCollectionIds)) {
          const sellerIds = res.payload.otherCollectionIds;
          const sellerCompanyNamesPromises = sellerIds.map(sellerId => {
            return dispatch(fetchUserCompanyNameThunk([sellerId, foodId ])).then(response => response.payload)
          });
          
          Promise.all(sellerCompanyNamesPromises)
            .then(sellerCompanyNames => {
              setSellers(sellerCompanyNames);
            });
        } else {
          console.error('Unexpected data structure for sellers: ', res.payload);
        }
      })
      .catch(err => console.error('Failed to fetch sellers: ', err));
  };

  const goBack = () => {
    navigate(-1);
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const addToCart = () => {
    if (!currentUser) {
      console.log('User not logged in.');
      return;
    
    }

    const updatedProfile = {
      ...currentUser,
      cart: [
        ...(currentUser.cart || []),
        {
          foodId,
          quantity,
          price: foodDetails.price,
          description: foodDetails.description,
          image: foodDetails.image,
          seller: selectedSeller
          
        },
      ],
    };
    dispatch(updateUserThunk(updatedProfile));
    setShowModal(false); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.log('User not logged in.');
      return;
    }

    const updatedProfile = {
      ...currentUser,
      products: [
        ...(currentUser.products || []),
        {
          foodId,
          quantity: formData.quantity,
          price: formData.price,
          description: formData.description,
          image: foodDetails.image
          
        },
      ],
    };
    dispatch(updateUserThunk(updatedProfile));
    dispatch(createProductThunk({
      foodId,
      userid: currentUser._id
    }))
    setFormData({ price: '', description: '' });
    setShowModal(false);
  }

  const handleSelect = (e) => {
    setSelectedSeller(e);
  }

  const fetchDetails = async () => {
    try {
      const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=c19f8207&app_key=39edd12c970c2cdbe5cceedfe7dbdb5b&ingr=${foodId}&nutrition-type=logging`);
      const data = await response.json();
      if (data.parsed && data.parsed.length > 0) {
        setFoodDetails(data.parsed[0].food);
      } else {
        console.log('No details found for this food.');
      }

      dispatch(getProductThunk(foodId))
        .then(res => {
          if (res.payload && Array.isArray(res.payload.reviews)) {
            setReviews(res.payload.reviews);
          } else {
            console.error('Unexpected data structure for reviews: ', res.payload);
          }
        })
        .catch(err => console.error('Failed to fetch product details: ', err));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {foodDetails ? (
        <div style={{ width: '18rem', border: '1px solid gray', borderRadius: '5px', padding: '10px', margin: '0 auto' }}>
          <img src={foodDetails.image} alt={foodDetails.label} style={{ width: '100%' }} />
          <div style={{ padding: '10px' }}>
            <h2>{foodDetails.label}</h2>
          </div>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            <li>Calories: {foodDetails.nutrients.ENERC_KCAL}</li>
            <li>Fat: {foodDetails.nutrients.FAT}</li>
            <li>Carbs: {foodDetails.nutrients.CHOCDF}</li>
            <li>Protein: {foodDetails.nutrients.PROCNT}</li>
          </ul>
          <Button variant="secondary" onClick={goBack} style={{marginRight:10}}>Go Back</Button>
          <Button variant="primary" onClick={() => setShowReviewModal(true)}>Reviews</Button>
          {currentUser && currentUser.userType === "seller" && (
            <Button variant="primary" onClick={() => setShowModal(true)}>Sell Product</Button>

          )}
          {currentUser && currentUser.userType === "normal" && (
            <>
              <Button variant="primary" onClick={() => setShowModal(true)}>Buy Product</Button>
              
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser && currentUser.userType === "normal" ? "Buy Product" : "Sell Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && currentUser.userType === "normal" ? (
            <Form onSubmit={(e) => {
              e.preventDefault();
              addToCart();
            }}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" name="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
              </Form.Group>
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedSeller || 'Select Seller'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {sellers.map((seller, index) => (
                    <Dropdown.Item eventKey={seller}>{seller}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" type="submit">Add to Cart</Button>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Quantity Available</Form.Label>
                <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Price Per Quantity</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />
              </Form.Group>
              <Button variant="primary" type="submit">Submit</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
<div key={index}>
  <h5>Username: {review.userId}</h5>
  <div>
    Rating:  {review.rating} <span class="star-icon">⭐</span><br/>
    Comment: <span class="comment-icon">💬</span> {review.text}<br/>
  </div>
  <hr/> <br/>
</div>

            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FoodDetailsPage;
