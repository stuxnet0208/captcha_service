import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Box, IconButton, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_URL = 'http://localhost:8080'

const App: React.FC = () => {
  const [captcha, setCaptcha] = useState<{ image: string; text: string } | null>(null);
  const [message, setMessage] = useState('');

  // Fetch CAPTCHA on component mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const formik = useFormik({
    initialValues: {
      userInput: ''
    },
    validationSchema: Yup.object({
      userInput: Yup.string()
        .required('CAPTCHA response is required')
        .min(1, 'At least one character is required')
        .max(6, 'No more than 6 characters')
        .matches(/^[A-Za-z0-9]+$/, "CAPTCHA should be 6 alphanumeric characters")
    }),
    onSubmit: (values, helpers) => {
      if (captcha) {
        axios.post(API_URL + '/verify', {
          userInput: values.userInput,
          captchaText: captcha.text
        })
          .then(response => {
            setMessage(response.data.message);
            helpers.setStatus({ success: true })
            helpers.setSubmitting(false)
          })
          .catch(error => {
            console.error('Error verifying CAPTCHA:', error);
            helpers.setStatus({ success: false })
            helpers.setSubmitting(false)
          });
      }
    }
  });

  // Refresh CAPTCHA
  const fetchCaptcha = () => {
    axios.get(API_URL + '/captcha')
      .then(response => {
        setCaptcha(response.data);
        setMessage(''); // Clear old messages
        formik.resetForm()
      })
      .catch(error => console.error('Error fetching CAPTCHA:', error));
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center', fontWeight: 600, mt: 2, mb: 5 }}>May 2024 CAPTCHA SERVICE</Typography>
      <Box display="flex" alignItems="center" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {captcha && <img src={captcha.image} alt="CAPTCHA" />}
        <IconButton onClick={fetchCaptcha} color="primary" aria-label="reload captcha">
          <RefreshIcon />
        </IconButton>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid xs={12} sm={8} md={6} item container sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
          <TextField
            label="Enter CAPTCHA"
            variant="outlined"
            name="userInput"
            fullWidth
            value={formik.values.userInput}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userInput && Boolean(formik.errors.userInput)}
            helperText={formik.touched.userInput && formik.errors.userInput}
            style={{ margin: '10px 0' }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size='large'
            disabled={formik.isSubmitting}
            sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', width: '120px' }}
          >
            Submit
          </Button>
        </Grid>

      </form>
      {message && <Typography sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>{message}</Typography>}
    </div>
  );
};

export default App;
