import React from "react";
import { Link } from "react-router-dom";
import beerImages from "../components/BeerImages";


export default function Details(props){
let myBeer = props.beers.find(beerObj => beerObj.name === props.foundBeer.name);
  console.log("myBeer is: ", myBeer);

   
        return(
            <section>
                <Link to="/shop">
                  <h2>back to shop  </h2>
                 </Link>
                <h1>this is details. And the beer is: {myBeer.name}</h1>
                <p>and its category is {myBeer.category}</p>    
            </section>
        )
      
 
  
}



