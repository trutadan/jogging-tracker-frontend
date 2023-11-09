import { Autocomplete, Button, Grid, InputLabel, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from 'formik';
import { customAxios } from "../../../services/application.service";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import {debounce} from "lodash";
import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import SimpleUser from "../../../models/SimpleUser";
import TimeEntryWithUser from "../../../models/TimeEntryWithUser";

const AddEntryAdminPage = () => {
    const navigate = useNavigate();
    
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);

    const validationSchema = Yup.object().shape({
        date: Yup.string().required('Date is required'),
        distance: Yup.number()
            .required('Distance is required')
            .positive('Distance must positive'),
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
    
    const handleSubmit = (timeEntry: TimeEntryWithUser) => {
        if (selectedUser) {
            customAxios()
                .post('/time_entries', {time_entry: timeEntry})
                .then(() => {
                    toast.success('TimeEntry added successfully!');
                    navigate('/admin/entries');
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/unauthorized');
                    } else {
                        toast.error('An error occurred while adding the time entry!');
                    }
                });
        } else {
            toast.error('Please select a user before submitting.');
        }
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

    return (
        <div>
            <h1>Add a new entry:</h1>
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
                    />

                    <InputLabel htmlFor="date">
                        Date
                    </InputLabel>
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
                        ADD ENTRY
                    </Button>
                </form>
            </Grid>
        </div>
    );
};

export default AddEntryAdminPage;
