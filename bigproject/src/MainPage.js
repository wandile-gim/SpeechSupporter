import { useState, useRef, useEffect } from "react";
import "./App.css";
import { motion, useMotionValue } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/users/user/";

const MainPage = () => {
  const nav = useNavigate();
  const dragDiv = useRef(null);
  const aivleDiv = useRef(null);
  const backDiv = useRef(null);
  const commDiv = useRef(null);
  const [infoText, setInfoText] = useState("Click The Card");
  const [userData, setUserData] = useState([]);

  const token = useLocation().state;
  const getUserData = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token.token,
      },
    };
    console.log(headers);
    const data = await axios.get(BASE_URL, headers);
    console.log(data);
  };

  const handleMouseUp = () => {
    aivleDiv.current.style.opacity = 0;
    commDiv.current.style.opacity = 0;
    backDiv.current.style.opacity = 0;
    setInfoText("Click The Card");
  };

  const handleClick = () => {
    aivleDiv.current.style.opacity = 0.5;
    commDiv.current.style.opacity = 0.5;
    backDiv.current.style.opacity = 0.5;
    setInfoText("<= Drag The Card =>");
  };

  const handleDragEnd = (e) => {
    const x = dragDiv.current.getBoundingClientRect().x;
    aivleDiv.current.style.opacity = 0;
    commDiv.current.style.opacity = 0;
    backDiv.current.style.opacity = 0;
    if (x <= window.screen.width * 0.3) {
      nav("/video");
    } else if (x >= window.screen.width * 0.3 + 200) {
      nav("/register");
    }
  };

  const handleDrag = () => {
    const x = dragDiv.current.getBoundingClientRect().x;
    if (x <= window.screen.width * 0.3) {
      aivleDiv.current.style.opacity = 0.9;
    } else if (x >= window.screen.width * 0.3 + 200) {
      commDiv.current.style.opacity = 0.9;
    } else {
      aivleDiv.current.style.opacity = 0.5;
      commDiv.current.style.opacity = 0.5;
    }
  };
  const x = useMotionValue(0);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="aivle__link" ref={aivleDiv}>
          <h1>AIVLE로 출근하기</h1>
          <img src="./card-key.png" />
        </div>
        <div className="comm__link" ref={commDiv}></div>
        <div className="background__opacity" ref={backDiv}></div>
        <motion.div
          className="App__rotate"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x }}
          ref={dragDiv}
          onMouseUp={handleMouseUp}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseDown={handleClick}
        >
          <div className="top"></div>
          <div className="hole"></div>
          <div className="logo_container">
            <img className="logo" src="aivle.png" />
          </div>
          <div className="img__container">
            <img src="" />
          </div>
        </motion.div>
      </div>
      <h1 className="info__text">{infoText}</h1>
    </>
  );
};

export default MainPage;
