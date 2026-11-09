import React, { useEffect, useRef, useState } from "react";
import mpegts from "mpegts.js";

const IptvTsPlayer = ({ urlIptvOriginal }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // 1. O NOVO ESTADO: Controla se mostramos a mensagem de carregamento
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        if (!urlIptvOriginal) return;

        // Quando a URL muda, voltamos a mostrar o "A carregar..."
        setIsBuffering(true);

        const proxyUrl = `https://serveriptv-h90h.onrender.com/stream?url=${encodeURIComponent(urlIptvOriginal)}`;

        if (mpegts.getFeatureList().mseLivePlayback) {
            playerRef.current = mpegts.createPlayer(
                { type: "mpegts", isLive: true, url: proxyUrl },
                {
                    enableWorker: true,
                    enableStashBuffer: true,
                    stashInitialSize: 384,
                    liveBufferLatencyChasing: true,
                    liveBufferLatencyMaxLatency: 15,
                    liveBufferLatencyMinRemain: 4,
                },
            );

            playerRef.current.attachMediaElement(videoRef.current);
            playerRef.current.load();

            const promessaPlay = playerRef.current.play();
            if (promessaPlay !== undefined) {
                promessaPlay.catch((erro) => {
                    if (erro.name !== "AbortError")
                        console.log("Auto-play requer clique.", erro);
                });
            }
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.pause();
                playerRef.current.unload();
                playerRef.current.detachMediaElement();
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [urlIptvOriginal]);

    return (
        <div className="relative flex justify-center w-full bg-black p-4 rounded-md shadow-lg">
            {/* 2. O AVISO DE CARREGAMENTO (Fica por cima do vídeo) */}
            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50 rounded-md">
                    <div className="text-white font-bold text-xl animate-pulse">
                        A sintonizar canal... ⏳
                    </div>
                </div>
            )}

            {/* 3. A TAG VIDEO COM OS DETETORES INTELIGENTES */}
            <video
                ref={videoRef}
                controls
                autoPlay
                muted
                className="w-full max-w-4xl border border-gray-700 rounded-md shadow-2xl relative z-0"
                // O navegador avisa-nos que o vídeo está engasgado ou a carregar
                onWaiting={() => setIsBuffering(true)}
                // O navegador avisa-nos que o vídeo começou a rodar com sucesso
                onPlaying={() => setIsBuffering(false)}
            />
        </div>
    );
};

export default IptvTsPlayer;
