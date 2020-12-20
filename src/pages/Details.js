import React from "react";
import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import beerImages from "../components/BeerImages";


export default function Details(props){

    const [isLoading, setIsLoading] = useState(true);
    const [beer, setBeer] = useState();
    const [beerArray, setBeerArray] = useState([]);
    const beerName = props.match.params.beerId;
    let beerObject; 

    beerArray.forEach((item)=>{
        if(item.name===beerName){
            console.log("this is my item: ", item);
           beerObject = item;
        }
    })

    console.log("this is my beerObject: ", beerObject);



    useEffect(()=>{
        fetch("https://foo-bar-managers.herokuapp.com/beertypes", {
            method: "get",
            headers: {
              "Content-Type": "application/json; charset=utf-8", 
            },
          })
            .then((e) => e.json())
            .then((response) => {
                setBeerArray(response);
                setIsLoading(false);
              })

      }, []);

      console.log("beerArray is: ", beerArray[5]);

   
        return(
            <section>
                <Link to="/shop">
                  <h2>back to shop  </h2>
                 </Link>
                <h1>this is details. And the beer is: {beerName}</h1>
                {/* <p>beers is {beerArray[5].name}</p> */}
                
            </section>
        )
      
 
  
}



