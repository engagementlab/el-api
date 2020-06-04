import React from 'react';

import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@material-ui/core';

import { FileCopyOutlined, Link, LaunchOutlined } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { IconButton, Popover } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'LunchtypeRegular',
    }
});
const useStyles = makeStyles(theme => ({
        header: {
            fontSize: 'large',
            fontWeight: 'bold',
        },
        invisible: {
            display: 'inline-block',
            color: 'white',
            width: 0,
        },
        link: {
            color: 'black',
        },
        info: {
            cursor: 'pointer',
        },
        popover: {
            padding: theme.spacing(2),
        },
        table: {
            minWidth: 650,
        },
        shortLabel:  {
            color: 'grey',
            fontSize: 'x-small',
        }
    })
);


function Alert(props) {
    return <MuiAlert icon={<Link fontSize="inherit" />} elevation={6} variant="filled" {...props} />;
}

export default function DenseTable(props) {

    const classes = useStyles();
    const [copied, setCopied] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverData, setPopoverData] = React.useState(null);

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
        
        const didCopy = document.execCommand('copy');
        window.getSelection().removeRange(range);

        setCopied(didCopy);

    }

    // Close snackbar after 'copied' notifier
    const snackbarClose = (event, reason) => {
        setCopied(false);
    };

    const handlePopoverOpen = (event) => {
        const data = event.currentTarget.dataset;
        setAnchorEl(event.currentTarget);
        setPopoverData({date: data.date, clicks: data.clicks});
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    // Shorten original url if too long
    const trimUrl = (url) => {
        return (url.length > 40) ? `${url.substring(0, 40)}...` : url;
    }

    const open = Boolean(anchorEl);

  return (
    <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>

            <Popover id="info" open={open} anchorEl={anchorEl} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }} transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }} onClose={handlePopoverClose}>
                {popoverData
                ?
                <Typography className={classes.popover}>{popoverData.date} <br /> <em>{popoverData.clicks ?
                        popoverData.clicks : '0'} clicks</em></Typography>
                : null
                }
            </Popover>
            
            <Table className={classes.table} size="small" aria-label="list of all links">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.header}>Label</TableCell>
                        <TableCell className={classes.header}>Short URL <span
                                className={classes.shortLabel}>elab.works/...</span></TableCell>
                        <TableCell className={classes.header}>Original URL
                            <LaunchOutlined size="small" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Data from Graph */}
                    {props.data.map((row) => (
                    <TableRow key={row.label}>
                        <TableCell>
                            {row.label}
                        </TableCell>
                        <TableCell>
                            <IconButton aria-label="copy url" onClick={e=>
                                { copyUrl(document.getElementById(`hidden-${row.id}`)); }
                                }>
                                <FileCopyOutlined />
                            </IconButton>
                            <span id={`hidden-${row.id}`}
                                className={classes.invisible}>https://elab.works/{row.shortUrl}</span>
                            <span id={`label-${row.id}`}>{row.shortUrl}</span>
                        </TableCell>
                        <TableCell><a href={row.originalUrl} target="_blank" rel="noreferrer"
                                className={classes.link}>{trimUrl(row.originalUrl)}</a></TableCell>
                        <TableCell align="right">
                            <InfoIcon id={`info-${row.id}`} 
                                className={classes.info}
                                data-date={`Added on ${row.date} by ${row.user || '??' }`}
                                data-clicks={row.clicks}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onClick={handlePopoverOpen} />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>

                <Snackbar open={copied} autoHideDuration={1000} onClose={snackbarClose}>
                    <Alert severity="success">
                        Copied
                    </Alert>
                </Snackbar>
            </Table>
        </TableContainer>
    </ThemeProvider>
  );
}
