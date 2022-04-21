import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SendEmail.module.css';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/users/reset_password/';

const SendEmail = () => {
    const [idValue, setIdValue] = useState('');
    const [idInputState, setIdInputState] = useState(false);
    const [sendChk, setSendChk] = useState(false);
    const [tokenValue, setTokenValue] = useState('');
    const [tokenInputState, setTokenInputState] = useState(false);
    const [state, setState] = useState(false);

    const email = useRef(null);
    const token = useRef(null);

    const navigation = useNavigate();

    const idValueChk = (event) => {
        if (event.target.value !== '') {
            setIdInputState(true);
        } else {
            setIdInputState(false);
        }
        setIdValue(event.target.value);
    };

    const tokenValueChk = (event) => {
        if (event.target.value !== '') {
            setTokenInputState(true);
        } else {
            setTokenInputState(false);
        }
        setTokenValue(event.target.value);
    };

    const handleSendBtn = async () => {
        if (!state) {
            setIdInputState(false);
            email.current.value = '';
            const emailData = {
                email: idValue,
            };
            const data = await axios.post(BASE_URL, emailData);

            if (data.status) {
                setSendChk(true);
                setState(true);
            }
        } else {
            setTokenInputState(false);
            token.current.value = '';
            const tokenData = {
                email: idValue,
                token: tokenValue,
            };
            const data = await axios.post(BASE_URL, tokenData);
            if (data.data['send_state']) {
                navigation('/reset_password', { state: { email: idValue } });
            }
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
                <span className={sendChk ? styles.send__text : styles.hidden}>이메일을 확인해 주세요!</span>
                <div className={styles.input__container}>
                    {sendChk ? (
                        <>
                            <input
                                type='text'
                                id='token'
                                className={styles.id__input}
                                onChange={tokenValueChk}
                                autoComplete='false'
                                ref={token}
                            />
                            <label htmlFor='token' className={tokenInputState ? styles.id_label__focused : styles.id_label}>
                                인증번호를 입력해주세요.
                            </label>
                            <input type='submit' value='전송하기' className={styles.send__button} onClick={handleSendBtn} />
                        </>
                    ) : (
                        <>
                            <input
                                type='email'
                                id='email'
                                className={styles.id__input}
                                onChange={idValueChk}
                                autoComplete='false'
                                ref={email}
                            />
                            <label htmlFor='email' className={idInputState ? styles.id_label__focused : styles.id_label}>
                                이메일을 입력해주세요.
                            </label>
                            <input type='submit' value='전송하기' className={styles.send__button} onClick={handleSendBtn} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
