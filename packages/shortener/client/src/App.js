import React from 'react';
import { Box } from '@material-ui/core';

import './App.css';

import Add from './Add';
import List from './List';

function App() {

  return (
    <div className="App">
      <Box color="text.primary" width="75%">

        <Add />
        <List />

      </Box>
    </div>
  );
}

export default App;
