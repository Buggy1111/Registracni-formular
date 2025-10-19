'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  LinearProgress,
  Chip,
  Alert,
  Collapse,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Data pro kraje ČR
const kraje = [
  'Hlavní město Praha',
  'Středočeský kraj',
  'Jihočeský kraj',
  'Plzeňský kraj',
  'Karlovarský kraj',
  'Ústecký kraj',
  'Liberecký kraj',
  'Královéhradecký kraj',
  'Pardubický kraj',
  'Vysočina',
  'Jihomoravský kraj',
  'Olomoucký kraj',
  'Zlínský kraj',
  'Moravskoslezský kraj',
];

// Počáteční hodnoty formuláře
const initialValues = {
  jmeno: '',
  prijmeni: '',
  username: '',
  email: '',
  heslo: '',
  kraj: '',
};

type FormValues = typeof initialValues;

// Validace síly hesla
const passwordStrength = (password: string): { strength: number; label: string; color: 'error' | 'warning' | 'success' } => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength: (strength / 5) * 100, label: 'Slabé', color: 'error' };
  if (strength <= 3) return { strength: (strength / 5) * 100, label: 'Střední', color: 'warning' };
  return { strength: (strength / 5) * 100, label: 'Silné', color: 'success' };
};

// Validační schéma s Yup
const validationSchema = Yup.object({
  jmeno: Yup.string()
    .required('Jméno je povinné')
    .min(2, 'Jméno musí mít alespoň 2 znaky'),
  prijmeni: Yup.string()
    .required('Příjmení je povinné')
    .min(2, 'Příjmení musí mít alespoň 2 znaky'),
  username: Yup.string()
    .required('Uživatelské jméno je povinné')
    .min(3, 'Uživatelské jméno musí mít alespoň 3 znaky')
    .max(20, 'Maximálně 20 znaků')
    .matches(/^[a-zA-Z0-9_]+$/, 'Pouze písmena, čísla a podtržítko'),
  email: Yup.string()
    .email('Neplatný formát emailu')
    .required('Email je povinný'),
  heslo: Yup.string()
    .required('Heslo je povinné')
    .min(8, 'Heslo musí mít alespoň 8 znaků')
    .matches(/[a-z]/, 'Musí obsahovat malé písmeno')
    .matches(/[A-Z]/, 'Musí obsahovat velké písmeno')
    .matches(/[0-9]/, 'Musí obsahovat číslo'),
  kraj: Yup.string().required('Výběr kraje je povinný'),
});

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Něco se pokazilo. Obnovte stránku.
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Theme configuration
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
        },
      }),
    [darkMode]
  );

  // LocalStorage - načtení uložených dat
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // LocalStorage - uložení dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSubmit = useCallback(async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsSubmitting(true);

    try {
      // Simulace async operace
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log pouze v development módu
      if (process.env.NODE_ENV === 'development') {
        console.log('Odeslaná data:', values);
      }

      // Úspěšný submit
      toast.success('Formulář úspěšně odeslán!', {
        icon: '✅',
        duration: 3000,
      });

      setShowSuccess(true);

      // Reset po 3 sekundách
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Chyba při odesílání:', error);
      toast.error('Nepodařilo se odeslat formulář');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />

        <Container
          maxWidth="sm"
          sx={{
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2 },
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Paper
              elevation={darkMode ? 8 : 3}
              sx={{
                p: { xs: 2, sm: 2.5 },
                background: darkMode
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              }}
            >
              {/* Header s dark mode toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, sm: 1.5 } }}>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                  Registrační formulář
                </Typography>
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  color="inherit"
                  aria-label="Přepnout motiv"
                  size="small"
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                Všechna pole jsou povinná (*)
              </Typography>

              {/* Success message */}
              <Collapse in={showSuccess}>
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon fontSize="small" />}
                  sx={{ mb: 1.5, py: 0.5 }}
                >
                  <Typography variant="caption">Formulář byl úspěšně odeslán!</Typography>
                </Alert>
              </Collapse>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, resetForm }) => {
                  const passwordInfo = values.heslo ? passwordStrength(values.heslo) : null;

                  return (
                    <Form>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.2, sm: 1.5 } }}>

                          {/* Jméno */}
                          <TextField
                            fullWidth
                            id="jmeno"
                            name="jmeno"
                            label="Jméno"
                            placeholder="Zadejte vaše jméno"
                            value={values.jmeno}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.jmeno && Boolean(errors.jmeno)}
                            helperText={touched.jmeno && errors.jmeno}
                            required
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Jméno',
                              'aria-required': 'true',
                            }}
                          />

                          {/* Příjmení */}
                          <TextField
                            fullWidth
                            id="prijmeni"
                            name="prijmeni"
                            label="Příjmení"
                            placeholder="Zadejte vaše příjmení"
                            value={values.prijmeni}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.prijmeni && Boolean(errors.prijmeni)}
                            helperText={touched.prijmeni && errors.prijmeni}
                            required
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Příjmení',
                              'aria-required': 'true',
                            }}
                          />

                          {/* Uživatelské jméno - povinné */}
                          <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Uživatelské jméno"
                            placeholder="Zadejte uživatelské jméno"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            required
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Uživatelské jméno',
                              'aria-required': 'true',
                            }}
                          />

                          {/* Email - povinný */}
                          <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Zadejte váš email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            required
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Email',
                              'aria-required': 'true',
                            }}
                          />

                          {/* Heslo s indikátorem síly */}
                          <Box>
                            <TextField
                              fullWidth
                              id="heslo"
                              name="heslo"
                              label="Heslo"
                              type="password"
                              placeholder="Zadejte silné heslo"
                              value={values.heslo}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.heslo && Boolean(errors.heslo)}
                              helperText={touched.heslo && errors.heslo}
                              required
                              disabled={isSubmitting}
                              inputProps={{
                                'aria-label': 'Heslo',
                                'aria-required': 'true',
                              }}
                            />
                            {passwordInfo && values.heslo && (
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption">Síla hesla:</Typography>
                                  <Chip
                                    label={passwordInfo.label}
                                    size="small"
                                    color={passwordInfo.color}
                                  />
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={passwordInfo.strength}
                                  color={passwordInfo.color}
                                />
                              </Box>
                            )}
                          </Box>

                          {/* Kraj - select */}
                          <TextField
                            fullWidth
                            select
                            id="kraj"
                            name="kraj"
                            label="Kraj"
                            placeholder="Vyberte kraj"
                            value={values.kraj}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.kraj && Boolean(errors.kraj)}
                            helperText={touched.kraj && errors.kraj}
                            required
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Kraj',
                              'aria-required': 'true',
                            }}
                          >
                            <MenuItem value="">
                              <em>Vyberte kraj</em>
                            </MenuItem>
                            {kraje.map((kraj) => (
                              <MenuItem key={kraj} value={kraj}>
                                {kraj}
                              </MenuItem>
                            ))}
                          </TextField>

                          {/* Tlačítka */}
                          <Box sx={{
                            display: 'flex',
                            gap: { xs: 1, sm: 1.5 },
                            mt: { xs: 0.5, sm: 1 },
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                              size="medium"
                              disabled={isSubmitting}
                              startIcon={isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />}
                              sx={{
                                flex: { sm: 1 },
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                              }}
                            >
                              {isSubmitting ? 'Odesílám...' : 'Odeslat'}
                            </Button>

                            <Button
                              type="button"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              size="medium"
                              disabled={isSubmitting}
                              startIcon={<RestartAltIcon />}
                              onClick={() => {
                                resetForm();
                                toast.success('Formulář resetován');
                              }}
                              sx={{
                                flex: { sm: 1 },
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                              }}
                            >
                              Reset
                            </Button>
                          </Box>

                        </Box>
                      </motion.div>
                    </Form>
                  );
                }}
              </Formik>
            </Paper>
          </motion.div>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
