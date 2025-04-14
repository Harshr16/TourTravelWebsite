import { useState, useEffect } from "react";
import { account, databases } from "./appwrite/appwrite"; // Import Appwrite setup
import conf from "../configure/Config";

const BookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setCurrentUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchBookings = async () => {
            try {
                const response = await databases.listDocuments(conf.appwriteDatabaseID, conf.appwriteCollectionID);
                setBookings(response.documents);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            await fetch("http://localhost:8000/update-booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status }),
            });

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.$id === bookingId ? { ...booking, status } : booking
                )
            );
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    if (loading) return <p>Loading bookings...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.$id} className="border p-4 rounded-lg shadow">
                            <p><strong>Hotel:</strong> {booking.hotelName}</p>
                            <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                            <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                            <p><strong>Guests:</strong> {booking.numGuests}</p>
                            <p><strong>Status:</strong> 
                                <span className={`px-2 py-1 rounded ${booking.status === "Accepted" ? "bg-green-300" : booking.status === "Rejected" ? "bg-red-300" : "bg-yellow-300"}`}>
                                    {booking.status}
                                </span>
                            </p>
                            
                            {booking.status === "Pending" && (
                                <div className="mt-2 space-x-2">
                                    <button
                                        onClick={() => handleUpdateStatus(booking.$id, "Accepted")}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(booking.$id, "Rejected")}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingsList;
