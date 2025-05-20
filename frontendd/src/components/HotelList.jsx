import React, { useEffect, useState } from "react"

function HotelList() {
    const [hotels, setHotels]=useState([]);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:5000/hotels/')
        .then(response=>response.json())
        .then(data=>{
            setHotels(data);
            setLoading(false);
        })
        .catch(error=>{
            setError(error.message);
            setLoading(false);
        });
    },[]);
    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    return(
        <div>
            <h2>Lista Hoteli</h2>
            <ul>
                {hotels.map(hotel=>(
                    <li key={hotel.id}>
                        <h3>Nazwa hotelu: {hotel.name}</h3>
                        <p>Adres:{hotel.address || "Brak danych"}</p>
                        <p>Miasto: {hotel.city || "Brak danych"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
    
}

export default HotelList;