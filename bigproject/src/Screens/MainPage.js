import { useState, useRef, useEffect } from 'react';
import styles from './MainPage.module.css';
import { motion, useMotionValue } from 'framer-motion';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/users/user/';

const MainPage = () => {
    const dragDiv = useRef(null);
    const aivleDiv = useRef(null);
    const backDiv = useRef(null);
    const commDiv = useRef(null);
    const [infoText, setInfoText] = useState('Click The Card');
    const [idValue, setIdValue] = useState('');
    const [nickNameValue, setNickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');

    const cookies = new Cookies();

    const nav = useNavigate();
    const location = useLocation();

    const setCookie = (name, value) => {
        return cookies.set(name, value);
    };

    const getUserData = async () => {
        if (location.state) {
            const jwt = location.state.token;
            setCookie('jwt', jwt);
        } else {
            nav('/login');
        }

        const data = await axios.get(BASE_URL, {
            withCredentials: true,
        });

        setIdValue(data.data.user.email);
        setNickNameValue(data.data.user['nick_name']);
        setCompanyValue(data.data.user.wannabe);
    };

    const handleMouseUp = () => {
        aivleDiv.current.style.opacity = 0;
        commDiv.current.style.opacity = 0;
        backDiv.current.style.opacity = 0;
        setInfoText('Click The Card');
    };

    const handleClick = () => {
        aivleDiv.current.style.opacity = 0.5;
        commDiv.current.style.opacity = 0.5;
        backDiv.current.style.opacity = 0.5;
        setInfoText('<= Drag The Card =>');
    };

    const handleDragEnd = (e) => {
        const x = dragDiv.current.getBoundingClientRect().x;
        aivleDiv.current.style.opacity = 0;
        commDiv.current.style.opacity = 0;
        backDiv.current.style.opacity = 0;
        if (x <= window.screen.width * 0.3) {
            nav('/video');
        } else if (x >= window.screen.width * 0.3 + 200) {
            nav('/register');
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
            <div className={styles.container}>
                <div className={styles.aivle__link} ref={aivleDiv}>
                    <h1>AIVLE로 출근하기</h1>
                    <img src='./card-key.png' />
                </div>
                <div className={styles.comm__link} ref={commDiv}></div>
                <div className={styles.background__opacity} ref={backDiv}></div>
                <motion.div
                    className={styles.App__rotate}
                    drag='x'
                    dragConstraints={{ left: 0, right: 0 }}
                    style={{ x }}
                    ref={dragDiv}
                    onMouseUp={handleMouseUp}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    onMouseDown={handleClick}>
                    <div className={styles.top}></div>
                    <div className={styles.hole}></div>
                    <div className={styles.logo_container}>
                        <img className={styles.logo} src='aivle.png' />
                    </div>
                    <div className={styles.img__container}>
                        <img src='https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936' />
                    </div>
                    <div className={styles.employee__card__text__container}>
                        <span>이메일 : {idValue}</span>
                        <span>닉네임 : {nickNameValue}</span>
                        <span>{companyValue}</span>
                    </div>
                </motion.div>
            </div>
            <h1 className={styles.info__text}>{infoText}</h1>
        </>
    );
};

export default MainPage;
