import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserThunk } from "../services/auth-thunks";

function LoggerInfoScreen() {
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state) => state.user);

  const maleMultiplier = 5;
  const femaleMultiplier = -161;
  const heightMultiplier = 6.25;
  const weightMultiplier = 10;
  const ageMultiplier = 5;
  
 const handleSaveLog = () => {
  const dateStr = selectedDate.toISOString().slice(0,10);  

  const newLog = {
    date: dateStr,
    breakfast: mealChoices.breakfast,
    lunch: mealChoices.lunch,
    snacks: mealChoices.snacks,
    dinner: mealChoices.dinner,
  };

  // Filter out the old log for the matching date
  const updatedLog = currentUser.log ? currentUser.log.filter((log) => log.date !== dateStr) : [];

  // Append the new log
  updatedLog.push(newLog);

  const updatedUser = {
    ...currentUser,
    log: updatedLog,
  };

  dispatch(updateUserThunk(updatedUser));
};
  const handleDateChange = (event) => {
    
  const dateStr = event.target.value;  
    console.log(currentUser.log,dateStr);
  setSelectedDate(new Date(dateStr));

  const logEntry = currentUser.log?.find(log => log.date === dateStr);

  if (logEntry) {
    setMealChoices({
      breakfast: logEntry.breakfast || [],
      lunch: logEntry.lunch || [],
      snacks: logEntry.snacks || [],
      dinner: logEntry.dinner || [],
    });
  } else {
    handleClear();
  }
};

  const {
    age,
    weight,
    height,
    fitnessGoalWeight,
    fitnessGoalType,
    gender,
    bodyType,
  } = currentUser;

  const [mealChoices, setMealChoices] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });

  const [currentMeal, setCurrentMeal] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');

  const [totalCalories, setTotalCalories] = useState({
    breakfast: 0,
    lunch: 0,
    snacks: 0,
    dinner: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyCalorieNeeds, setDailyCalorieNeeds] = useState(0);

  const handleInputChange = (event) => {
    setCurrentMeal(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setCurrentQuantity(event.target.value);
  };

  const handleAddMeal = (meal) => {
    if (currentMeal !== '' && currentQuantity !== '') {
      setMealChoices((prevChoices) => ({
        ...prevChoices,
        [meal]: [...prevChoices[meal], { food: currentMeal, quantity: currentQuantity }],
      }));
      setCurrentMeal('');
      setCurrentQuantity('');
    }
  };

  const handleSubmit = async () => {
    
    let totalBreakfast = 0;
    let totalLunch = 0;
    let totalSnacks = 0;
    let totalDinner = 0;

    
    const fetchCalories = async (foodItem) => {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=4ef9f282&app_key=7660de5b63462fc4acfb5a2764500281&ingr=${encodeURIComponent(
          foodItem.food
        )}&nutrition-type=logging`
      );
      const data = await response.json();

      if (data.parsed && data.parsed.length > 0) {
        const calories = data.parsed[0].food.nutrients.ENERC_KCAL;
        return (calories * foodItem.quantity) / 100;
      } else {
        return 0;
      }
    };

    for (const foodItem of mealChoices.breakfast) {
      const calories = await fetchCalories(foodItem);
      totalBreakfast += calories;
    }

    for (const foodItem of mealChoices.lunch) {
      const calories = await fetchCalories(foodItem);
      totalLunch += calories;
    }

    for (const foodItem of mealChoices.snacks) {
      const calories = await fetchCalories(foodItem);
      totalSnacks += calories;
    }

    for (const foodItem of mealChoices.dinner) {
      const calories = await fetchCalories(foodItem);
      totalDinner += calories;
    }

  
    setTotalCalories({
      breakfast: totalBreakfast,
      lunch: totalLunch,
      snacks: totalSnacks,
      dinner: totalDinner,
    });
  };

  const handleClear = () => {
    setMealChoices({
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: [],
    });
    setCurrentMeal('');
    setCurrentQuantity('');
    setTotalCalories({
      breakfast: 0,
      lunch: 0,
      snacks: 0,
      dinner: 0,
    });
  };

  
  const calculateBMR = () => {
    const genderOffset = gender === 'male' ? maleMultiplier : femaleMultiplier;
    return weightMultiplier * weight + heightMultiplier * height - ageMultiplier * age + genderOffset;
  };

  
  const calculateDailyCalorieNeeds = () => {
    const bmr = calculateBMR();
    let activityFactor;

    switch (bodyType) {
      case 'fit':
        activityFactor = 1.375;
        break;
      case 'slim':
        activityFactor = 1.2;
        break;
      case 'fat':
        activityFactor = 1.55;
        break;
      default:
        activityFactor = 1.2;
    }

    return bmr * activityFactor;
  };

  useEffect(() => {
    
    const dailyNeeds = calculateDailyCalorieNeeds();
    setDailyCalorieNeeds(dailyNeeds);
    console.log('Daily Calorie Needs:', dailyNeeds);
    const dateStr = selectedDate.toISOString().slice(0,10);
    if (currentUser.log && currentUser.log[dateStr]) {
      setMealChoices(currentUser.log[dateStr]);
    }
  }, [currentUser]);

  return (
    <>
      <h4>LoggerInfo</h4>
      <p>MyLoggerInfo will guide you with personalized tips, diet advice, and feedback as you go.</p>
      <h4>Food Log</h4>
      <div>
        <p>Date: {selectedDate.toDateString()}</p>
      </div>

      <div>
        <label style={{ marginRight: 10 }}>Breakfast</label>
        <input type="text" value={currentMeal} onChange={handleInputChange} style={{ marginRight: 10 }} />
        <input
          type="text"
          value={currentQuantity}
          onChange={handleQuantityChange}
          placeholder="Quantity (grams)"
          style={{ marginRight: 10 }}
        />
        <button onClick={() => handleAddMeal('breakfast')} className="btn btn-success mt-2">
          Add Breakfast
        </button>
        {mealChoices.breakfast.map((meal, index) => (
          <div key={index}>
            <p>
              {meal.food} - {meal.quantity}g
            </p>
          </div>
        ))}
        <p>Total Calories (Breakfast): {totalCalories.breakfast}</p>
      </div>

      <div>
        <label style={{ marginRight: 10 }}>Lunch</label>
        <input type="text" value={currentMeal} onChange={handleInputChange} style={{ marginRight: 10 }} />
        <input
          type="text"
          value={currentQuantity}
          onChange={handleQuantityChange}
          placeholder="Quantity (grams)"
          style={{ marginRight: 10 }}
        />
        <button onClick={() => handleAddMeal('lunch')} className="btn btn-success mt-2">
          Add Lunch
        </button>
        {mealChoices.lunch.map((meal, index) => (
          <div key={index}>
            <p>
              {meal.food} - {meal.quantity}g
            </p>
          </div>
        ))}
        <p>Total Calories (Lunch): {totalCalories.lunch}</p>
      </div>

      <div>
        <label style={{ marginRight: 10 }}>Snacks</label>
        <input type="text" value={currentMeal} onChange={handleInputChange} style={{ marginRight: 10 }} />
        <input
          type="text"
          value={currentQuantity}
          onChange={handleQuantityChange}
          placeholder="Quantity (grams)"
          style={{ marginRight: 10 }}
        />
        <button onClick={() => handleAddMeal('snacks')} className="btn btn-success mt-2">
          Add Snack
        </button>
        {mealChoices.snacks.map((meal, index) => (
          <div key={index}>
            <p>
              {meal.food} - {meal.quantity}g
            </p>
          </div>
        ))}
        <p>Total Calories (Snacks): {totalCalories.snacks}</p>
      </div>

      <div>
        <label style={{ marginRight: 10 }}>Dinner</label>
        <input type="text" value={currentMeal} onChange={handleInputChange} style={{ marginRight: 10 }} />
        <input
          type="text"
          value={currentQuantity}
          onChange={handleQuantityChange}
          placeholder="Quantity (grams)"
          style={{ marginRight: 10 }}
        />
        <button onClick={() => handleAddMeal('dinner')} className="btn btn-success mt-2">
          Add Dinner
        </button>
        {mealChoices.dinner.map((meal, index) => (
          <div key={index}>
            <p>
              {meal.food} - {meal.quantity}g
            </p>
          </div>
        ))}
        <p>Total Calories (Dinner): {totalCalories.dinner}</p>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary mt-2" style={{ marginRight: 50 }}>
        Submit
      </button>
      <button onClick={handleClear} className="btn btn-secondary mt-2">
        Clear
      </button>
      <div>
        <label for="date" style={{ marginRight: 10 }}>Date</label>
        <input id="date" type="date" value={selectedDate.toISOString().slice(0,10)} onChange={handleDateChange} style={{ marginRight: 10 }} />
      </div>
      <button onClick={handleSaveLog} className="btn btn-primary mt-2" style={{ marginRight: 50 }}>
        Save Log
      </button>

      <p>
        Total Calories consumed for the day: {totalCalories.dinner + totalCalories.snacks + totalCalories.breakfast + totalCalories.lunch}
      </p>
      <p>Daily Caloric Needs: {dailyCalorieNeeds}</p>
    </>
  );
}

export default LoggerInfoScreen;
