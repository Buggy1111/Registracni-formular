'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form } from 'formik';
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
import { motion, AnimatePresence } from 'framer-motion';
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
  jmeno: Yup.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  prijmeni: Yup.string().min(2, 'Příjmení musí mít alespoň 2 znaky'),
  username: Yup.string()
    .required('Uživatelské jméno je povinné')
    .min(3, 'Uživatelské jméno musí mít alespoň 3 znaky')
    .max(20, 'Maximálně 20 znaků')
    .matches(/^[a-zA-Z0-9_]+$/, 'Pouze písmena, čísla a podtržítko'),
  email: Yup.string()
    .email('Neplatný formát emailu')
    .required('Email je povinný'),
  heslo: Yup.string()
    .min(8, 'Heslo musí mít alespoň 8 znaků')
    .matches(/[a-z]/, 'Musí obsahovat malé písmeno')
    .matches(/[A-Z]/, 'Musí obsahovat velké písmeno')
    .matches(/[0-9]/, 'Musí obsahovat číslo'),
  kraj: Yup.string(),
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

  // Načtení draft dat z localStorage
  const loadDraft = (): FormValues | null => {
    if (typeof window === 'undefined') return null;
    const draft = localStorage.getItem('formDraft');
    return draft ? JSON.parse(draft) : null;
  };

  // Uložení draft dat do localStorage
  const saveDraft = (values: FormValues) => {
    localStorage.setItem('formDraft', JSON.stringify(values));
    toast.success('Rozpracovaný formulář uložen', {
      icon: '💾',
      duration: 2000,
    });
  };

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    setIsSubmitting(true);

    // Simulace async operace
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Odeslaná data:', values);

    // Úspěšný submit
    toast.success('Formulář úspěšně odeslán!', {
      icon: '✅',
      duration: 3000,
    });

    setShowSuccess(true);
    setIsSubmitting(false);

    // Vymazání draftu
    localStorage.removeItem('formDraft');

    // Reset po 3 sekundách
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 3000);
  };

  const draft = loadDraft();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />

        <Container maxWidth="sm" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={darkMode ? 8 : 3}
              sx={{
                p: 4,
                background: darkMode
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              }}
            >
              {/* Header s dark mode toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Registrační formulář
                </Typography>
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  color="inherit"
                  aria-label="Přepnout motiv"
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Vyplňte prosím všechny povinné pole označené hvězdičkou (*)
              </Typography>

              {/* Draft notification */}
              {draft && !showSuccess && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Našli jsme uložený rozpracovaný formulář. Klikněte na tlačítko pro obnovení dat.
                </Alert>
              )}

              {/* Success message */}
              <Collapse in={showSuccess}>
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mb: 3 }}
                >
                  Formulář byl úspěšně odeslán! Data najdete v konzoli.
                </Alert>
              </Collapse>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, setValues }) => {
                  const passwordInfo = values.heslo ? passwordStrength(values.heslo) : null;

                  return (
                    <Form>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

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
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Jméno',
                              'aria-required': 'false',
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
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Příjmení',
                              'aria-required': 'false',
                            }}
                          />

                          {/* Uživatelské jméno - povinné */}
                          <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Uživatelské jméno *"
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
                            label="Email *"
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
                              disabled={isSubmitting}
                              inputProps={{
                                'aria-label': 'Heslo',
                                'aria-required': 'false',
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
                            disabled={isSubmitting}
                            inputProps={{
                              'aria-label': 'Kraj',
                              'aria-required': 'false',
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
                          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
                              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                              sx={{ flex: 1 }}
                            >
                              {isSubmitting ? 'Odesílám...' : 'Odeslat'}
                            </Button>

                            <Button
                              type="button"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
                              startIcon={<RestartAltIcon />}
                              onClick={() => {
                                setValues(initialValues);
                                localStorage.removeItem('formDraft');
                                toast.success('Formulář resetován');
                              }}
                              sx={{ flex: 1 }}
                            >
                              Reset
                            </Button>
                          </Box>

                          {/* Draft tlačítka */}
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Button
                              type="button"
                              variant="text"
                              size="small"
                              fullWidth
                              disabled={isSubmitting}
                              onClick={() => saveDraft(values)}
                            >
                              💾 Uložit rozpracovaný formulář
                            </Button>

                            {draft && (
                              <Button
                                type="button"
                                variant="text"
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                                onClick={() => {
                                  setValues(draft);
                                  toast.success('Formulář obnoven z úložiště');
                                }}
                              >
                                📂 Obnovit uložený formulář
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </motion.div>
                    </Form>
                  );
                }}
              </Formik>

              {/* Footer */}
              <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  Vytvořeno s ❤️ pomocí React, TypeScript, Material UI, Formik & Yup
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
                  AI-powered development • E LINKX úkol 2025
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
