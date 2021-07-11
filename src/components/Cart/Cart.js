import React, { useContext, useState } from 'react';
import classes from './Cart.module.css';
import CartItem from './CartItem';
import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';


const Cart = (props) => {
    const cartCtx = useContext(CartContext);
    const [isOrder, setIsOrder] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = item => {
        cartCtx.addItem({ ...item, amount: 1 });
    };

    const cartitems = <ul className={classes['cart-items']}>
        {cartCtx.items.map(item => (
            <CartItem
                key={item.id}
                name={item.name}
                amount={item.amount}
                price={item.price}
                onRemove={cartItemRemoveHandler.bind(null, item.id)}
                onAdd={cartItemAddHandler.bind(null, item)}
            />
        ))} </ul>;

    const onOrderHandler = event => {
        console.log('ordered');
        setIsOrder(true);
        console.log(isOrder);
    }
    const onOrderCancelHandler = event => {
        setIsOrder(false);
    }

    const onSubmitOrderHandler = async (userData) => {

        setIsSubmitting(true);

        await fetch('https://react-meal-app-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        });
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const modalActions = <div className={classes.actions}>
        <button className={classes['button--alt']}
            onClick={props.onHideCart}>Close</button>
        {hasItems && <button className={classes.button}
            onClick={onOrderHandler}>Order</button>}
    </div>

    const cartModalContent = (
        <>
            {cartitems}
            <div className={classes.total}>
                <span >Total amount</span>
                <span>{totalAmount}</span>
            </div>
            {isOrder && <Checkout
                onCancel={onOrderCancelHandler}
                onConfirm={onSubmitOrderHandler} />}
            {!isOrder && modalActions}
        </>);

    const isSubmittingModalContent = <p>Sending order data...</p>;
    const didSubmitModalContent = <>
        <p>Successfully sent the order!</p>
        <div className={classes.actions}>
            <button className={classes.button}
                onClick={props.onHideCart}>Close</button>
        </div>
    </>
    return (

        <Modal onCloseCart={props.onHideCart}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;