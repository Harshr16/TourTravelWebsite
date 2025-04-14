import { useEffect, useState } from "react";
import { account, databases } from "../appwrite/appwrite"; // Import Appwrite services
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import conf from "../configure/Config";
import { Query } from "appwrite";

const ClientDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const currentUser = await account.get();
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);
            fetchBookings(currentUser.$id);  // Fetch bookings for the specific client
        } catch (error) {
            console.error("Session Error:", error);
            navigate("/login");
        }
    };

    const fetchBookings = async (clientId) => {
        try {
            const response = await databases.listDocuments(conf .appwriteDatabaseID, conf.appwriteCollectionID, [
                Query.equal("client_id",    ) // Filter by client_id
            ]);
            setBookings(response.documents);
            console.log(bookings)
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Client Dashboard</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Booking ID</th>
                                <th className="border p-2">User Name</th>
                                <th className="border p-2">Hotel Name</th>
                                <th className="border p-2">Check-in</th>
                                <th className="border p-2">Check-out</th>
                                <th className="border p-2">Guests</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.$id} className="hover:bg-gray-50">
                                    <td className="border p-2">{booking.$id}</td>
                                    <td className="border p-2">{booking.userName}</td>
                                    <td className="border p-2">{booking.hotelName}</td>
                                    <td className="border p-2">{booking.checkInDate}</td>
                                    <td className="border p-2">{booking.checkOutDate}</td>
                                    <td className="border p-2">{booking.numGuests}</td>
                                    <td className="border p-2">
                                        <span className={`px-3 py-1 rounded-full ${booking.status === "Accepted" ? "bg-green-300" : booking.status === "Rejected" ? "bg-red-300" : "bg-yellow-300"}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        {booking.status === "Pending" && (
                                            <>
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mx-1"
                                                    onClick={() => handleUpdateStatus(booking.$id, "Accepted")}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    onClick={() => handleUpdateStatus(booking.$id, "Rejected")}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ClientDashboard;