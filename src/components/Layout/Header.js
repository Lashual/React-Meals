import { Fragment } from 'react';
import classes from './Header.module.css';
import Logo from '../../assets/meals.jpg';
import HeaderCartButton from './HeaderCartButton';


const Header = (props) => {


    return (
        <Fragment >

            <header className={classes.header}>
                <h1>ReactMeals</h1>
                <HeaderCartButton
                onClick= {props.onShowCart}
                />
                
               
            </header>
            <div className={classes['main-image']}>
                <img src={Logo} alt='A table full of food' />
            </div>
        </Fragment>
    );



};

export default Header;