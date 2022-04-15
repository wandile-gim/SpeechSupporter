import styles from './Aivle.module.css';

const Aivle = () => {
    return (
        <div className='container'>
            <img className={styles.logo} src='aivle.png' />
            <div className={styles.aivle__container}>
                <div className={styles.total__container}>
                    <div className={styles.button__container}>
                        <button>거울모드</button>
                        <button>면접모드</button>
                    </div>
                    <div className={styles.video__container}></div>
                </div>
                <div className={styles.chat__container}></div>
            </div>
        </div>
    );
};

export default Aivle;
