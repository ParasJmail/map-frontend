import * as React from 'react';
import Map, {Marker,Popup} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Room,Star} from "@material-ui/icons";
import "./App.css";
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {format} from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import { serverURL } from './helper';

function App() {

  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [rating,setRating] = useState(0);
  const [viewport,setViewport] = useState({
    longitude: 75.774838,
    latitude: 21.037977,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/pins`)
        setPins(res.data)
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  },[]);

  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})

  }

  const handleAddClick = (e) => {
    // console.log(e.lngLat["lng"]);
    // const [lng,lat] = e.lngLat;
    const long = e.lngLat["lng"];
    const lat = e.lngLat["lat"];
    setNewPlace({
      lat:lat,
      long:long,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      user:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    }

    try { 
      const res = await axios.post(`${serverURL}/api/pins`,newPin);
      setPins([...pins,res.data]);
      setNewPlace(null)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }


  return (
    <div className="App">
      
      <Map className="wholeMap" mapLib={maplibregl} 
         {...viewport}
         onMove={evt => setViewport(evt.viewport)}
        style={{width: "100%", height: " calc(100vh)"}}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=soMTo8Nlp08mNCIvEDf3"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        
        {pins.map(p=>(

          <>
            <Marker longitude={p.long}
                latitude={p.lat}
                offsetLeft={-maplibregl.zoom*3.5}
                offsetTop={-maplibregl.zoom*7}
        >

          <Room style={{fontSize:maplibregl.zoom*7,color: p.username === currentUser ? "tomato" : "slateblue" ,cursor:"pointer"}}
                onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
          />
        </Marker>
        {p._id === currentPlaceId && (
          <Popup longitude={p.long} latitude={p.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setCurrentPlaceId(null)}
          >
            <div className='card'>
              <label>Place</label>
              <h1 className='place'>{p.title}</h1>
              <label>Review</label>
              <p className='desc'>{p.description}</p>
              <label>Rating</label>
              <div className='stars'>
                {Array(p.rating).fill(<Star className='star'/>)}
                
              </div>
              <label>Information</label>
              <span className='username'>Created by <b>{p.username}</b></span>
              <span className='date'>{format(p.createdAt)}</span>
            </div>
          </Popup>
        )}
          </>
        ))}

        {newPlace && (
          <>
            <Popup longitude={newPlace.long} latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input 
                placeholder='Enter a title'
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea 
                placeholder='please tell something about this place'
                onChange={(e) => setDesc(e.target.value)} 
              />
              
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className='submitButton' type='submit'>Add Pin</button>
              

              </form>
            </div>
          </Popup>
          </>
        )}
          {currentUser ? (
            <button className='button logout' onClick={handleLogout} position="top-right" >logout</button>
          ):(
            <div className='buttons'>
              <button className='button login' onClick={() => setShowLogin(true)} position="top-left" >login</button>
              <button className='button register' onClick={() => setShowRegister(true)} position="top-left">register</button>
            </div>
          )}
        {
          showRegister && (
            <Register setShowRegister = {setShowRegister} /> 
          )}
        {
          showLogin && (
            <Login 
              setShowLogin = {setShowLogin}
              myStorage={myStorage} 
              setCurrentUser = {setCurrentUser}
            /> 
          )}
         
        
        
      
      </Map>
      
    </div>
  );
}

export default App;
