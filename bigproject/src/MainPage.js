import { useState } from 'react';
import './App.css';

const MainPage = () => {
    const [loginState, setLoginState] = useState(false);

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
                    <img className='logo' src='aivle.png' />
                    <div className='container'>
                        <div className='neckless__container'>
                            <div className='neckless_front__rotate'></div>
                            <div className='neckless_back'></div>
                        </div>
                        <div className='App__rotate'>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <div className='img__container'>
                                <img src='' />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img className='logo' src='aivle.png' />
                    <div className='container'>
                        <div className='neckless__container'>
                            <div className='neckless_front__rotate'></div>
                            <div className='neckless_back'></div>
                        </div>
                        <div className='App'>
                            <div className='top'></div>
                            <div className='hole'></div>
                            <form id='login__form'>
                                <input type='text' placeholder='Please Fill Your Id' />
                                <input type='password' placeholder='Please Fill Your Password' />
                                <input type='submit' value='Login' />
                            </form>
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
