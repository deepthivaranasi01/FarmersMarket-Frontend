import { createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "./poduct-service";

export const createProductThunk = createAsyncThunk(
 "product/createProduct", async (product) => {
  console.log(product);
   const data = await productService.createProduct(product);
   return data;
 });

export const getProductThunk = createAsyncThunk(
 "product/getProduct", async (foodId) => {
   const data = await productService.getProduct(foodId);
   return data;
 });

export const updateProductThunk = createAsyncThunk(
 "product/updateProduct", async ({ foodId, product }) => {
   const data = await productService.updateProduct(foodId, product);
   return data;
 });

export const deleteProductThunk = createAsyncThunk(
 "product/deleteProduct", async (foodId) => {
   const data = await productService.deleteProduct(foodId);
   return data;
 });

 export const addReviewToProductThunk = createAsyncThunk(
  "product/addReviewToProduct",
  async ({ foodId, review }) => {
    
      const data = await productService.addReviewToProduct(foodId, review);
      return data;
  }
);