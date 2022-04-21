import styles from './Resetpassword.module.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/users/set_password/';

const ResetPassword = () => {
    const [passwordInputState, setPasswordInputState] = useState(false);
    const [password2InputState, setPassword2InputState] = useState(false);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const email = useLocation().state.email;
    const navigation = useNavigate();

    const passwordValueChk = (event) => {
        if (event.target.value !== '') {
            setPasswordInputState(true);
        } else {
            setPasswordInputState(false);
        }
        setPassword(event.target.value);
    };

    const password2ValueChk = (event) => {
        if (event.target.value !== '') {
            setPassword2InputState(true);
        } else {
            setPassword2InputState(false);
        }
        setPassword2(event.target.value);
    };

    const handleSendBtn = async () => {
        if (password !== password2) {
            return alert('비밀번호를 확인하세요!');
        }

        const value = {
            email,
            password,
        };

        const data = await axios.put(BASE_URL, value);
        if (data.data.success) {
            navigation('/login');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.neckless__container}>
                <div className={styles.neckless_front}></div>
                <div className={styles.neckless_back}></div>
            </div>
            <div className={styles.main__design__container}>
                <div className={styles.hole}></div>
                <div className={styles.top}></div>
                <div className={styles.logo_container}>
                    <img className={styles.logo} src='aivle.png' unselectable='on' />
                </div>
                <div className={styles.input__container}>
                    <div>
                        <input
                            type='password'
                            id='password'
                            className={styles.password__input}
                            onChange={passwordValueChk}
                            autoComplete='false'
                        />

                        <label htmlFor='password' className={passwordInputState ? styles.password_label__focused : styles.password_label}>
                            비밀번호를 입력해주세요.
                        </label>
                    </div>
                    <div>
                        <input
                            type='password'
                            id='password2'
                            className={styles.password2__input}
                            onChange={password2ValueChk}
                            autoComplete='false'
                        />
                        <label
                            htmlFor='password2'
                            className={password2InputState ? styles.password2_label__focused : styles.password2_label}>
                            한번 더 입력해주세요.
                        </label>
                    </div>
                    <input type='submit' value='변경하기' className={styles.send__button} onClick={handleSendBtn} />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
