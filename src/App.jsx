import React from 'react'
import Navbar from './components/Navbar'
import Controls from './components/Controls'
// import { generateArray } from './utils/generateArray'



const App = () => {

  // const [array, setArray] = useState([]);
  // const handleGenerateArray = () => {
  //   const newArray = generateArray(arraySize); // arraySize from slider
  //   setArray(newArray);}

    return (
      <div>
        <Navbar />
        <Controls />
        <div className='bg-red-400 rounded-md grid place-content-center  items-center h-15 m-4'>--------------    PROJECT VISUALGO    ---------------</div>

      </div>

    )
  }

  export default App