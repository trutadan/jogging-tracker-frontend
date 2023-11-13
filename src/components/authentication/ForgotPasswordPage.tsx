import { Button, Grid, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { BACKEND_API_URL } from "../../constants";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

type ForgotPasswordForm = {
    email: string;
};

const ForgotPasswordPage = () => {
    const handleLoginSubmit = (params: ForgotPasswordForm) => {
        axios
            .post(`${BACKEND_API_URL}/password_resets`, params)
            .then(() => {
                toast.success('Reset link sent successfully!');
            })
            .catch((error) => {
                const errorMessage = (error.response && error.response.data && error.response.data.error) || error.message || 'An error occurred while sending the reset link!';
                toast.error(errorMessage);
            });
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .max(255, 'Email must be at most 255 characters long')
            .matches(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                'Invalid email address!'
            ),    
    });

    const formik = useFormik({
        initialValues: {
          email: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleLoginSubmit,
    });

    return (
        <>
          <ToastContainer />

          <h1>Forgot Password</h1>
    
          <Grid container justifyContent="center">
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "300px",
                width: "100%",
              }}
              onSubmit={formik.handleSubmit}
            >
    
              <TextField
                style={{ marginTop: 8 }}
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
    
              <Button
                style={{ marginTop: 8 }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Send reset
              </Button>
            </form>
          </Grid>
        </>
      );
};

export default ForgotPasswordPage;