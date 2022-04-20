import * as posenet from '@tensorflow-models/posenet';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import styles from './Aivle.module.css';
import { drawKeypoints, drawSkeleton } from './Utilites';

const Aivle = () => {
    const [keypoints, setKeypoints] = useState([]);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const detectWebcamFeed = async (posenet_model) => {
        if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;
            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            // Make Estimation
            const pose = await posenet_model.estimateSinglePose(video);
            drawResult(pose, video, videoWidth, videoHeight, canvasRef);
        }
    };
    const runPosenet = async () => {
        const posenet_model = await posenet.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.8,
        });
        //
        setInterval(() => {
            detectWebcamFeed(posenet_model);
        }, 500);
    };

    runPosenet();

    const drawResult = (pose, video, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext('2d');
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        drawKeypoints(pose['keypoints'], 0.6, ctx);
        drawSkeleton(pose['keypoints'], 0.7, ctx);
    };
    return (
        <div className='container'>
            <img className={styles.logo} src='aivle.png' />
            <div className={styles.aivle__container}>
                <div className={styles.total__container}>
                    <div className={styles.button__container}>
                        <button>거울모드</button>
                        <button>면접모드</button>
                    </div>
                    <div className={styles.video__container}>
                        <Webcam
                            ref={webcamRef}
                            style={{
                                position: 'absolute',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                zindex: 9,
                                width: 640,
                                height: 480,
                            }}
                        />
                        <canvas
                            ref={canvasRef}
                            style={{
                                position: 'absolute',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                zindex: 9,
                                width: 640,
                                height: 480,
                            }}
                        />
                    </div>
                </div>
                <div className={styles.chat__container}>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Aivle;
