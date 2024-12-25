import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const rows = [
    { id: '1', name: '2024', customer: ['4', '5'] },
    { id: '2', name: '2023', customer: ['6'] },
    { id: '3', name: '2024', customer: ['7'] },
    { id: '4', name: 'Рег. конф.', customer: ['8'] },
    { id: '5', name: 'Курсовые', customer: [] },
    { id: '6', name: 'папка6', customer: [] },
    { id: '7', name: 'папка7', customer: [] },
    { id: '8', name: 'папка8', customer: ['9'] },
    { id: '9', name: 'папка9', customer: [] },
];

const Folder = ({ folder, openFolders, onFolderClick }) => {
    const [clicked, setClicked] = React.useState(false);

    const onClick = (id) => {
        onFolderClick(id, !clicked);
        setClicked(!clicked);
    };

    return (
        <Box sx={{ width: "fit-content", backgroundColor: "transparent" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    gap: "4px",
                }}
                onClick={() => onClick(folder.id)}
            >
                {clicked ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                <FolderIcon />
                <Typography level="body-lg">{folder.name}</Typography>
            </Box>
            {openFolders[folder.id] && (
                <Box sx={{ pl: 3 }}>
                    {folder.customer.map((customerId) => {
                        const customerRow = rows.find((r) => r.id === customerId);
                        return customerRow ? (
                            <Folder
                                key={customerRow.id}
                                folder={customerRow}
                                openFolders={openFolders}
                                onFolderClick={onFolderClick}
                            />
                        ) : null;
                    })}
                </Box>
            )}
        </Box>
    );
};

export default function FolderButtons() {
    const [openFolders, setOpenFolders] = React.useState({});

    const closeNestedFolders = (id) => {
        // Рекурсивная функция для закрытия вложенных папок
        const folder = rows.find(row => row.id === id);
        if (folder) {
            folder.customer.forEach(customerId => {
                setOpenFolders(prevState => ({ ...prevState, [customerId]: false }));
                closeNestedFolders(customerId);
            });
        }
    };

    const handleButtonClick = (id, isOpening) => {
        setOpenFolders((prevState) => ({
            ...prevState,
            [id]: isOpening, // Переключаем состояние текущей папки
        }));

        if (!isOpening) {
            closeNestedFolders(id); // Закрываем вложенные папки
        }
    };

    const allCustomers = rows.flatMap((row) => row.customer);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 0, width: "fit-content" }}>
            {rows
                .filter((row) => !allCustomers.includes(row.id))
                .map((row) => (
                    <Folder
                        key={row.id}
                        folder={row}
                        openFolders={openFolders}
                        onFolderClick={handleButtonClick}
                    />
                ))}
        </Box>
    );
}
