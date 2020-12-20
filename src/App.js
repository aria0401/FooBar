import React, { useState, useEffect } from "react";
import { getData, getBeers, postOrder } from "./modules/Rest";
import { put } from "./modules/restdb";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Message from "./pages/Message";
import Details from "./pages/Details";
import Nav from "./components/Nav";
import "./App.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

export default function App() {
  // Show or hide navigation bar state
  const [showNav, setShowNav] = useState(false);

  // order post state to clear cart
  const [isPosted, setIsPosted] = useState(false);

  // Message state after posting an order showing the order id
  const [message, setMessage] = useState("");

  // Beers state to show the beer details page
  const [beers, setBeers] = useState([]);

  // Items state to display beer list and add or remove from cart
  const [cartItems, setCartItems] = useState([]);

  // Rating states

  // Rating beers array state from restdb database to show the live rating
  const [beersRating, setBeersRating] = useState([]);

  // Updating rating after clicking one of the stars buttons
  function updateRating(beerName, newRating) {
    const beerToUpdate = beersRating.filter((item) => item.name === beerName);
    const newRatingList = beerToUpdate[0].ratingArray.concat(newRating);

    // Sending the new chosen rating to the live data in restdbdatabae
    put(beerToUpdate[0]._id, newRatingList, showRating);
  }
  function showRating(res) {
    console.log(res, beersRating);
    // The new rating array of the updated beer

    const nextRatingArray = res.ratingArray;

    // Updating the beers rating array state
    const nextBerrsReating = beersRating.map((beerRating) => {
      if (beerRating.name === res.name) {
        beerRating.ratingArray = nextRatingArray;
      }
      return beerRating;
    });
    setBeersRating(nextBerrsReating);

    // Updating the cart items to show the correct rating

    const avarage =
      nextRatingArray.reduce((a, b) => a + b, 0) / nextRatingArray.length;
    const nextCartItems = cartItems.map((item) => {
      if (item.name === res.name) {
        item.rating = avarage;
      }
      return item;
    });
    setCartItems(nextCartItems);
  }
  // Displaying live rating in the details popup
  function applayRating() {
    const nextCartItems = cartItems.map((beer) => {
      beersRating.forEach((rating) => {
        if (beer.name === rating.name) {
          const avarage =
            rating.ratingArray.reduce((a, b) => a + b, 0) /
            rating.ratingArray.length;
          beer.rating = avarage;
        }
      });
      return beer;
    });
    setCartItems(nextCartItems);
  }

  function sendPostRequest(order) {
    //this function is called from Form
    postOrder(order, sendMessage);
  }

  // Showing notifications
  let notificationsCount;
  let totalPrice;
  if (cartItems.length > 1) {
    const reducer = (accumulator, currentValue) =>
      accumulator + currentValue.amount;
    notificationsCount = cartItems.reduce(reducer, 0);
    totalPrice = 45 * notificationsCount;
  }

  // clearing the cartItems after finish ordering
  function clearCart() {
    const clearedItems = cartItems.map((item) => {
      item.amount = 0;
      return item;
    });
    console.log(clearedItems);
    setCartItems(clearedItems);
    setIsPosted(false);
  }

  function editCartItems(name, modifier) {
    const nextItems = cartItems.map((item) => {
      if (item.name === name) {
        item.amount += modifier;
      }
      return item;
    });
    setCartItems(nextItems);
  }

  // Displaying nav bar

  function displayNav(bool) {
    setShowNav(bool);
  }

  const sendMessage = (res) => {
    setMessage(res);
    setIsPosted(true);
  };
  useEffect(() => {
    getData(setCartItems, setBeersRating);
    getBeers(setBeers);
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="nav">
          {showNav && <Nav />}

          <Switch>
            <Route path="/details/:beerId" component={Details} cartItems={cartItems}>
            </Route>
            <Route path="/message">
              <Message
                message={message}
                setShowNav={setShowNav}
                clearCart={clearCart}
              />
            </Route>
            <Route path="/payment">
              {isPosted ? (
                <Redirect to="/message" />
              ) : (
                <Payment
                  totalPrice={totalPrice}
                  setShowNav={setShowNav}
                  sendPostRequest={sendPostRequest}
                  cartItems={cartItems}
                />
              )}
            </Route>
            <Route path="/shop">
              <Shop
                applayRating={applayRating}
                updateRating={updateRating}
                setShowNav={setShowNav}
                notificationsCount={notificationsCount}
                beers={beers}
                cartItems={cartItems}
                editCartItems={editCartItems}
              />
            </Route>
            <Route path="/cart">
              <Cart
                displayNav={displayNav}
                notificationsCount={notificationsCount}
                beers={beers}
                cartItems={cartItems}
                editCartItems={editCartItems}
                sendPostRequest={sendPostRequest}
                totalPrice={totalPrice}
              />
            </Route>
            <Route path="/">
              <Home displayNav={displayNav} />
            </Route>
         
          </Switch>
        </div>
      </Router>
    </div>
  );
}



