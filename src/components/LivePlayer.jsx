import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import {Hls,FetchLoader} from 'hls.js';
import ReactPlayer from 'react-player'

function LivePlayer({ room }) {
    const [stream, setStream] = useState("");
    const [mode, setMode] = useState("h");
    const videoRef = useRef(null);   // <video> 元素引用
    const playerRef = useRef(null);  // video.js 实例
    const hlsRef = useRef(null);     // Hls.js 实例

    useEffect(() => {
        console.log("LivePlayer refresh");
        window.parent.postMessage({ action: "stream", room }, "*");
        console.log("Post stream")

        const handleMessage = (e) => {
            if (e.data.action === "stream") {
                console.log("Receive Stream")
                let object;
                if (e.data.data.length === 2) {
                    var qn1 = e.data.data[1].format[1].codec[0].qn
                    var qn2 = e.data.data[1].format[1].codec[1]?.qn
                    if (qn1 <qn2) {
                        object = e.data.data[1].format[1].codec[1]
                    } else {
                        object = e.data.data[1].format[1].codec[0]
                    }
                } else {
                    object = e.data.data[0].format[0].codec[0];
                }
                console.log("current stream ",object);
                setStream(object.url_info[0].host + object.base_url + object.url_info[0].extra);
            }
        };

        window.addEventListener("message", handleMessage, { once: true });
        return () => window.removeEventListener("message", handleMessage);
    }, [room]);

    useEffect(() => {
        if (!videoRef.current || playerRef.current) return;

        playerRef.current = videojs(videoRef.current, {
            autoplay: true,
            controls: true,
            preload: 'auto',
            liveui: true,
            fluid: true,
        });

        // 横竖屏判断
        playerRef.current.on('loadedmetadata', () => {
            const videoEl = videoRef.current;
            setMode(videoEl.videoHeight > videoEl.videoWidth ? "v" : "h");
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);
    useEffect(() => {
        if (!stream || !videoRef.current) return;

        // 如果之前有 Hls 实例，先销毁
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                // 低延迟优化
                maxBufferLength: 15,
                maxMaxBufferLength: 30,
                lowLatencyMode: true,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 5,
                enableWorker: true,
                loader: FetchLoader,
            });
            hls.loadSource(stream);
            hls.attachMedia(videoRef.current);
            hlsRef.current = hls;
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = stream;
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [stream]);

    return (
        <div className="flex justify-center">
            <ReactPlayer
                //ref={videoRef}
                src={stream}
                className="video-js vjs-big-play-centered"
                playsInline
                style={{
                    height: mode === 'h' ? '' : '85vh',
                    width: '100%'
                }}
            />
        </div>
    );
}

export default LivePlayer;
