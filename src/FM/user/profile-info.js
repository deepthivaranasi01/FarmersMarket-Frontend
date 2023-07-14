import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { updateUserThunk } from '../services/auth-thunks';

function ProfileInfoScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useSelector((state) => state.user);
  const [userType, setUserType] = useState(currentUser.userType);

  const onSubmit = async (data) => {
    console.log(data)
    await dispatch(updateUserThunk({...currentUser, ...data}));
    navigate('/FarmersMarket/profilesearch');
  };

  return (
    <div className="form-container">
      <h1 className="form-header">Profile Information</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input className="form-control" type="text" {...register('firstName', { required: "First Name is required" })} />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input className="form-control" type="text" {...register('lastName', { required: "Last Name is required" })} />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" {...register('email', { required: "Email is required" })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input className="form-control" type="tel" {...register('phone', { required: "Phone number is required" })} />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <div className="form-group">
          <label>User Type</label>
          <select className="form-control" {...register('userType')} onChange={(e) => setUserType(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="seller">Seller</option>
            <option value="logger">Food Logger</option>
          </select>
        </div>

        {userType === 'normal' && (
          <div className="form-group">
            <label>Delivery Address</label>
            <input className="form-control" type="text" {...register('address', { required: "Delivery Address is required" })} />
            {errors.address && <p>{errors.address.message}</p>}
          </div>
        )}

        {userType === 'seller' && (
          <>
            <div className="form-group">
              <label>Company Name</label>
              <input className="form-control" type="text" {...register('companyName', { required: "Company Name is required" })} />
              {errors.companyName && <p>{errors.companyName.message}</p>}
            </div>

            <div className="form-group">
              <label>Company Address</label>
              <input className="form-control" type="text" {...register('companyAddress', { required: "Company Address is required" })} />
              {errors.companyAddress && <p>{errors.companyAddress.message}</p>}
            </div>

            <div className="form-group">
              <label>Company Registration Number</label>
              <input className="form-control" type="text" {...register('companyRegNo', { required: "Registration Number is required" })} />
              {errors.companyRegNo && <p>{errors.companyRegNo.message}</p>}
            </div>

            <div className="form-group">
              <label>Delivery Partner</label>
              <input className="form-control" type="text" {...register('deliveryPartner', { required: "Delivery Partner is required" })} />
              {errors.deliveryPartner && <p>{errors.deliveryPartner.message}</p>}
            </div>

            <div className="form-group">
              <label>Operating States</label>
              <input className="form-control" type="text" {...register('operatingStates', { required: "Operating States is required" })} />
              {errors.operatingStates && <p>{errors.operatingStates.message}</p>}
            </div>
          </>
        )}

        {userType === 'logger' && (
          <>
            <div className="form-group">
              <label>Height</label>
              <input className="form-control" type="number" {...register('height', { required: "Height is required" })} />
              {errors.height && <p>{errors.height.message}</p>}
            </div>

            <div className="form-group">
              <label>Weight</label>
              <input className="form-control" type="number" {...register('weight', { required: "Weight is required" })} />
              {errors.weight && <p>{errors.weight.message}</p>}
            </div>

            <div className="form-group">
              <label>Fitness Goal Type</label>
              <select className="form-control" {...register('fitnessGoalType', { required: "Fitness Goal Type is required" })}>
                <option value="weightLoss">Weight Loss</option>
                <option value="weightGain">Weight Gain</option>
              </select>
              {errors.fitnessGoalType && <p>{errors.fitnessGoalType.message}</p>}
            </div>

            <div className="form-group">
              <label>Fitness Goal Weight</label>
              <input className="form-control" type="number" {...register('fitnessGoalWeight', { required: "Fitness Goal Weight is required" })} />
              {errors.fitnessGoalWeight && <p>{errors.fitnessGoalWeight.message}</p>}
            </div>

            
        <div className="form-group">
          <label>Age</label>
          <input className="form-control" type="number" {...register('age', { required: "Age is required" })} />
          {errors.age && <p>{errors.age.message}</p>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select className="form-control" {...register('gender', { required: "Gender is required" })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p>{errors.gender.message}</p>}
        </div>

            <div className="form-group">
              <label>Body Type</label>
              <select className="form-control" {...register('bodyType', { required: "Body Type is required" })}>
                <option value="fit">Fit</option>
                <option value="fat">Fat</option>
                <option value="slim">Slim</option>
              </select>
              {errors.bodyType && <p>{errors.bodyType.message}</p>}
            </div>
          </>
        )}

        <button className="btn btn-primary" type="submit" style={{marginTop:10}}>Submit</button>
      </form>
    </div>
  );
}

export default ProfileInfoScreen;
