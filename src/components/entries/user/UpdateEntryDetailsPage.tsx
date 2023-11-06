import { useEffect } from 'react';
import { Button, Grid, IconButton, InputLabel, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { customAxios } from "../../../services/application.service";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import TimeEntry from "../../../models/TimeEntry";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditEntryDetailsPage = () => {
    const navigate = useNavigate();

    const { entryId } = useParams<{ entryId: string }>();

    const validationSchema = Yup.object().shape({
        date: Yup.string().required('Date is required'),
        distance: Yup.number()
            .required('Distance is required')
            .positive('Distance must be positive'),
        hours: Yup.number()
            .required('Hours are required')
            .min(0, 'Hours must be non-negative'),
        minutes: Yup.number()
            .required('Minutes are required')
            .min(0, 'Minutes must be non-negative')
            .max(59, 'Minutes cannot be more than 59'),
        seconds: Yup.number()
            .required('Seconds are required')
            .min(0, 'Seconds must be non-negative')
            .max(59, 'Seconds cannot be more than 59'),
    });

    useEffect(() => {
        customAxios()
            .get(`/time_entries/${entryId}`)
            .then((response) => {
                formik.setValues({
                    date: response.data.date,
                    distance: response.data.distance,
                    hours: response.data.hours,
                    minutes: response.data.minutes,
                    seconds: response.data.seconds,
                });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error("Error fetching TimeEntry: ", error);
                }
            });
    }, [entryId]);

    const handleSubmit = (timeEntry: TimeEntry) => {
        customAxios()
            .put(`/time_entries/${entryId}`, timeEntry)
            .then(() => {
                toast.success('TimeEntry updated successfully!');
                navigate('/entries');
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error('An error occurred while updating the Time Entry');
                }
            });
    };

    const formik = useFormik({
        initialValues: {
            date: '',
            distance: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleGoBack = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <div>
            <h1>
                <IconButton onClick={handleGoBack} style={{ marginRight: 8 }}>
                    <ArrowBackIcon />
                </IconButton>
                Edit time entry:
            </h1>
            <ToastContainer />
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
                    <InputLabel htmlFor="date">Date</InputLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        type="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date && <div style={{ color: 'red' }}>{formik.errors.date}</div>}

                    <TextField
                        style={{ marginTop: 8 }}
                        label="Distance (km)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="distance"
                        value={formik.values.distance}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.distance && formik.errors.distance && <div style={{ color: 'red' }}>{formik.errors.distance}</div>}

                    <TextField
                        style={{ marginTop: 8 }}
                        label="Hours"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="hours"
                        value={formik.values.hours}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.hours && formik.errors.hours && <div style={{ color: 'red' }}>{formik.errors.hours}</div>}

                    <TextField
                        style={{ marginTop: 8 }}
                        label="Minutes"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="minutes"
                        value={formik.values.minutes}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.minutes && formik.errors.minutes && <div style={{ color: 'red' }}>{formik.errors.minutes}</div>}

                    <TextField
                        style={{ marginTop: 8 }}
                        label="Seconds"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="seconds"
                        value={formik.values.seconds}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.seconds && formik.errors.seconds && <div style={{ color: 'red' }}>{formik.errors.seconds}</div>}

                    <Button
                        style={{ marginTop: 16 }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Update Entry
                    </Button>
                </form>
            </Grid>
        </div>
    );
};

export default EditEntryDetailsPage;
