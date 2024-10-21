import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

const rows = [
    {
        id: '1',
        name: 'папка1',
        customer: ['4', '5'],
    },
    {
        id: '2',
        name: 'папка2',
        customer: ['6'],
    },
    {
        id: '3',
        name: 'папка3',
        customer: ['7'],
    },
    {
        id: '4',
        name: 'папка4',
        customer: ['8'], // Внутренняя папка
    },
    {
        id: '5',
        name: 'папка5',
        customer: [],
    },
    {
        id: '6',
        name: 'папка6',
        customer: [],
    },
    {
        id: '7',
        name: 'папка7',
        customer: [],
    },
    {
        id: '8',
        name: 'папка8', // Исправлено имя папки
        customer: ['9'],
    },
    {
        id: '9',
        name: 'папка9', // Исправлено имя папки
        customer: [],
    },
];

const Folder = ({ folder, openFolders, onFolderClick }) => (
    <div>
        <Button
            variant="outlined"
            color="primary"
            onClick={() => onFolderClick(folder.id)}
        >
            <Typography level="body-lg">{folder.name}</Typography>
        </Button>
        {/* Проверяем, открыта ли текущая папка */}
        {openFolders[folder.id] && (
            <Box sx={{ pl: 3 }}>
                {folder.customer.map((customerId) => {
                    const customerRow = rows.find(r => r.id === customerId);
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
    </div>
);

export default function FolderButtons() {
    const [openFolders, setOpenFolders] = React.useState({}); // Храним открытые папки в виде объекта

    const handleButtonClick = (id) => {
        setOpenFolders(prevState => ({
            ...prevState,
            [id]: !prevState[id], // Переключаем состояние текущей папки
        }));
    };

    // Получаем все customer ids
    const allCustomers = rows.flatMap(row => row.customer);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {rows
                .filter(row => !allCustomers.includes(row.id)) // Фильтруем, исключая папки, которые есть у других
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
