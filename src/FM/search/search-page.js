import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const healthLabelOptions = [
  'alcohol-free',
  'celery-free',
  'crustacean-free',

];

const categoryOptions = [
  'generic-foods',
  'packaged-foods',
  'restaurant-foods',
];
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage(uri) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); 
  }
  const query = useQuery();
  const defaultFoodType = query.get('foodType') || '';
  const defaultHealthLabel = query.get('healthLabel') || '';
  const defaultCategory = query.get('category') || '';
  const [foodType, setFoodType] = useState(defaultFoodType);
  const [healthLabel, setHealthLabel] = useState(defaultHealthLabel);
  const [category, setCategory] = useState(defaultCategory);

  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false); 

  const [shouldSearch, setShouldSearch] = useState(true);
  const handleInputChange = (event, setter) => {
    const { value } = event.target;
    setter(value);
  };

  useEffect(() => {
    if (shouldSearch && foodType !== '') {
      handleSearch();
    }
  }, [shouldSearch,foodType, healthLabel, category]);
  

  


  const handleSearch = async () => {
    setShouldSearch(true); 
    setSearchResults([]);
    let urlParts = [
      `https://api.edamam.com/api/food-database/v2/parser?app_id=c19f8207&app_key=39edd12c970c2cdbe5cceedfe7dbdb5b`,
      `&ingr=${encodeURIComponent(foodType)}`,
      `&nutrition-type=logging`,
    ];
  
    if (healthLabel !== '') {
      urlParts.push(`&health=${encodeURIComponent(healthLabel)}`);
    }
  
    if (category !== '') {
      urlParts.push(`&category=${encodeURIComponent(category)}`);
    }
  
    const url = urlParts.join('');;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      let results = [...data.parsed];
      if (data.hints && data.hints.length > 0) {
        results = [...results, ...data.hints];
      }
  
      if (results.length > 0) {
        setSearchResults(results);
        setShowResults(true); 
      } else {
        setSearchResults([]);
        setShowResults(true); 
      }
      setShouldSearch(false); 
  
    } catch (error) {
      setSearchResults([]);
      setShowResults(true); 
    }
  };

  return (
    <>
      <h4>SearchPage</h4>
      <p>This page helps you search for a food and obtain information about its nutrients and other details.</p>
      <div style={{marginBottom:10}}>
        <label style={{marginRight:10}}>Food Type</label>
        <input
          type="text"
          value={foodType}
          onChange={(event) => handleInputChange(event, setFoodType)}
        />
      </div>

      <div style={{marginBottom:10}}>
        <label style={{marginRight:10}}>Health Label</label>
        <select
          value={healthLabel}
          onChange={(event) => handleInputChange(event, setHealthLabel)}
        >
          <option value="">Select Health Label</option>
          {healthLabelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{marginBottom:10,marginRight:10}}>Category</label>
        <select
          value={category}
          onChange={(event) => handleInputChange(event, setCategory)}
        >
          <option value="">Select Category</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleSearch}>Search</Button> <Button variant="secondary" onClick={goBack}>Go Back</Button>

      {showResults && searchResults.length > 0 && (
        <div style={{marginTop:10,marginBottom:10}}>
          <h4>Search Results</h4>
          <ul>
          {showResults && searchResults.length > 0 && (
        <div className="row">
          {searchResults.map((result) => (
            <div className="col-sm-4 col-md-3" key={result.food.foodId}>
              <div className="card mb-4">
                <img src={result.food.image} alt={result.food.label} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{result.food.label}</h5>
                  <button onClick={() => navigate(`/FarmersMarket/food/${result.food.label}`)} className="btn btn-primary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )) }
        </div>
      ) }
        

          </ul>
        </div>
      )}

      {showResults && searchResults.length === 0 && (
        <p>No results found.</p>
      )}
    </>
  );
}

export default SearchPage;
