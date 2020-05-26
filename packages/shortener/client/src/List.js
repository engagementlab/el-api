import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const GET_LINKS = gql`
    {
        getLinks        {
            id
            label
            shortUrl
            originalUrl
        }
    }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(label, short, long, clicks) {
  return { label, short, long, clicks };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
];

export default function DenseTable() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_LINKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <h2><p>Error :(</p><p>{JSON.stringify(error)}</p></h2>;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="list of all links">
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell align="right">Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.getLinks.map((row) => (
            <TableRow key={row.label}>
              <TableCell>
                {row.label}
              </TableCell>
              <TableCell>{row.shortUrl}</TableCell>
              <TableCell>{row.originalUrl}</TableCell>
              <TableCell align="right">{row.clicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
