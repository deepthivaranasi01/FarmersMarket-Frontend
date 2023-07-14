import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { GoGear } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import "./index.css";


function Home() {
  const [foodImages, setFoodImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [searchInput, setSearchInput] = useState(''); 
  const navigate = useNavigate();
  const [advancedSearch, setAdvancedSearch] = useState(false); 
  const [healthLabel, setHealthLabel] = useState(''); 
  const [category, setCategory] = useState('');

  const foodItems = [
    'Quinoa',
'Spinach',
'Kale',
'Broccoli',
'Blueberries',
'Salmon',
'Avocado',
'Almonds',
'Greek Yogurt',
'Oats',
'Chia Seeds',
'Sweet Potato',
'Oranges',
'Eggs',
'Cauliflower',
'Cucumber',
'Watermelon',
'Brown Rice',
'Flaxseeds',
'Black Beans',
'Strawberries',
'Lean Chicken Breast',
'Mushrooms',
'Carrots',
'Tomatoes',
'Walnuts',
'Green Tea',
'Lentils',
'Peanut Butter',
'Grapefruit',
'Olive Oil',
'Cottage Cheese',
'Sardines',
'Tuna',
'Bell Peppers',
'Ginger',
'Asparagus',
'Pomegranate',
'Turkey Breast',
'Cabbage',
'Pears',
'Hazelnuts',
'Lemon',
'Beets',
'Kidney Beans',
'Pumpkin Seeds',
'Yogurt',
'Hummus',
'Apples',
'Cashews',
'Cilantro',
'Brussels Sprouts',
'Grapes',
'Chicken',
'Celery',
'Coconut Oil',
'Blackberries',
'Tofu',
'Mangoes',
'Pecans',
'Lettuce',
'Cranberries',
'Cottage Cheese',
'Cinnamon',
'Cantaloupe',
'Chickpeas',
'Kiwi',
'Pineapple',
'Almond Butter',
'Cherries',
'Artichokes',
'Brazil Nuts',
'Zucchini',
'Garlic',
'Apricots',
'Papaya',
'Sunflower Seeds',
'Peas',
'Cacao Nibs',
'Cauliflower Rice',
'Sesame Seeds',
'Dates',
'Red Lentils',
'Coconut Water',
'Raspberries',
'Oregano',
'Nectarines',
'Coconut Milk',
'Scallions',
'Flaxseed Oil',
'Green Beans',
'Millet',
'Chia Pudding',
'Tahini',
'Butternut Squash',
'Bok Choy'
  ];

  const fetchFoodImages = async () => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * foodItems.length);
      const randomItem = foodItems[randomIndex];
      const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=4ef9f282&app_key=7660de5b63462fc4acfb5a2764500281&ingr=${randomItem}&nutrition-type=logging`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.hints[0])
        if (data.hints[0].food.image) {
          items.push({
            image: data.hints[0].food.image,
            nutrients: data.hints[0].food.nutrients,
            name : randomItem
          });
        };
      } catch (error) {
        console.log(error);
      }
    }
    setFoodImages(items);
  };

  useEffect(() => {
    fetchFoodImages();
  }, []);

  useEffect(() => {
    const next = (current + 1) % foodImages.length;
    const id = setTimeout(() => setCurrent(next), 3000);
    return () => clearTimeout(id); 
  }, [current, foodImages]);
  console.log(foodImages);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchInput.trim() !== '') {
      navigate(`/FarmersMarket/search-page?foodType=${searchInput}&healthLabel=${healthLabel}&category=${category}`);
    }
  };
  
  const categories = [
    {value: '', label: 'Select Category'},
    {value: 'generic-foods', label: 'Generic Foods'},
    {value: 'packaged-foods', label: 'Packaged Foods'},
    {value: 'restaurant-foods', label: 'Restaurant Foods'},
  ];

  const healthLabels = [
    {value: '', label: 'Select Health Label'},
    {value: 'alcohol-free', label: 'Alcohol Free'},
    {value: 'celery-free', label: 'Celery Free'},
    {value: 'crustacean-free', label: 'Crustacean Free'},
  ];


  return(
    <>
      <div className="row">
        <div className="col-11 position-relative">
          <form onSubmit={handleSearch}>
            <input
              placeholder="Search products"
              className="form-control rounded-pill ps-5"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </form>
          <AiOutlineSearch className="fs-3 position-absolute wd-nudge-up" onClick={handleSearch} />
        </div>
        <div className="col-1">
        <GoGear className="wd-top-4 float-end fs-3 position-relative" onClick={() => setAdvancedSearch(!advancedSearch)} />
        {advancedSearch && (
          <div className="advanced-search-options">
            <label style = {{marginRight:10}}>Health Label</label>
            <select value={healthLabel} onChange={(event) => setHealthLabel(event.target.value)}>
              {healthLabels.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>


            <label  style={{marginRight:10,marginLeft:10}}>Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      </div>
    <div className="content text-center mt-4">
        <p>Welcome to the Grocery Market! Please login or sign in to continue.</p>
        <p>Welcome to our Nutrient-Packed Slideshow! Dive into a visual feast of wholesome and nourishing delights that will tantalize your taste buds and fuel your body with essential nutrients. Our carefully curated collection of images showcases a wide variety of delicious and nutrient-rich foods, each with its unique set of health benefits.</p>
        <p>Join us on this visual exploration of culinary wonders, where every image tells a story of health and vitality. Let the nutrient-packed slideshow be your guide to embracing a lifestyle that embraces both flavor and nourishment.
</p>
      </div>
    <div className="position-relative mb-2">
      <div className="slider ">
        {foodImages.map((item, index) => (
          <div className={index === current ? 'slide active' : 'slide'}  key={index}>
            {index === current && (<img src={item.image} className="w-100 image-height" alt="food item"/>)}
            <div className="position-absolute wd-nudge-up text-black font-weight-bold">
             <span className="bold"> Name: {item.name} {Object.entries(item.nutrients).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}

export default Home;