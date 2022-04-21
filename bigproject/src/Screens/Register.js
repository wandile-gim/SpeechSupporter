import styles from './Register.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000/api/users/register/';

const Register = () => {
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [password2Value, setPassword2Value] = useState('');
    const [chkPassword, setChkPassword] = useState(false);
    const [nickNameValue, setnickNameValue] = useState('');
    const [companyValue, setCompanyValue] = useState('');
    const [imgFile, setImageFile] = useState(
        'https://images-ext-2.discordapp.net/external/RwTCihXk-8XznIG1dqikm3s5sffzfnXvWAKVvWhZsH4/https/cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png?width=936&height=936'
    );

    const formData = new FormData();
    const navigation = useNavigate();

    const handleJoininBtn = (event) => {
        event.preventDefault();
        sendLoginData(passwordValue, password2Value);
    };

    const sendLoginData = async (password, password2) => {
        /*
        formData.append('nick_name', nickNameValue);
        formData.append('password', passwordValue);
        formData.append('email', idValue);
        formData.append('wannabe', companyValue);
        */

        if (password !== password2) {
            return alert('비밀번호를 확인해주세요!');
        }

        const loginData = {
            nick_name: nickNameValue,
            password: passwordValue,
            email: idValue,
            wannabe: companyValue,
            profile_img: imgFile,
        };
        const joinState = await axios.post(BASE_URL, loginData);
        if (joinState.data.state) {
            navigation('/login');
        }
    };

    const getImageFile = (event) => {
        const file = event.target.files;
        setImageFile(file[0].name);
        formData.append('profile_img', imgFile);
    };

    const passwordValueChk = (event) => {
        const value = event.target.value;
        setPasswordValue(value);
    };

    const password2ValueChk = (event) => {
        const value = event.target.value;
        setPassword2Value(value);
    };

    const idValueChk = (event) => {
        const value = event.target.value;
        setIdValue(value);
    };

    const nickNameValueChk = (event) => {
        const value = event.target.value;
        setnickNameValue(value);
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
                        <span>이메일 : {idValue}</span>
                        <span>닉네임 : {nickNameValue}</span>
                        <span>{companyValue}</span>
                    </div>
                </div>
            </div>
            <div className={styles.input__container}>
                <h1>지 원 서</h1>
                <div className={styles.upload__img__container}>
                    <img src={imgFile} />
                    <input type='file' accept='image/*' onChange={getImageFile} />
                </div>
                <div className={styles.form__container}>
                    <form method='post'>
                        <label htmlFor='id'>아이디</label>
                        <input placeholder='ID' type='email' id='id' required onChange={idValueChk} />
                        <label htmlFor='password'>비밀번호</label>
                        <input placeholder='Password' type='password' id='password' required onChange={passwordValueChk} />
                        <label htmlFor='password2'>비밀번호 확인</label>
                        <input placeholder='Password Confirm' type='password' id='password2' required onChange={password2ValueChk} />
                        <label htmlFor='nickname'>Nickname</label>
                        <input placeholder='Nickname' type='text' id='nickname' required onChange={nickNameValueChk} />
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
