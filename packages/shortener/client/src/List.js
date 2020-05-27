import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import { FileCopyOutlined } from "@material-ui/icons";

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
  shortLabel:  {
      color: 'grey',
      fontSize: 'x-small',
  }
});

/**
 * Copy URL to clipboard
 * @function
 * @param {Element} [el] - DOM element containing URL to copy to clipboard
 */
const copyUrl = (el) => {

    // Create a range and set it to the contents of the reference element
    const range = document.createRange();  
    range.selectNodeContents(el);

    window.getSelection().addRange(range);
    const copied = document.execCommand('copy');

    window.getSelection().removeRange(range);
}


export default function DenseTable() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { loading, error, data } = useQuery(GET_LINKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <h2><p>Error :(</p><p>{JSON.stringify(error)}</p></h2>;
  
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
     <TableContainer component={Paper}>

         <Table className={classes.table} size="small" aria-label="list of all links">
             <TableHead>
                 <TableRow>
                     <TableCell>Label</TableCell>
                     <TableCell>Short URL <span className={classes.shortLabel}>elab.works/...</span></TableCell>
                     <TableCell>Original URL</TableCell>
                     <TableCell align="right">Clicks</TableCell>
                 </TableRow>
             </TableHead>
             <TableBody>
                 {/* Data from Graph */}
                 {data.getLinks.map((row) => (
                 <TableRow key={row.label}>
                     <TableCell>
                         {row.label}
                     </TableCell>
                     <TableCell>
                         <Tooltip title="Add" arrow onClose={handleTooltipClose} open={open} disableFocusListener
                             disableHoverListener disableTouchListener>
                             <IconButton aria-label="copy url" onClick={e=>
                                 {copyUrl(document.getElementById(`label-${row.id}`)); handleTooltipOpen();}}>
                                 <FileCopyOutlined />
                             </IconButton>
                         </Tooltip>
                         <span id={`label-${row.id}`}>{row.shortUrl}</span>
                     </TableCell>
                     <TableCell>{row.originalUrl}</TableCell>
                     <TableCell align="right">{row.clicks}</TableCell>
                 </TableRow>
                 ))}
             </TableBody>
         </Table>
     </TableContainer>
  );
}
