import React, { useState, useEffect } from 'react'
import { fetchApodDataRange } from '../../nasaAPI/APODapi';
import { Link } from "react-router-dom";


const FetchApodSpecificDateRange = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [apodData, setApodData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1200);
    const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 540);

    const handleFetchData = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start date and end date.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetchApodDataRange(startDate, endDate);
            setApodData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        setLoading(false);
    };

    useEffect(() => {
        const handleResize = () => {
          setIsSmallScreen(window.innerWidth <= 1200);
          setIsTinyScreen(window.innerWidth <= 375);
        };
    
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
        <div>
            <div class="grid text-center grid--3-cols">
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apod" role="button" className="nav-link" class="btn btn-danger">
                        Fetch APOD Data
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apodrandom" role="button" className="nav-link" class="btn btn-danger">
                        Random APOD Data
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/apodrange" role="button" className="nav-link" class="btn btn-danger">
                        Specific Date  APOD Data
                    </Link>
                </div>
            </div>
            <h1 className='text-white'>Date Range Selection</h1>
            <label className='text-white' style={{ marginRight: "12px" }}>
                Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} class="form-control" />
            </label>
            <label className='text-white' style={{ marginRight: "12px" }}>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} class="form-control" />
            </label>
            <button onClick={handleFetchData} disabled={loading} class="btn btn-blue">
                {loading ? 'Wait...' : 'Fetch Data'}
            </button>
            {apodData && (
                <>
                    {isTinyScreen ? (
                        <>
                            {apodData.map((item, index) => (
                                <div key={index} class="card" style={{ width: "auto", padding: "10px" }}>
                                    {item.media_type === 'image' ? (
                                        <img src={item.url} alt={item.title} class="card-img-top" />
                                    ) : (
                                        <iframe
                                            title={item.title}
                                            width="560"
                                            height="315"
                                            src={item.url}
                                            allowFullScreen
                                            class="card-img-top"
                                        ></iframe>
                                    )}
                                    <h3 class="card-title"><b>{item.title}</b></h3>
                                    <p class="card-text">{item.explanation}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {isSmallScreen ? (
                                <div className='grid grid--2-cols gap'>
                                    {apodData.map((item, index) => (
                                        <div key={index} class="card" style={{ width: "auto", padding: "10px" }}>
                                            {item.media_type === 'image' ? (
                                                <img src={item.url} alt={item.title} class="card-img-top" />
                                            ) : (
                                                <iframe
                                                    title={item.title}
                                                    width="560"
                                                    height="315"
                                                    src={item.url}
                                                    allowFullScreen
                                                    class="card-img-top"
                                                ></iframe>
                                            )}
                                            <h3 class="card-title"><b>{item.title}</b></h3>
                                            <p class="card-text">{item.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='grid grid--3-cols gap'>
                                    {apodData.map((item, index) => (
                                        <div key={index} class="card" style={{ width: "auto", padding: "10px" }}>
                                            {item.media_type === 'image' ? (
                                                <img src={item.url} alt={item.title} class="card-img-top" />
                                            ) : (
                                                <iframe
                                                    title={item.title}
                                                    width="560"
                                                    height="315"
                                                    src={item.url}
                                                    allowFullScreen
                                                    class="card-img-top"
                                                ></iframe>
                                            )}
                                            <h3 class="card-title"><b>{item.title}</b></h3>
                                            <p class="card-text">{item.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default FetchApodSpecificDateRange