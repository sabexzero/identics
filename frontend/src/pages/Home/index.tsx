import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Pagination } from "@mui/material";
import { useGetPaginationContentQuery } from "../../api/contentApi";
import { format } from "date-fns";
import { IGetPaginationContentResponse } from "../../api/contentApi/types.ts";
import Selector from "../../components/Selector";
import TableSkeleton from "../../components/TableSkeleton";
import Sidebar from "../../components/Sidebar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1565C0",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

interface PlagiarismTableProps {
    data?: IGetPaginationContentResponse;
    isLoading: boolean;
    perPage: number;
}

const PlagiarismTable: React.FC<PlagiarismTableProps> = ({
    data,
    isLoading,
    perPage,
}) => {
    if (isLoading) {
        return (
            <>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Дата проверки</StyledTableCell>
                            <StyledTableCell align="right">
                                Название документа
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Содержание ИИ текста
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Оригинальность
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Отчет
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                <TableSkeleton length={perPage} />
            </>
        );
    }

    return (
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                <TableRow>
                    <StyledTableCell>Дата проверки</StyledTableCell>
                    <StyledTableCell align="right">
                        Название документа
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        Содержание ИИ текста
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        Оригинальность
                    </StyledTableCell>
                    <StyledTableCell align="right">Отчет</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data?.content.map((item) => (
                    <StyledTableRow key={item.title}>
                        <StyledTableCell component="th" scope="row">
                            {item.dateTime
                                ? format(item.dateTime, "dd MMMM yyyy HH:mm:ss")
                                : "Нет данных"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            {item.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            {item.aiCheckLevel}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            {item.plagiarismLevel}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            {item.contentType}
                        </StyledTableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const Home: React.FC = () => {
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState<number>(10);

    const onChange = (value: number) => {
        setPage(0);
        setPerPage(value);
    };

    const { isLoading, data } = useGetPaginationContentQuery({
        page: page,
        perPage: perPage,
    });

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <Sidebar />
            <TableContainer sx={{ margin: "30px 100px", overflowX: "hidden" }}>
                <PlagiarismTable
                    key={`${page}-${perPage}`}
                    perPage={perPage}
                    data={data}
                    isLoading={isLoading}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mt: "10px",
                    }}
                >
                    <Selector
                        onChange={onChange}
                        initialValue={perPage.toString()}
                        options={["5", "10", "15", "30"]}
                    />
                    <Pagination
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                        }}
                        page={page + 1}
                        onChange={(_, page) => setPage(page - 1)}
                        count={data ? data.totalPages : 1}
                        shape="rounded"
                    />
                </Box>
            </TableContainer>
        </Box>
    );
};

export default Home;
