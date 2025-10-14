import React, { useEffect, useState } from 'react'
import { fetchApodData } from '../../nasaAPI/APODapi';
import { Link } from "react-router-dom";

const FetchApodDataPage = () => {


    const [apodData, setApodData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 540);


    useEffect(() => {
        fetchDataForSelectedDate(selectedDate);

        const handleResize = () => {
            setIsTinyScreen(window.innerWidth <= 540);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedDate]);

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        if (month < 10) month = `0${month}`;
        if (day < 10) day = `0${day}`;
        return `${year}-${month}-${day}`;
    }

    const fetchDataForSelectedDate = async (date) => {
        try {
            const data = await fetchApodData(date);
            setApodData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setApodData(null);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const renderMedia = () => {

        if (!apodData) return <p>No data available for the selected date.</p>;

        return (
            <>
                <div class="card mb-3" style={{ maxWidth: "1400px" }}>
                    <div class="row g-0">
                        <div class="col-md-4">
                            {apodData.media_type === 'video' ? (
                                <iframe
                                    title={apodData.title}
                                    width="560"
                                    height="315"
                                    src={apodData.url}
                                    allowFullScreen
                                />
                            ) : (
                                <img src={apodData.url} alt={apodData.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            )}
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h2 class="card-title">{apodData.title}</h2>
                                <p class="card-text">{apodData.explanation}</p>
                                <p class="card-text">Date: {apodData.date}</p>
                                <p class="card-text">Media Type: {apodData.media_type}</p>
                                {apodData.hdurl && <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer">View HD Image</a>}
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    };

    return (
        <div >
            <div class="grid text-center grid--3-cols">
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apod" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Fetch APOD Data
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apodrandom" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Random APOD Data
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apodrange" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Specific Date  APOD Data
                    </Link>
                </div>
            </div>
            <h1 className='text-white'>Astronomy Picture of the Day</h1>
            <label htmlFor="datePicker" className='text-white'>Select Date:
                <input
                    id="datePicker"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={getTodayDate()}
                    class='form-control'
                    style={{ marginBottom: "20px" }}
                />
            </label>
            {renderMedia()}
        </div>

    );
}

export default FetchApodDataPage