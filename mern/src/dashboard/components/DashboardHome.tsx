import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DashboardHome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            const token = parsedUser?.token;

            if (!token) {
                Swal.fire("Access denied", "You must be logged in!", "error");
                navigate("/login");
            } else {
                console.log(token, "token");
            }
        } else {
            Swal.fire("Access denied", "You must be logged in!", "error");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <main>
            <section className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-md" />
                    <div className="bg-muted/50 aspect-video rounded-md" />
                    <div className="bg-muted/50 aspect-video rounded-md" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </section>
        </main>
    );
};

export default DashboardHome;
