import { useState } from 'react';
import './LoginPage.module.css';
import axios from 'axios';

const url = '';

const LoginPage = () => {
    const [loginState, setLoginState] = useState(false);
    const [idInputState, setIdInputState] = useState(false);
    const [passwordInputState, setPasswordInputState] = useState(false);
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
                        <a href='/register'>
                            <span className='span'>입사하기</span>
                        </a>
                    </div>
                    <div className='link__container'>
                        <img style={{ width: '30px' }} src='./google.png' />
                        <a href=''>
                            <span className='span'>뇌절 하셨나요?</span>
                        </a>
                    </div>

                    <div className='hidden'>
                        <img src='' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
