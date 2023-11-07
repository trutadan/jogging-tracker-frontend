import { 
    Container, 
    CircularProgress, 
    TableContainer, 
    Paper, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { customAxios, formatWeekPeriod } from "../../../services/application.service";
import { useNavigate } from "react-router-dom";
import SpeedDistanceReport from "../../../models/SpeedDistanceReport";
import { toast } from "react-toastify";

const ReportsPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<SpeedDistanceReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await customAxios().get("/time_entries/weekly_reports", {params: {page: page}});
            setReports(response.data.weekly_averages);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        } catch (error: any) {
            if (error.response.status === 401) {
                setLoading(false);
                navigate("/unauthorized"); 
            } else {
                setLoading(false);
                toast.error("Error fetching reports:", error);
            }
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Container>
            <h1>Speed/Distance reports per week</h1>
            {loading && <CircularProgress />}
            {!loading && reports.length === 0 && <p>No reports found!</p>}
            {!loading && reports.length > 0 && (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                        <TableCell>Week</TableCell>
                        <TableCell>Average Speed</TableCell>
                        <TableCell>Average Distance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell>{formatWeekPeriod(report.week)}</TableCell>
                                <TableCell>{report.average_speed.toFixed(2)} km/h</TableCell>
                                <TableCell>{report.average_distance.toFixed(2)} km</TableCell>
                            </TableRow>))
                        }
                    </TableBody>
                </Table>
                
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    sx={{ display: 'flex', justifyContent: 'center' }}
                />
            </TableContainer>
            )}
        </Container>
    );
};

export default ReportsPage;
