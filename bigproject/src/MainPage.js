import { useState, useRef } from 'react';
import './App.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = '';

const MainPage = () => {
    const nav = useNavigate();
    const dragDiv = useRef(null);
    const aivleDiv = useRef(null);
    const backDiv = useRef(null);
    const commDiv = useRef(null);
    const [infoText, setInfoText] = useState('Click The Card');
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const handleLoginBtn = (event) => {
        event.preventDefault();
        sendLoginData();
    };

    const sendLoginData = async () => {
        const loginData = {
            id: idValue,
            password: passwordValue,
        };
        const loginState = await axios.post(url, loginData).json();
        console.log(loginState);
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

    const [loginState, setLoginState] = useState(false);
    const [idInputState, setIdInputState] = useState(false);
    const [passwordInputState, setPasswordInputState] = useState(false);

    const passwordValueChk = (event) => {
        if (event.target.value !== '') {
            setPasswordInputState(true);
        } else {
            setPasswordInputState(false);
        }
        setPasswordValue(event.target.value);
    };
    const idValueChk = (event) => {
        if (event.target.value !== '') {
            setIdInputState(true);
        } else {
            setIdInputState(false);
        }
        setIdValue(event.target.value);
    };
    return (
        <>
            <button
                className='test'
                onClick={() => {
                    setLoginState((prev) => {
                        return !prev;
                    });
                }}>
                돌아버렷!
            </button>
            {loginState ? (
                <>
                    <div className='container'>
                        <div className='aivle__link' ref={aivleDiv}>
                            <h1>AIVLE로 출근하기</h1>
                            <img src='./card-key.png' />
                        </div>
                        <div className='comm__link' ref={commDiv}></div>
                        <div className='background__opacity' ref={backDiv}></div>
                        <motion.div
                            className='App__rotate'
                            drag='x'
                            dragConstraints={{ left: 0, right: 0 }}
                            style={{ x }}
                            ref={dragDiv}
                            onMouseUp={handleMouseUp}
                            onDrag={handleDrag}
                            onDragEnd={handleDragEnd}
                            onMouseDown={handleClick}>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <div className='logo_container'>
                                <img className='logo' src='aivle.png' />
                            </div>
                            <div className='img__container'>
                                <img src='' />
                            </div>
                        </motion.div>
                    </div>
                    <h1 className='info__text'>{infoText}</h1>
                </>
            ) : (
                <>
                    <div className='container'>
                        <div className='neckless__container'>
                            <div className='neckless_front'></div>
                            <div className='neckless_back'></div>
                        </div>
                        <div className='App'>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <div className='logo_container'>
                                <img className='logo' src='aivle.png' unselectable='on' />
                            </div>
                            <div id='login__form'>
                                <div className='id__container'>
                                    <input id='id' type='text' className='id_input' onChange={idValueChk} require autoComplete='off' />
                                    <label htmlFor='id' className={idInputState ? 'id_label__focused' : 'id_label'}>
                                        아이디를 입력해주세요.
                                    </label>
                                </div>
                                <div className='password__container'>
                                    <input
                                        type='password'
                                        id='password'
                                        className='password_input'
                                        onChange={passwordValueChk}
                                        required
                                        autoComplete='off'
                                    />
                                    <label htmlFor='password' className={passwordInputState ? 'password_label__focused' : 'password_label'}>
                                        패스워드를 입력해주세요.
                                    </label>
                                </div>
                                <input type='submit' value='로그인' onClick={handleLoginBtn} />
                            </div>
                            <div className='regist__container'>
                                <a href=''>
                                    <span className='span'>Join Us</span>
                                </a>
                            </div>
                            <div className='link__container'>
                                <img style={{ width: '30px' }} src='./google.png' />
                                <a href=''>
                                    <span className='span'>Login With Google</span>
                                </a>
                            </div>

                            <div className='hidden'>
                                <img src='' />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MainPage;
