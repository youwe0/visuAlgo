import React from 'react'

import Navabr from './components/Navbar'
import PathfindingVisualizer from './components/PathfindingVisualizer'
import SearchVisualizer from './components/SearchVisualizer'
import SortingVisualizer from './components/SortingVisualizer'


const App = () => {
  return (
    <div>
      <Navabr />
      <SortingVisualizer/>
      <PathfindingVisualizer />
      <SearchVisualizer />
    </div>
  )
}

export default App