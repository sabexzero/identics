import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import TwoSidedLayout from '../../components/TwoSidedLayout/TwoSidedLayout';

export default function Layout() {
  return (
    <TwoSidedLayout>
      <Typography color="primary" sx={{ fontWeight: 'xl',
           fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
           fontFamily: 'Questrial, sans-serif',
           letterSpacing: '20px'}}>
        IDENTICS
      </Typography>
      <Typography
        level="h1"
        sx={{
          fontWeight: 'xl',
          fontSize: 'clamp(1.5rem, 1rem + 2.1818vw, 2.7rem)',
          lineHeight: '1.2em'
        }}
      >
        Мы - надежная защита от плагиата с применением передовых технологий.
      </Typography>
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: 'lg', lineHeight: 'lg' }}
      >
        Точность, скорость и инновации - выбери антиплагиат нового поколения!
      </Typography>
      <Link
          component={RouterLink}
          sx={{ fontWeight: 'lg' }} to='/register'>
            <Button size="lg" endDecorator={<ArrowForward fontSize="xl" />}>
              Зарегистироваться
            </Button>
        </Link>
      <Typography>
        Уже есть аккаунт? 
        <Link
          component={RouterLink}
          sx={{ fontWeight: 'lg' }} to='/login'>
            Войти
        </Link>
      </Typography>
    </TwoSidedLayout>
  );
}
