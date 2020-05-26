import React from 'react';
import './App.css';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Box, Button } from '@material-ui/core';

import List from './List';


const ADD_LINK = gql`
  mutation AddLink($label: String!, $url: String!) {
    addLink(label: $label, originalUrl: $url) {
      id
      label
      originalUrl
    }
  }
`;

function App() {
  const [addLink, { data }] = useMutation(ADD_LINK);

  return (
    <div className="App">
      <Box color="text.primary" width="75%">
      <Button
        variant="contained"
        color="primary"
        onClick={e => {
          e.preventDefault();
          addLink({
            variables: { label: `${Math.random()}`, url: `http://${Math.random()}` },
          });
        }}
      >
        Hello World
      </Button>
      <List />
      </Box>
    </div>
  );
}

export default App;
