import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { findTuitsThunk } from '../services/post-thunks';
import Card from 'react-bootstrap/Card';

const Poster = () => {
  const dispatch = useDispatch();
  const [tuits, setTuits] = useState([]);

  useEffect(() => {
    const fetchTuits = () => {
      dispatch(findTuitsThunk())
        .then(response => {
          setTuits(response.payload);
        })
        .catch(error => {
        });
    };

    fetchTuits();

    const interval = setInterval(fetchTuits, 5000); 

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      {tuits && tuits.map(tuit => (
        <Card key={tuit._id}>
          <Card.Body>
            <Card.Title>{tuit.topic}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              By {tuit.userName} - {tuit.time}
              {tuit.image && <Card.Img variant="top" src={tuit.image} />} 
            </Card.Subtitle>
            <Card.Text>{tuit.tuit}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Poster;
