import React, { useState, useEffect } from 'react'
import { fetchRandomApodData } from '../../nasaAPI/APODapi';
import { Link } from "react-router-dom";


const FetchApodRandom = () => {

  const getRandomCount = () => {
    return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  };

  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [randomCount, setRandomCount] = useState(getRandomCount());
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1200);
  const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 540);

  const handleFetchRandomData = async () => {
    setLoading(true);

    try {
      const response = await fetchRandomApodData(randomCount);
      setApodData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1200);
      setIsTinyScreen(window.innerWidth <= 540);
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
      <h1 className='text-white'>Fetch Random Apod Data</h1>
      <div className="text-center">
        <h2 className='text-white'>{randomCount}</h2>
        <div class="g-col-6" style={{ marginBottom: "10px" }}>
          <button onClick={() => { setRandomCount(getRandomCount()); }} className={`btn btn-blue ${isTinyScreen ? 'btn-sm' : ''}`}>Generate Random Number</button>
        </div>
        <div class="g-col-6" style={{ marginBottom: "10px" }}>
          <button onClick={handleFetchRandomData} disabled={loading} className={`btn btn-blue ${isTinyScreen ? 'btn-sm' : ''}`}>
            {loading ? 'Wait...' : 'Fetch Images'}
          </button>
        </div>
      </div>
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
                  <h3 className="card-title"><b>{item.title}</b></h3>
                  <p className="card-text">{item.explanation}</p>
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
                      <h3 className="card-title"><b>{item.title}</b></h3>
                      <p className="card-text">{item.explanation}</p>
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
                      <h3 className="card-title"><b>{item.title}</b></h3>
                      <p className="card-text">{item.explanation}</p>
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

export default FetchApodRandom