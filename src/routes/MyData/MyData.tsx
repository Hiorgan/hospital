import { useEffect, useState } from "react";
import styles from "./MyData.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { useNavigate } from "react-router-dom";

interface PatientData {
    first_name: string;
    last_name: string;
    pesel: string;
    birth_date: string;
    telephone: string;
    email: string;
}

const MyData: React.FC = () => {
    const supabase = useSupabase();
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

        const handleChangePasswordClick = () => {
        navigate("/change_password");
    };

    useEffect(() => {
const fetchPatientData = async () => {
    try {
        const { data: session } = await supabase.auth.getSession();
        console.log("Session data:", session);

        if (!session.session) {
            setError("Nie znaleziono aktywnej sesji u¿ytkownika.");
            setLoading(false);
            return;
        }

        const userEmail = session.session.user.email;
        console.log("User email:", userEmail);

        const { data, error } = await supabase
            .from("patient")
            .select("*")
            .eq("email", userEmail)
            .maybeSingle();

        if (error) {
            console.error("Database error:", error);
            setError("Nie uda³o siê pobraæ danych pacjenta.");
        } else if (!data) {
            console.error("No data found for email:", userEmail);
            setError("Nie znaleziono danych pacjenta.");
        } else {
            console.log("Patient data:", data);
            setPatientData(data as PatientData);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        setError("Wyst¹pi³ b³¹d podczas ³adowania danych.");
    } finally {
        setLoading(false);
    }
};

        fetchPatientData();
    }, [supabase]);

    if (loading) {
        return <div className={styles.root}>£adowanie danych...</div>;
    }

    if (error) {
        return <div className={styles.root}>{error}</div>;
    }

    return (
        <div className={styles.root}>
            <h1>Moje dane</h1>
            {patientData ? (
                <div className={styles.dataContainer}>
                    <p><strong>Imie:</strong> {patientData.first_name}</p>
                    <p><strong>Nazwisko:</strong> {patientData.last_name}</p>
                    <p><strong>PESEL:</strong> {patientData.pesel}</p>
                    <p><strong>Data urodzenia:</strong> {patientData.birth_date}</p>
                    <p><strong>Numer telefonu:</strong> {patientData.telephone}</p>
                    <p><strong>Email:</strong> {patientData.email}</p>

            <button className={styles.btn} onClick={handleChangePasswordClick}>
                Zmien haslo
            </button>
                </div>
            ) : (
                <p>Nie znaleziono danych pacjenta.</p>
            )}
        </div>
    );
};

export default MyData;