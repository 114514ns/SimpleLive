import React, {useEffect, useRef, useState} from 'react';
import ReactPlayer from 'react-player'

function LivePlayer({room}) {
    const [stream, setStream] = useState("");
    const [mode, setMode] = useState("h");
    const videoRef = useRef(null);   // <video> 元素引用

    useEffect(() => {
        console.log("LivePlayer refresh");
        window.parent.postMessage({action: "stream", room}, "*");
        console.log("Post stream")

        const handleMessage = (e) => {
            if (e.data.action === "stream") {
                console.log("Receive Stream")
                let object;
                if (e.data.data.length === 2) {
                    var qn1 = e.data.data[1].format[1].codec[0].qn
                    var qn2 = e.data.data[1].format[1].codec[1]?.qn
                    if (qn1 < qn2) {
                        object = e.data.data[1].format[1].codec[1]
                    } else {
                        object = e.data.data[1].format[1].codec[0]
                    }
                } else {
                    object = e.data.data[0].format[0].codec[0];
                }
                console.log("current stream ", object);
                setStream(object.url_info[0].host + object.base_url + object.url_info[0].extra);
            }
        };

        window.addEventListener("message", handleMessage, {once: true});
        return () => window.removeEventListener("message", handleMessage);
    }, [room]);

    return (
        <div className="flex justify-center">
            <ReactPlayer
                ref={videoRef}
                src={stream}
                className="video-js vjs-big-play-centered"
                playsInline
                controls
                onPlaying={ () => {
                    const videoEl = videoRef.current;
                    setMode(videoEl.videoHeight > videoEl.videoWidth ? "v" : "h");
                }}
                style={{
                    height: mode === 'h' ? '80vh' : '85vh',
                    width: '100%'
                }}
            />
        </div>
    );
}

export default LivePlayer;
