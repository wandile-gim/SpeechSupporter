import styles from './Register.module.css';
import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/users/register/';

const Register = () => {
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [imgFile, setImageFile] = useState(
        'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936'
    );

    const handleJoininBtn = (event) => {
        event.preventDefault();
        sendLoginData();
    };

    const sendLoginData = async () => {
        const loginData = {
            id: idValue,
            password: passwordValue,
            email: emailValue,
            wannabe: companyValue,
            image: imgFile,
        };
        const joinState = await axios.post(BASE_URL, loginData).json();
        console.log(joinState);
    };

    const getImageFile = (event) => {
        const file = event.target.files;
        setImageFile(file[0].name);
    };

    const passwordValueChk = (event) => {
        const value = event.target.value;
        setPasswordValue(value);
    };

    const idValueChk = (event) => {
        const value = event.target.value;
        setIdValue(value);
    };

    const emailValueChk = (event) => {
        const value = event.target.value;
        setEmailValue(value);
    };

    const companyValueChk = (event) => {
        const value = event.target.value;
        setCompanyValue(value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.employee__card}>
                <div className={styles.neckless__container}>
                    <div className={styles.neckless_front}></div>
                    <div className={styles.neckless_back}></div>
                </div>
                <div className={styles.App__rotate}>
                    <div className={styles.top}></div>
                    <div className={styles.hole}></div>
                    <div className={styles.logo_container}>
                        <img className={styles.logo} src='aivle.png' />
                    </div>
                    <div className={styles.img__container}>
                        <img src={imgFile} />
                    </div>
                    <div className={styles.employee__card__text__container}>
                        <span>{idValue}</span>
                        <span>{emailValue}</span>
                        <span>{companyValue}</span>
                    </div>
                </div>
            </div>
            <div className={styles.input__container}>
                <h1>지 원 서</h1>
                <div className={styles.upload__img__container}>
                    <img src={imgFile} />
                    <input type='file' onChange={getImageFile} />
                </div>
                <div className={styles.form__container}>
                    <form method='post'>
                        <label htmlFor='id'>아이디</label>
                        <input placeholder='ID' type='text' id='id' required onChange={idValueChk} />
                        <label htmlFor='password'>비밀번호</label>
                        <input placeholder='Password' type='password' id='password' required onChange={passwordValueChk} />
                        <label htmlFor='email'>e-mail</label>
                        <input placeholder='e-mail' type='email' id='email' required onChange={emailValueChk} />
                        <label htmlFor='company'>희망하는 기업</label>
                        <input placeholder='Nickname으로 사용됩니다' type='text' id='company' required onChange={companyValueChk} />
                        <input type='submit' value='가입하기' onClick={handleJoininBtn} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
