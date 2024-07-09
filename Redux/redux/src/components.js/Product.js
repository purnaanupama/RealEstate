import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useDispatch,useSelector } from 'react-redux';
import { add } from '../store/cartSlice';
import { getProducts } from '../store/productSlice';

const Product = () => {
    const dispatch = useDispatch();
    const {data :products} = useSelector(state=>state.products)

    useEffect(()=>{
      dispatch(getProducts())
    },[])

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