import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import CssBaseline from '@mui/joy/CssBaseline';
import framesxTheme from '../../components/theme/theme';
import Layout from './Layout';

export default function TeamExample() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={framesxTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          scrollSnapType: 'y mandatory',
          '& > div': {
            scrollSnapAlign: 'start',
          },
        }}
      >
        <Layout />
      </Box>
    </CssVarsProvider>
  );
}