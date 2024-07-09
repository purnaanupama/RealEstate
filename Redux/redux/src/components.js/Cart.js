import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useSelector,useDispatch } from 'react-redux';
import { remove } from '../store/cartSlice';

const Cart =()=>{
    const productCart = useSelector(state=>state.cart)
    const dispatch = useDispatch()
    const RemoveFromCart =(id)=>{
      dispatch(remove(id))
    }

    const cards = productCart.map(product=>(
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
          <Button variant="danger" onClick={()=>RemoveFromCart(product.id)}>Remove item</Button>
          </Card.Footer>
 
        </Card>
        </div>
))
    return(
        <>
        {cards}
        </>
    )
}

export default Cart;