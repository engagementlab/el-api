import React, { PureComponent, useState } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Fab, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';

class Add extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      shortUrl: null,
    };

    this.ADD_LINK = gql`
      mutation AddLink($label: String!, $url: String!) {
        addLink(label: $label, originalUrl: $url) {
          id
          label
          originalUrl
        }
      }
    `;
  }

  componentWillMount = () => {
    console.log('Add will mount');
  }

  componentDidMount = () => {
    console.log('Add mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('Add will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('Add will update', nextProps, nextState);
  }

  componentDidUpdate = () => {
    console.log('Add did update');
  }

  componentWillUnmount = () => {
    console.log('Add will unmount');
  }

  generateLink = (evt) => {

    if(evt.target.value.length < 5) return;
  
    fetch('http://localhost:3000/shortener/generate')
    .then((response) => {
        return response.text();
    }).then((data) => {
      this.setState({shortUrl: data});
    });
  
  }

  render () {
    // const [addLink, { data }] = useMutation(this.ADD_LINK);
    const { shortUrl } = this.state;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <TableContainer component={Paper}>
      <Table size="small" aria-label="form to add link">
          <TableBody>
          <TableRow key="Add">
              <TableCell>
                  <TextField id="add-label" label="Label" />
              </TableCell>
              <TableCell>
                  <Tooltip title="⌘ - V" arrow disableHoverListener disableTouchListener>
                    <TextField id="add-url" label="URL" onChange={(e) => this.generateLink(e)} />
                </Tooltip>
              </TableCell>
              <TableCell>
                  {`elab.works/${shortUrl ? shortUrl : '...'}`}
              </TableCell>
              <TableCell>
               <Fab size="medium" color="secondary" aria-label="add"
               onClick={e => {
                 e.preventDefault();
                //  addLink({
                //    variables: { label: `${Math.random()}`, url: `http://${Math.random()}` },
                //  });
               }}>
                 <AddIcon />
               </Fab>
              </TableCell>
          </TableRow>
          </TableBody>
      </Table>
      </TableContainer>
    );
  }
}

Add.propTypes = {
  // bla: PropTypes.string,
};

Add.defaultProps = {
  // bla: 'test',
};

export default Add;
