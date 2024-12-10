import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoWarning } from "react-icons/io5";
import { useSupabase } from "../../contexts/SupabaseProvider";

import styles from "./ChangePassword.module.css";

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { auth } = useSupabase();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Nowe hasla sie nie zgadzaja.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("Nowe haslo musi miec co najmniej 6 znakow.");
            return;
        }

        setLoading(true);

        try {
            const { user, error } = await auth.updateUser({
                password: newPassword,
            });

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            navigate("/patient/my_data", { state: { message: "Haslo zostalo zmienione." } });
        } catch (error) {
            setErrorMessage("Wystapil blad podczas zmiany hasla.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            <h1>Zmiana hasla</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">Nowe haslo:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Potwierdz nowe haslo:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {errorMessage && (
                    <div className={styles.errorMessage}>
                        <IoWarning size={22} />
                        {errorMessage}
                    </div>
                )}

                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? "Zmiana..." : "Zmien haslo"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
