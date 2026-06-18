import { useEffect, useMemo, useRef, useState } from "react";
import videojs from "video.js";
import { Xtream } from "@iptv/xtream-api";
import { VideoPlay } from "./VideoPlay";

export function CardChannel() {
    const [client, setClient] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoryAtual, setCategoryAtual] = useState(null);
    const [channels, setChannels] = useState([]);
    const [channelAtual, setChannelAtual] = useState(null);
    const playerRef = useRef(null);
    
    useEffect(() => {
        const client_iptv = async () => {
            const user = await fetch(`${import.meta.env.VITE_API}/user`)
                .then((res) => res.json())
                .then((data) => setClient(data));

            const cats = await fetch(`${import.meta.env.VITE_API}/categories`)
                .then((res) => res.json())
                .then((data) => setCategories(data));

            const reqChannels = await fetch(
                `${import.meta.env.VITE_API}/canais`,
            )
                .then((res) => res.json())
                .then((data) => setChannels(data));
        };
        client_iptv();
    }, []);

    const ChannelsFiltereds = useMemo(() => {
        if (!categoryAtual) return [];
        return channels.filter((channel) => {
            return String(channel.category_id) === String(categoryAtual);
        });
    }, [channels, categoryAtual]);

    const url = channelAtual ? channelAtual.url.replace(".ts", ".m3u8").trim() : null;
        

    const handleChannelClick = (channelUrl) => {
        const formattedUrl = channelUrl.replace(".ts", ".m3u8").trim();
        if (formattedUrl === url) {
            if (playerRef.current) {
                playerRef.current.req;
                playerRef.current.requestFullscreen();
                playerRef.current.play();
            }
        } else {
            // setUrl(formattedUrl);
            console.log(url);
            console.log("Nova URL definida:", formattedUrl);
        }
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });

        player.on("dblclick", () => {
            if (player.isFullscreen()) {
                player.exitFullscreen();
            } else {
                player.requestFullscreen();
            }
        });
    };

    return (
        <div className="bg-rose-300 flex flex-col items-center w-full rounded-md px-2 pb-2 shadow-2xl border-box">
            <h2 className="text-white font-bold text-3xl text-center mb-2">
                Player Pro
            </h2>
            <div className=" w-fit m-auto bg-black rounded-md mb-3 p-2">
                <p className="text-white text-center font-semibold text-2xl text-nowrap">
                    {client.message} ao nosso Player
                </p>
                <p className="text-white text-center font-semibold">
                    Status: {client.status}
                </p>
            </div>

            <div className="flex items-center gap-2 p-4 min-w-full bg-slate-800 rounded-md">
                <div className="w-1/3 flex flex-col">
                    <h3 className="text-white font-bold text-2xl text-center mb-2">
                        Escolha uma Categoria para Assistir
                    </h3>
                    <select
                        className="bg-rose-50 border-none rounded-md p-2 mb-2 w-32 m-auto shadow-inner focus:ring-2 focus:ring-rose-500 outline-none text-center"
                        onChange={(e) => {
                            const selectId = e.target.value;
                            setCategoryAtual(selectId);
                        }}
                    >
                        {/* <option value="">Escolha uma Categoria</option> */}
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                    onClick={() =>
                                        setCategoryAtual(category.category_id)
                                    }
                                    className="bg-white m-2 rounded-md w-40 text-center font-semibold"
                                >
                                    {category.category_name}
                                </option>
                            ))}
                    </select>
                    {ChannelsFiltereds.length > 0 && (
                        <div className="max-h-75 bg-white overflow-y-auto box-border w-fit m-auto p-2 rounded-md">
                            {ChannelsFiltereds.map((channel, i) => {
                                const channelM3u8 = channel.url
                                    .replace(".ts", ".m3u8")
                                    .trim();
                                const isActive = channelM3u8 === url;
                                return (
                                    <div
                                        key={`${channel.stream_id}-${i}`}
                                        className="flex"
                                    >
                                        <img
                                            src={`https://images.weserv.nl/?url=${channel.stream_icon}`}
                                            alt="stream_icon"
                                            className="rounded-md w-6 h-6 mt-1"
                                        />
                                        <button
                                            className={`m-1 rounded-md text-center font-semibold w-32 transition-all cursor-pointer ${isActive ? "bg-blue-400 text-white font-bold" : "bg-slate-100"} `}
                                            onClick={() => {
                                                setChannelAtual(channel);
                                                handleChannelClick(channel.url);
                                            }}
                                        >
                                            {channel.name}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="w-2/3 overflow-hidden self-start sticky box-border">
                    {channelAtual && (
                        <span className="text-white font-semibold ">
                            {channelAtual.name}
                        </span>
                    )}
                    {url && <VideoPlay url={url} onReady={handlePlayerReady} />}
                </div>
            </div>
        </div>
    );
}
