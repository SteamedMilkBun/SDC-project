import { useState, useEffect} from 'react';
import './Main.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Main Component 
const Main = () => {

  // Fetch function that fetches a mug with a specific id 
  const fetchMugs = () => {
    return fetch("https://fec-project-tjyl.onrender.com/mugs/1")  // Fetch data from endpoint
      .then((response) => response.json()) // if fetch was successful, then respond with json formatted data
      .then((data) => { // And return an object with key/value pairs. The values being the data. 
        return {
          mugName: data.mug_name,
          mugDescription1: data.mug_description_1,
          mugDescription2: data.mug_description_2,
          mugShipping: data.mug_shipping,
        };
      })
      .catch((error) => { // If fetch was unsuccessful 
        console.error("Error fetching mugs:", error); // Log out error 
        throw error; // throw error
      }); 
  };

   // images array containing the images we will display
    const images = ["https://res.cloudinary.com/hbhhv9rz9/image/upload/f_auto,c_limit,w_3840,q_auto/Merch PDPs/Fellow Carter Move 12oz Fog Grey/test_Fellow-Carter-Move-12oz-M1-Hero.png", 
    'https://res.cloudinary.com/hbhhv9rz9/image/upload/f_auto,c_limit,w_3840,q_auto/Merch PDPs/Fellow Carter Move 12oz Fog Grey/test_Fellow-Carter-Move-12oz-M1-Detail1.png']

    const [currentPic, setCurrentPic] = useState(images[0]); // Create and set the initial state for the current picture
    const [currentQuantity, setCurrentQuantity] = useState(1) // Create and set the initial state for the current quantity
    const [currentPrice, setCurrentPrice] = useState(36); // Create and set the initial state for the current price 
    const [showFirstButton, setShowFirstButton] = useState(false); // Create and set the initial state for the first button 
    const [mugData, setMugData] = useState({}); // Create and set the initial state for the mug data
  
    // Fetch data when the component mounts
    useEffect(() => {
      fetchMugs().then(setMugData).catch(console.error); // Invoke fetchMugs, attain the returned data, and pass the data to setMugData.
    }, []);

    // Function to display first pic
    const firstPic = () => { 
        setCurrentPic(images[0]); // Set the current picture to the first element in the images array
        setShowFirstButton(false); // Hide the first button and show the second
    }

    // Function to display second pic
    const secondPic = () => {
        setCurrentPic(images[1]); // Set the current picture to the second element in the images array
        setShowFirstButton(true); // Show the first button and hide the second
    }

    // Function to increase quantity 
    const increaseQuantity = () => {
        const newQuantity = currentQuantity + 1; // Increase the current quantity by one and store the sum in a const 
        setCurrentQuantity(newQuantity); // Set the current quantity to the new quantity 
        setCurrentPrice(newQuantity * 36); // Set the current price to the new quantity multiplied by the individual price 
    }

    // Function to decrease quantity
    const decreaseQuantity = () => {
        const newQuantity = Math.max(1, currentQuantity - 1); // Decrease the current quantity by one and store the difference in a const. Also, ensure that the new quantity cannot be less than 1.
        setCurrentQuantity(newQuantity); // Set the current quantity to the new quantity 
        setCurrentPrice(newQuantity * 36); // Set the current price to the new quantity multiplied by the individual price 
    }

    // Function that handles the input
    const handleInputChange = (event) => {
        const newQuantity = Math.max(0, parseInt(event.target.value, 10) || 0); // Parse the input into an int and provide a fallback if no int is inputted. Also, ensure that the new quantity cannot be less than 0.
        setCurrentQuantity(newQuantity); // Set the current quantity to the new quantity 
        setCurrentPrice(newQuantity * 36); // Set the current price to the new quantity multiplied by the individual price 

    }


return (
<>
<div className="main-component">
    <div className='row'>
      <div className='carousel col-sm-8'>
        <div className="image-container"> {/* Add this wrapper */}
          {showFirstButton && <button className="nav-button" onClick={firstPic}>{'<---'}</button>}
          <img src={currentPic} alt="coffee" height="100px" width="100px"/>
          {!showFirstButton && <button className="nav-button" onClick={secondPic}>{'--->'}</button>}
        </div>
      </div>
        <div className='product-info col-sm-4'>
            <h1>{mugData.mugName}</h1>
            <p>{mugData.mugDescription1}</p>
            <p>{mugData.mugDescription2}</p>
            <p>{mugData.mugShipping}</p>
            <div className='row'>
                <div className='quantity-selector col-sm-6'>
                    <form aria-label="quantity selector" className="w-full bg-white flex flex-row border text-black">
                        <button aria-label="decrease by 1" className="incrementor-button w-1/4 text-center" type="button" onClick={decreaseQuantity}>-</button>
                        <input aria-label="item quantity" className="w-1/2 text-center outline-none" value={currentQuantity} maxLength="3" onChange={handleInputChange}/>
                        <button aria-label="increase by 1" className="incrementor-button w-1/4 text-center" type="button" onClick={increaseQuantity}>+</button>
                    </form>
                </div>
                <div className='add-to-cart col-sm-6'>
                    <button className='btn dark'>ADD TO CART | ${currentPrice}</button>
                </div>
            </div>
        </div>
    </div>
</div>
</>
)
}

export default Main;