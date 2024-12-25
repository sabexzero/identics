import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Table from '@mui/joy/Table';
import Link from '@mui/joy/Link';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                {/*<MenuItem>Редактировать</MenuItem>*/}
                <MenuItem>Переименовать</MenuItem>
                {/*<MenuItem>Заменить</MenuItem>*/}
                <Divider />
                <MenuItem color="danger">Удалить</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function OrderTable() {
    const [order, setOrder] = React.useState<Order>('desc');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_ENDPOINT_TABLE);
                const data = await response.json();
                setRows(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const renderFilters = () => (
        <React.Fragment>
            <FormControl size="sm" sx={{ flex: 1 }}>
                <FormLabel>Status</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="Paid">Paid</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="refunded">Refunded</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
            </FormControl>
            <FormControl size="sm" sx={{ flex: 1 }}>
                <FormLabel>Category</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="refund">Refund</Option>
                    <Option value="purchase">Purchase</Option>
                    <Option value="debit">Debit</Option>
                </Select>
            </FormControl>
            <FormControl size="sm" sx={{ flex: 1 }}>
                <FormLabel>Customer</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="olivia">Olivia Rhye</Option>
                    <Option value="steve">Steve Hampton</Option>
                    <Option value="ciaran">Ciaran Murray</Option>
                    <Option value="marina">Marina Macdonald</Option>
                    <Option value="charles">Charles Fulton</Option>
                    <Option value="jay">Jay Hoper</Option>
                </Select>
            </FormControl>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1, flexDirection: 'column' }}
            >
                <Input
                    size="sm"
                    placeholder="Search"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {renderFilters()}
                </Box>
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            Filters
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {renderFilters()}
                            <Button color="primary" onClick={() => setOpen(false)}>
                                Submit
                            </Button>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: 'sm',
                    py: 2,
                    display: { xs: 'none', sm: 'flex' },
                    flexWrap: 'wrap',
                    gap: 1.5,
                    '& > *': {
                        minWidth: { xs: '120px', md: '160px' },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Поиск по названию</FormLabel>
                    <Input size="sm" placeholder="Поиск" startDecorator={<SearchIcon />} />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                // variant="outlined"
                sx={{
                    margin: '16px', // Добавляем отступы вручную
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        textAlign: 'center',
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                    <tr>
                        <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                            <Checkbox
                                size="sm"
                                indeterminate={selected.length > 0 && selected.length !== rows.length}
                                checked={selected.length === rows.length}
                                onChange={(event) => {
                                    setSelected(event.target.checked ? rows.map((row) => row.id) : []);
                                }}
                                color={selected.length > 0 || selected.length === rows.length ? 'primary' : undefined}
                                sx={{ verticalAlign: 'text-bottom' }}
                            />
                        </th>
                        <th style={{ width: 140, textAlign: 'center', padding: '12px 6px' }}>Название документа</th>
                        <th style={{ width: 140, textAlign: 'center', padding: '12px 6px' }}>Дата загрузки</th>
                        <th style={{ width: 140, textAlign: 'center', padding: '12px 6px' }}>Содержание ИИ в тексте</th>
                        <th style={{ width: 240, textAlign: 'center', padding: '12px 6px' }}>Оригинальность</th>
                        <th style={{ width: 140, textAlign: 'center', padding: '12px 6px' }}>Отчет</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...rows].sort(getComparator(order, 'id')).map((row) => (
                        <tr key={row.id}>
                            <td style={{ textAlign: 'center', width: 120 }}>
                                <Checkbox
                                    size="sm"
                                    checked={selected.includes(row.id)}
                                    color={selected.includes(row.id) ? 'primary' : undefined}
                                    onChange={(event) => {
                                        setSelected((ids) =>
                                            event.target.checked ? ids.concat(row.id) : ids.filter((itemId) => itemId !== row.id)
                                        );
                                    }}
                                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Typography level="body-xs">{row.id}</Typography>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Typography level="body-xs">{row.date}</Typography>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Chip
                                    variant="soft"
                                    size="sm"
                                    startDecorator={
                                        {
                                            Отсутствует: <CheckRoundedIcon />,
                                            Проверить: <AutorenewRoundedIcon />,
                                            Присутствует: <BlockIcon />,
                                        }[row.status]
                                    }
                                    color={
                                        {
                                            Отсутствует: 'success',
                                            Проверить: 'neutral',
                                            Присутствует: 'danger',
                                        }[row.status] as ColorPaletteProp
                                    }
                                >
                                    {row.status}
                                </Chip>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Typography level="body-xs">{row.customer}%</Typography>
                            </td>
                            <td style={{ textAlign: 'center', position: 'relative' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Link level="body-xs" component="button">
                                        Скачать
                                    </Link>
                                    <RowMenu />
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

            </Sheet>
            <Box
                className="OrderTableContainer-mobile"
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                {[...rows].sort(getComparator(order, 'id')).map((row) => (
                    <Sheet
                        key={row.id}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            p: 2,
                            gap: 2,
                            borderRadius: 'sm',
                        }}
                    >
                        <Typography level="body-xs" fontWeight="bold" mb={0.5}>
                            Название документа: <Typography level="body-xs">{row.id}</Typography>
                        </Typography>

                        <Typography level="body-xs" fontWeight="bold" mb={0.5}>
                            Дата загрузки: <Typography level="body-xs">{row.date}</Typography>
                        </Typography>

                        <Typography level="body-xs" fontWeight="bold" mb={0.5}>
                            Содержание ИИ в тексте: <Chip
                            variant="soft"
                            size="sm"
                            startDecorator={
                                {
                                    Отсутствует: <CheckRoundedIcon />,
                                    Проверить: <AutorenewRoundedIcon />,
                                    Присутствует: <BlockIcon />,
                                }[row.status]
                            }
                            color={
                                {
                                    Отсутствует: 'success',
                                    Проверить: 'neutral',
                                    Присутствует: 'danger',
                                }[row.status] as ColorPaletteProp
                            }
                        >
                            {row.status}
                        </Chip>
                        </Typography>

                        <Typography level="body-xs" fontWeight="bold" mb={0.5}>
                            Оригинальность: <Typography level="body-xs">{row.customer}</Typography>
                        </Typography>

                        <Box sx={{ display: 'flex',alignItems: 'center',justifyContent: 'space-between'}}>
                            <Link level="body-xs" component="button">
                                Скачать
                            </Link>
                            <RowMenu />
                        </Box>
                    </Sheet>
                ))}
            </Box>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                    display: {
                        xs: 'none',
                        md: 'flex',
                    },
                }}
            >
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                        minWidth: 0, // Убирает минимальную ширину
                        width: '40px', // Ширина кнопки
                        height: '40px', // Высота кнопки равна ширине
                        padding: 0, // Убирает внутренние отступы
                        display: 'flex', // Для центрирования иконки
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </Button>
                <Box sx={{ flex: 1 }} />
                {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={Number(page) ? 'outlined' : 'plain'}
                        color="neutral"
                        sx={{
                            width: '40px', // Ширина кнопки
                            height: '40px', // Высота кнопки равна ширине
                            display: 'flex', // Для центрирования содержимого
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 0, // Убирает внутренние отступы
                            minWidth: 0, // Убирает минимальную ширину
                        }}
                    >
                        {page}
                    </IconButton>
                ))}

                <Box sx={{ flex: 1 }} />
                <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                        minWidth: 0, // Убирает минимальную ширину
                        width: '40px', // Ширина кнопки
                        height: '40px', // Высота кнопки равна ширине
                        padding: 0, // Убирает внутренние отступы
                        display: 'flex', // Для центрирования иконки
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <KeyboardArrowRightIcon />
                </Button>

            </Box>
            <Box
                className="Pagination-mobile"
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    pt: 2,
                    mb: 3
                }}
            >
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
                        <IconButton
                            key={page}
                            size="sm"
                            variant={Number(page) ? 'outlined' : 'plain'}
                            color="neutral"
                        >
                            {page}
                        </IconButton>
                    ))}
                </Box>
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Box>
        </React.Fragment>
    );
}
