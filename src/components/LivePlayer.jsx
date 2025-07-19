import React, {useEffect} from 'react';
import Hls from "hls.js";
import shaka from 'shaka-player';

function LivePlayer(props) {

    const [stream, setStream] = React.useState("");

    const ref = React.createRef();

    const hlsRef = React.createRef();

    const flvRef = React.createRef()

    useEffect(() => {
        console.log("props callback")
        window.parent.postMessage({
            "action": "stream",
            "room": props.room
        }, "*")

        window.addEventListener("message", (e) => {
            if (e.data.action === "stream") {
                if (e.data.data.length === 2) {
                    var object = e.data.data[1].format[1].codec[0]

                } else {
                    var object = e.data.data[0].format[0].codec[0]
                }
                setStream(object.url_info[0].host + object.base_url + object.url_info[0].extra)
            }
        }, {
            once: true
        })
    }, [props.room])
    useEffect(() => {

        console.log("stream callback")
        if (!hlsRef.current) {
            var hls = new Hls({
                maxBufferLength: 30,        // 默认是 30 秒，可适当减小为 15 秒或更少
                maxBufferSize: 30 * 1000 * 1000, // 默认无限，可设置最大 buffer 大小（单位：字节）
                maxMaxBufferLength: 60,     // 最大不超过 60 秒，防止缓冲飙升
                enableWorker: false,
                lowLatencyMode:true
            });
        }

        hls.loadSource(stream);
        hls.attachMedia(ref.current);
        hlsRef.current = hls;
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad(); // 尝试恢复网络错误
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError(); // 尝试恢复解码错误
                        break;
                    default:
                        hls.destroy(); // 销毁重建
                        initPlayer();
                        break;
                }
            }
        });
        return () => {
            hls.destroy();
            hlsRef.current = null;
            console.log("HlsPlayer destroyed");
        };
    }, [stream])
    return (
        <div className={'w-full'}>

            <video className={'w-full'} ref={ref} controlsList="nodownload  noremoteplayback noplaybackrate"
                   autoPlay={true} controls allowFullScreen>

            </video>
        </div>
    );
}

export default LivePlayer;