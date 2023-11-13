import { Button, 
    Grid, 
    TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { BACKEND_API_URL } from "../../constants";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "../../models/ResetPassword";
import axios from "axios";
  
  const ResetPasswordPage = () => {
      const navigate = useNavigate();

      const params = useParams();
  
      const validationSchema = Yup.object().shape({
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
  
      const handleRegistrationSubmit = (resetForm: ResetPassword) => {
          axios
            .put(`${BACKEND_API_URL}/password_resets/${params.token}`, {credentials: { password: resetForm.password, password_confirmation: resetForm.password_confirmation }, email: resetForm.email})
            .then(() => {
                navigate("/login");
                toast.success("Account's password successfully reset!");
            })
            .catch((error) => {
                const errorMessage = (error.response && error.response.data && error.response.data.error) || error.message || 'An error occurred during password reset!';
                toast.error(errorMessage);
            });
      };
  
      const formik = useFormik({
          initialValues: {
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

            <Grid container justifyContent="center">
              <h1>Reset Password</h1>
            </Grid>
  
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
                  Reset
                </Button>
              </form>
            </Grid>
          </>
        );
  };
  
  export default ResetPasswordPage;
  