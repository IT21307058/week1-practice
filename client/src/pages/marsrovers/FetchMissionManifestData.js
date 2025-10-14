import React, { useState, useEffect } from 'react';
import { fetchMissionManifest } from '../../nasaAPI/MARSRoverapi';
import { Link } from "react-router-dom";

const FetchMissionManifestData = () => {
    const [rover, setRover] = useState('');
    const [sol, setSol] = useState('');
    const [manifestData, setManifestData] = useState(null);
    const [error, setError] = useState('');
    const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 540);

    const fetchManifest = async () => {
        try {
            const data = await fetchMissionManifest(rover);
            setManifestData(data.photo_manifest);
        } catch (error) {
            console.error('Error fetching manifest:', error);
            setError('Failed to fetch manifest. Please make sure the rover name is correct and try again.');
        }
    };

    const handleChange = (event) => {
        setRover(event.target.value);
    };

    const handleSolChange = (event) => {
        setSol(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchManifest();
    };

    useEffect(() => {
        const handleResize = () => {
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
                    <Link to="/marssol" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Fetch Mars Sol
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/marsearthdate" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Images Mars by Earth Date
                    </Link>
                </div>
                <div class="g-col-6 g-col-md-4">
                    <Link to="/marsmanifestdata" role="button" className={`btn btn-danger ${isTinyScreen ? 'btn-sm' : ''}`}>
                        Fetch Mars Manifest Data
                    </Link>
                </div>
            </div>
            <h1 className='text-white'>Mars Rover Manifest</h1>
            <form onSubmit={handleSubmit}>
                <label className='text-white text-label' style={{marginRight:"24px"}}>
                    Select a rover:
                    <select value={rover} onChange={handleChange} class="form-select">
                        <option value="">Select Rover</option>
                        <option value="curiosity">Curiosity</option>
                        <option value="opportunity">Opportunity</option>
                        <option value="spirit">Spirit</option>
                    </select>
                </label>
                <label className='text-white text-label' style={{marginRight:"24px"}}>
                    Enter a sol number:
                    <input type="text" value={sol} onChange={handleSolChange} class="form-control" />
                </label>
                <button type="submit" disabled={!rover} class="btn btn-blue">Fetch Manifest</button>
            </form>
            {error && <p>{error}</p>}
            {manifestData && (
                <div class="card text-center container card-style">
                    <div class="card-body">
                        <h2 class="card-title">Name of the Rover <span>{manifestData.name}</span></h2>
                        <p class="card-text"><b>The Rover's landing date on Mars : </b> <span style={{color:"#03045E"}}>{manifestData.landing_date}</span></p>
                        <p class="card-text"><b>The Rover's launch date from Earth : </b> <span style={{color:"#03045E"}}>{manifestData.launch_date}</span></p>
                        <p class="card-text"><b>The Rover's mission status : </b><span style={{color:"#03045E"}}>{manifestData.status}</span> </p>
                        <p class="card-text"><b>The most recent Martian sol from which photos exist : </b><span style={{color:"#03045E"}}>{manifestData.max_sol}</span></p>
                        <p class="card-text"><b>The most recent Earth date from which photos exist : </b><span style={{color:"#03045E"}}>{manifestData.max_date}</span> </p>
                        <p class="card-text"><b>Number of photos taken by that Rover : </b><span style={{color:"#03045E"}}>{manifestData.total_photos}</span></p>
                        {manifestData.photos && manifestData.photos.length > 0 ? (
                            <div>
                                <h3 class="card-text">Photos by Sol:</h3>
                                <ul>
                                    {sol ? (
                                        manifestData.photos.filter((photo) => photo.sol === parseInt(sol, 10)).map((photo) => (
                                            <li key={photo.sol} class="card-text">
                                                Sol {photo.sol}: {photo.total_photos} photos - Cameras: {photo.cameras.join(', ')}
                                            </li>
                                        ))
                                    ) : (
                                        manifestData.photos.map((photo) => (
                                            <li key={photo.sol} class="card-text">
                                                Sol {photo.sol}: {photo.total_photos} photos - Cameras: {photo.cameras.join(', ')}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <p>No photos available for the selected rover.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FetchMissionManifestData