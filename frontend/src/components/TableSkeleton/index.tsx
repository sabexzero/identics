import React from "react";
import { Skeleton } from "@mui/material";

interface TableSkeleton {
    length: number;
}

const TableSkeleton: React.FC<TableSkeleton> = ({ length }) => {
    return (
        <React.Fragment>
            {Array.from({ length: length }).map((_, i) => (
                <Skeleton key={i} height={55} animation="wave" />
            ))}
        </React.Fragment>
    );
};

export default TableSkeleton;
