import React, { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import './style.css';

const DelAccountPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null); // state to hold selected space_id

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userID = user.userid;

        const requestOptions = {
          method: "POST",
          body: JSON.stringify({ userid: userID }),
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await fetch("http://localhost:3001/api/check-spaces-from-user", requestOptions);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const spacesData = await response.json();
        setSpaces(spacesData);
      } catch (error) {
        setError(error.message);
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    fetchSpaces();
  }, []);

  const fetchArts = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userID = user.userid;

      const requestOptions = {
        method: "POST",
        body: JSON.stringify({ userid: userID }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:3001/api/check-arts-from-user", requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const artsData = await response.json();
      setArtworks(artsData);
      console.log(artsData)
    } catch (error) {
      setError(error.message);
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  fetchArts();

  const handleButtonClick = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // close the modal
  };

  const handleDelete = async () => {
    if (!selectedSpaceId) return;
  
    try {
      const response = await fetch('http://localhost:3001/api/delete-spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedSpaceId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting space:', errorData);
        alert('Error deleting space: ' + (errorData.message || 'Unknown error'));
        return;
      }
  
      const data = await response.json();
      console.log('Delete success:', data);
      
      setSpaces(spaces.filter(space => space.space_id !== selectedSpaceId)); // Update the UI
      handleCloseModal();
    } catch (error) {
      console.error('Fetch operation failed:', error);
      alert('There was a problem with the fetch operation. Please try again later.');
    }
  };
 
  return (
    <div>
      <SearchBox />
      <div className="container-fluid tm-container-content tm-mt-60">
        <div className="row mb-4">
          <h2 className="col-6 tm-text-primary">Your Spaces</h2>
          <div className="col-6 d-flex justify-content-end align-items-center">
            <a href="yourAccount" className="btn btn-primary">Return</a>
          </div>
        </div>
        <div className="row tm-mb-90 tm-gallery">
          {spaces.map((space, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5" style={{ position: 'relative' }}>
                <img
                    src={"data:image/jpeg;base64," + space.value}
                    alt="Default Image"
                    className="img-fluid"
                />
              <button
                className="btn btn-primary"
                onClick={() => handleButtonClick(space.space_id)} // Pass space_id to the modal
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  top: '10px',
                  right: '20px',
                  borderRadius: '50%',
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <i className="fas fa-minus" style={{ color: '#fff', fontSize: '30px' }}></i>
              </button>
              <div className="d-flex justify-content-between tm-text-gray">
                <span className="tm-text-gray-light">{new Date(space.created_at).toLocaleDateString()}</span>
                <span style={{ fontWeight: 'bold' }}>{space.title}</span>
              </div>
              <div className="d-flex justify-content-between tm-text-gray">
                <span>Status: {space.status}</span>
                <span>Tags: {space.tag || 'None'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="container-fluid tm-container-content tm-mt-60">
        <div className="row mb-4">
            <h2 className="col-6 tm-text-primary">
              Your Artworks
            </h2>
            <div className="col-6 d-flex justify-content-end align-items-center">
              <a href="delArts" className="btn btn-primary">Delete</a>
            </div>
        </div>
        <div className="row tm-mb-90 tm-gallery">
          {artworks.length > 0 ? artworks.map((art) => (
            <div key={art.art_id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                <figure className="effect-ming tm-video-item">
                    <div className="zoom-container">  
                        <img
                            src={"data:image/jpeg;base64," + art.art}
                            alt="Default Image"
                            className="img-fluid"
                        />
                    </div>
                    <figcaption className="d-flex align-items-center justify-content-center">
                        <h2>{art.title}</h2>
                        <a href="map"></a>
                    </figcaption>
                </figure>
                <div className="d-flex justify-content-between tm-text-gray">
                    <span className="tm-text-gray-light">{new Date(art.created_at).toLocaleDateString()}</span>
                    <span style={{ fontWeight: 'bold' }}>{art.title}</span>
                </div>
            </div>
          )) : (
            <p>No Artworks found.</p>
          )}
        </div>
      </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Are you sure you want to delete this space?</h2>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DelAccountPage;
