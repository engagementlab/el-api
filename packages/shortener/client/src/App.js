import React from 'react';
import logo from './logo.svg';
import './App.css';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';

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
      <Button
        variant="contained"
        color="primary"
        onClick={e => {
          e.preventDefault();
          addLink({
            variables: { label: 'testfdxgv', url: 'http://sglmgvd.comsfxg' },
          });
        }}
      >
        Hello World
      </Button>
    </div>
  );
}

export default App;
