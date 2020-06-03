import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Box } from '@material-ui/core';

import './App.css';

import Add from './Add';
import List from './List';

function App() {

  const GET_LINKS = gql`
      {
          getLinks {
              id
              date
              label
              shortUrl
              originalUrl
              user
              clicks
          }
      }
  `;

  const { loading, error, data, refetch } = useQuery(GET_LINKS);
  if (error) return <h2><p>Error :(</p><p>{JSON.stringify(error)}</p></h2>;

  return (
    <div>
    <h2><img className="App-logo" alt="Small ELab logo" src="https://res.cloudinary.com/engagement-lab-home/image/upload/v1543874087/logos/logo-sm.svg" /> Engagement Lab URL Shortener</h2>
      <div className="App">
        <Box color="text.primary" width="75%">
          { loading ? 
              <p>Loading...</p> :
              (
                <div>
                  <Add updated={() => refetch()} />
                  <List data={data.getLinks} />
                </div>
              )
          }

        </Box>
      </div>
    </div>
  );
}

export default App;
