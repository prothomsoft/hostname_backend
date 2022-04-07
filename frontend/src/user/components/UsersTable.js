import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const TablePaginationActions = (props) => {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
};

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

const UsersTable = (props) => {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { items, onDelete, onHide } = props;

    const { sendRequest } = useHttpClient();

    let rows = [];
    items.map((user) =>
        rows.push({
            key: user.id,
            id: user.id,
            name: user.name,
            logCounter: user.logCounter,
            welcomeURL: user.welcomeURL,
            login: user.login,
            creationDate: moment(user.creationDate),
            isWelcome: user.isWelcome,
            isSesjaNarzeczenska: user.isSesjaNarzeczenska,
            isSlub: user.isSlub,
            isSesjaSlubna: user.isSesjaSlubna,
            isSesjaOkolicznosciowa: user.isSesjaOkolicznosciowa,
            isHidden: user.isHidden,
        })
    );
    rows.sort((a, b) => (a.creationDate > b.creationDate ? -1 : 1));
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (items.length === 0) {
        return (
            <div className="center">
                <h2>No users found.</h2>
            </div>
        );
    }

    const confirmDeleteHandler = async (userId) => {
        await sendRequest(`/users/${userId}`, {}, "DELETE");
        onDelete(userId);
    };

    const confirmHideHandler = async (userId, status) => {
        await sendRequest(`/users/hide/${userId}/${status}`, {}, "DELETE");
        onHide(userId, status);
    };

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">DATA</TableCell>
                            <TableCell align="center">LOGIN</TableCell>
                            <TableCell align="center">URL</TableCell>
                            <TableCell align="center">WELCOME</TableCell>
                            <TableCell align="center">SESJA</TableCell>
                            <TableCell align="center">ŚLUB</TableCell>
                            <TableCell align="center">PLENER</TableCell>
                            <TableCell align="center">CHRZEST</TableCell>
                            <TableCell align="center">LOGS</TableCell>
                            <TableCell align="center">DISPLAYED</TableCell>
                            <TableCell align="center">DEL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row) => (
                            <TableRow key={row.key}>
                                <TableCell align="center">{row.creationDate.format("YYYY-MM-DD")}</TableCell>
                                <TableCell align="center">{row.login}</TableCell>
                                <TableCell align="center">{row.welcomeURL}</TableCell>
                                <TableCell align="center">
                                    {row.isWelcome && (
                                        <Link component={NavLink} to={`/images/${row.id}/welcome`}>
                                            VIEW
                                        </Link>
                                    )}
                                    {!row.isWelcome && (
                                        <Link component={NavLink} to={`/upload/${row.id}/welcome`}>
                                            ADD
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {row.isSesjaNarzeczenska && (
                                        <Link component={NavLink} to={`/images/${row.id}/sesja_narzeczenska`}>
                                            VIEW
                                        </Link>
                                    )}
                                    {!row.isSesjaNarzeczenska && (
                                        <Link component={NavLink} to={`/upload/${row.id}/sesja_narzeczenska`}>
                                            ADD
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {row.isSlub && (
                                        <Link component={NavLink} to={`/images/${row.id}/slub`}>
                                            VIEW
                                        </Link>
                                    )}
                                    {!row.isSlub && (
                                        <Link component={NavLink} to={`/upload/${row.id}/slub`}>
                                            ADD
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {row.isSesjaSlubna && (
                                        <Link component={NavLink} to={`/images/${row.id}/sesja_slubna`}>
                                            VIEW
                                        </Link>
                                    )}
                                    {!row.isSesjaSlubna && (
                                        <Link component={NavLink} to={`/upload/${row.id}/sesja_slubna`}>
                                            ADD
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {row.isSesjaOkolicznosciowa && (
                                        <Link component={NavLink} to={`/images/${row.id}/sesja_okolicznosciowa`}>
                                            VIEW
                                        </Link>
                                    )}
                                    {!row.isSesjaOkolicznosciowa && (
                                        <Link component={NavLink} to={`/upload/${row.id}/sesja_okolicznosciowa`}>
                                            ADD
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">{row.logCounter}</TableCell>
                                <TableCell align="center">
                                    {row.isHidden && (
                                        <Link component={NavLink} to={"#"} onClick={() => confirmHideHandler(row.id, false)}>
                                            NO
                                        </Link>
                                    )}
                                    {!row.isHidden && (
                                        <Link component={NavLink} to={"#"} onClick={() => confirmHideHandler(row.id, true)}>
                                            YES
                                        </Link>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Link component={NavLink} to={"#"} onClick={() => confirmDeleteHandler(row.id)}>
                                        DEL
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={11} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                colSpan={11}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { "aria-label": "rows per page" },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default UsersTable;
