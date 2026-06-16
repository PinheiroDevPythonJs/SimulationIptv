import React from "react";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoPlay = ({ url, onReady }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    const options = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        preload: "auto",
        aspectRatio: "16:9",
        fill: true,
        liveui: false,
        controlBar: {
            playToggle: true,
            pictureInPictureToggle: false,
            volumePanel: {
                inline: false,
            },
        },
        sources: [
            {
                src: url,
                type: "application/x-mpegURL",
            },
        ],
    };

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");

            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                    videojs.log("player is ready");
                    onReady && onReady(player);
                },
            ));
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        if (player && url) {
            // Em vez de recriar o componente, apenas trocamos a fonte interna
            player.src({
                src: url,
                type: "application/x-mpegURL",
            });

            // Alguns browsers exigem o load() para streams HLS
            player.load();
            player
                .play()
                .catch((e) => console.log("Autoplay aguardando interação"));
        }
    }, [url]); // Só roda quando a URL mudar

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div>
            <div
                ref={videoRef}
                data-vjs-player
                playsInline
                className="bg-black vjs-big-play-centered aspect-video"
            />
        </div>
    );
};
