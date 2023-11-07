import { Button, 
  Grid, 
  TextField, 
  Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { register } from "../../services/authentication.service";
import { useFormik } from 'formik';
import RegisterForm from "../../models/RegisterForm";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";

const RegistrationPage = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
      username: Yup.string()
          .required('Username is required')
          .max(25, 'Username must be at most 25 characters long'),
      email: Yup.string()
          .required('Email is required')
          .max(255, 'Email must be at most 255 characters long')
          .matches(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
              'Invalid email address!'
          ),
      password: Yup.string()
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters long')
          .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
              'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character'
          ),
      password_confirmation: Yup.string()
          .required('Password confirmation is required')
          .oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    const handleRegistrationSubmit = (registerForm: RegisterForm) => {
        register(registerForm)
          .then(() => {
            toast.success("Registration successful!");
            navigate("/login");
          })
          .catch((error) => {
            const errorMessage = (error.response && error.response.data && error.response.data.error) || error.message || 'An error occurred during registration!';
            toast.error(errorMessage);
          });
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleRegistrationSubmit,
    });

    return (
        <>
          <ToastContainer />

          <Typography variant="h3" style={{ margin: "24px 0" }}>
            Start jogging today!
          </Typography>

          <Grid container justifyContent="center">
            <form 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "500px",
                width: "100%",
                padding: "16px",
                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
              }}
              onSubmit={formik.handleSubmit}
            >
              <TextField
                style={{ marginTop: 8 }}
                label="Username"
                variant="outlined"
                fullWidth
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && <div style={{ color: 'red' }}>{formik.errors.username}</div>}
    
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
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}

              <TextField
                style={{ marginTop: 8 }}
                type="password"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                name="password_confirmation"
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password_confirmation && formik.errors.password_confirmation && <div style={{ color: 'red' }}>{formik.errors.password_confirmation}</div>}
    
              <Button
                style={{ marginTop: 16 }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </form>
          </Grid>
        </>
      );
};

export default RegistrationPage;
