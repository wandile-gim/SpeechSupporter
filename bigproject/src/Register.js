import styles from './Register.module.css';

const Register = () => {
    return (
        <div className={styles.container}>
            <div className={styles.busunesscard__container}>
                <img className={styles.logo} src='aivle.png' />
                <div className={styles.img__container}>
                    <img src='' />
                </div>
                <div className={styles.form__container}>
                    <form method='post'>
                        <input type='text' id='id' />
                        <input type='password' id='password' />
                        <input type='email' id='email' />
                        <input type='text' id='company' />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
