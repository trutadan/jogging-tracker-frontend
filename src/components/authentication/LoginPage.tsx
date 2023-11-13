import { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { LockOpen, PersonAdd } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { login } from "../../services/authentication.service";
import { useFormik } from 'formik';
import LoginForm from "../../models/LoginForm";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = (loginForm: LoginForm) => {
        login(loginForm)
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            const errorMessage = (error.response && error.response.data && error.response.data.error) || error.message || 'An error occurred while logging in!';
            toast.error(errorMessage);
          });
    };

    const validationSchema = Yup.object().shape({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleLoginSubmit,
    });

    return (
        <>
          <ToastContainer />
    
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
    
              <TextField
                style={{ marginTop: 8 }}
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputProps={{
                  endAdornment: (
                    <Button onClick={handlePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                  ),
                }}
              />
              {formik.touched.password && formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
    
              <Button
                style={{ marginTop: 8 }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Log in
              </Button>
              
              <Typography variant="body1" style={{ marginTop: 8 }}>
                Forgot your password?
                <Link to="/forgot_password">
                  <Button style={{ marginLeft: 8 }} startIcon={<LockOpen />} color="secondary">
                    Reset
                  </Button>
                </Link>
              </Typography>

              <p style={{ marginBottom: 8 }}>Don't have an account?</p>
              <Link to="/register">
                <Button startIcon={<PersonAdd />} color="primary">
                  Register
                </Button>
              </Link>
            </form>
          </Grid>
        </>
      );
};

export default LoginPage;