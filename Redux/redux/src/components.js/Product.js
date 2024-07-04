import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useDispatch } from 'react-redux';
import { add } from '../store/cartSlice';

const Product = () => {
    const [products,getProducts]= useState([]);
    const dispatch = useDispatch();
    
    useEffect(()=>{
      //api
      fetch('https://fakestoreapi.com/products')
      .then(data=>data.json())
      .then(result =>getProducts(result))
    },[]);

    const addToCart=(product)=>{
      dispatch(add(product))
    }

const cards = products.map(product=>(
        <div className='col-md-3' key={product.id} style={{marginBottom:'20px'}}>
         <Card style={{ width: '18rem' }} className='h-100'>
            <div className='text-center'>
            <Card.Img variant="top" src={product.image} style={{width:'100px',height:'130px'}}/>
            </div>
          <Card.Body>
            <Card.Title>{product.title}</Card.Title>
            <Card.Text >
             LKR: {product.price}
            </Card.Text>

          </Card.Body>
          <Card.Footer>
          <Button variant="primary" onClick={()=>addToCart(product)}>Add To Cart</Button>
          </Card.Footer>
 
        </Card>
        </div>
))
  return (
   
    <div className='row'>
    <h1>Product Dashboard</h1>
    {cards}
    </div>
  )
}

export default Product;