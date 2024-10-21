import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import Directory from './components/Directory';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import Sidebar from './components/Sidebar';
import OrderTable from './components/OrderTable';
import OrderList from './components/OrderList';
import Header from './components/Header';
import Divider from "@mui/joy/Divider";

export default function ProfilePage() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh', maxWidth: '94dvw',mx: 'auto' }}>
        {/*<Header />*/}
        {/*<Sidebar />*/}
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >

          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography color="primary" level="h1" component="h1"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'xs',
                            fontSize: 'clamp(1rem, 1rem + 2.1818vw, 2rem)',
                            fontFamily: 'Questrial, sans-serif',
                            letterSpacing: '20px'}}>
              IDENTICsssssssssssssssS
            </Typography>


              <Box sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',


              }}
              >
                  <Button
                      color="none"
                      size="sm"
                  >
                      История
                      <AccessTimeIcon sx={{
                          marginLeft: '0.5rem',
                      }}>
                      </AccessTimeIcon>
                  </Button>

                  <Typography
                      sx={{
                          border: 1,
                          borderRadius: '10px',
                          py: '4px',
                          px: '4px',
                      }}>
                      &nbsp;Баланс: 3209₽ &nbsp;
                      <Button
                          color="primary"
                          size="sm"
                      >
                          Пополнить
                      </Button>
                  </Typography>



                  <Button
                      color="primary"
                      size="sm"
                  >
                      Выйти
                  </Button>
              </Box>

          </Box>
            <Box>
                <Directory/>
                <OrderTable />
            </Box>

          {/*<OrderList />*/}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
