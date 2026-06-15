import { useEffect, useRef } from "react";
import videojs from "video.js";
import 'video.js/dist/video-js.css';

export function VideoPlayer({ url }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // EFEITO 1: Criar o Player apenas UMA VEZ
    useEffect(() => {
        if (!videoRef.current) return;

        // Inicia o player vazio ou com a primeira URL
        const player = playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: true, // Mudei para true para testar se ele carrega logo
            preload: 'auto',
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2]
        });

        // Limpeza ao desmontar o componente
        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []); // Array vazio: só executa quando o componente "nasce"

    // EFEITO 2: Trocar a URL sempre que a Prop URL mudar
    useEffect(() => {
        const player = playerRef.current;

        if (player && url) {
            console.log("Player avisado! Trocando para:", url);

            player.src({
                src: url,
                type: 'application/x-mpegURL'
            });

            player.load(); // Força o carregamento da nova fonte
        }
    }, [url]); // Executa sempre que a URL vinda das props mudar

    return (
        <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl">
            <div data-vjs-player>
                <video
                    ref={videoRef}
                    className="video-js vjs-big-play-centered"
                    playsInline
                ></video>
            </div>
        </div>
    );
}
