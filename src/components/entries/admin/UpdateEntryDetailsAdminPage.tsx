import { useCallback, useEffect, useState } from 'react';
import { Autocomplete, Button, Grid, IconButton, InputLabel, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { customAxios } from "../../../services/application.service";
import { useNavigate, useParams } from "react-router-dom";
import {debounce} from "lodash";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import TimeEntry from "../../../models/TimeEntry";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SimpleUser from '../../../models/SimpleUser';

const EditEntryDetailsAdminPage = () => {
    const navigate = useNavigate();

    const { entryId } = useParams();
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);

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

    const handleSubmit = (timeEntry: TimeEntry) => {
        customAxios()
            .put(`/time_entries/${entryId}`, {time_entry: timeEntry})
            .then(() => {
                toast.success('TimeEntry updated successfully!');
                navigate('/entries');
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error('An error occurred while updating the time entry!');
                }
            });
    };

    const formik = useFormik({
        initialValues: {
            user_id: 0,
            date: '',
            distance: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const fetchEntry = () => {
        customAxios()
            .get(`/time_entries/${entryId}`)
            .then((response) => {
                const data = response.data.time_entry ? response.data.time_entry : response.data;
                formik.setValues({
                    user_id: data.user_id,
                    date: data.date,
                    distance: data.distance,
                    hours: data.hours,
                    minutes: data.minutes,
                    seconds: data.seconds,
                });
                setSelectedUser({ id: data.user_id, username: response.data.username });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/unauthorized');
                } else {
                    toast.error("Error fetching time entry: ", error);
                }
            });
    };

    useEffect(() => {
        fetchEntry();
    }, []);

    const fetchUsers = async (query: string) => {
        const params = {
            query: query
        }

        customAxios()
            .get("/users/autocomplete", { params })
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate("/unauthorized");
                } else {
                    toast.error("An error occurred while fetching users!");
                }
            });
    };

    const handleUserSelection = (value: SimpleUser | null) => {
        setSelectedUser(value);
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchUsers, 500), []);

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    const handleInputChange = (value: string) => {
        debouncedFetchSuggestions(value);
    };
    
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
                    <Autocomplete
                        options={users}
                        getOptionLabel={(user) => user.username}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        style={{ width: '100%', marginBottom: 8 }}
                        renderInput={(params) => <TextField {...params} label="Select user" variant="outlined" />}
                        filterOptions={(x) => x}
                        onInputChange={(_event, value) => handleInputChange(value)}
                        onChange={(_event, value) => handleUserSelection(value)}
                        value={selectedUser}
                    />

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
                        UPDATE ENTRY
                    </Button>
                </form>
            </Grid>
        </div>
    );
};

export default EditEntryDetailsAdminPage;
