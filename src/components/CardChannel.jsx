import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import { Xtream } from "@iptv/xtream-api";
import { VideoPlay } from "./VideoPlay";

export function CardChannel() {
    const [client, setClient] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoryAtual, setCategoryAtual] = useState(null);
    const [channels, setChannels] = useState([]);
    const [channelAtual, setChannelAtual] = useState(null);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [url, setUrl] = useState(null);

    const playerRef = useRef(null);
    useEffect(() => {
        const client_iptv = async () => {
            const user = await fetch("http://localhost:8010/user")
                .then((res) => res.json())
                .then((data) => setClient(data));

            const cats = await fetch("http://localhost:8010/categories")
                .then((res) => res.json())
                .then((data) => setCategories(data));

            const reqChannels = await fetch("http://localhost:8010/canais")
                .then((res) => res.json())
                .then((data) => setChannels(data));
        };
        client_iptv();     
    }, []);

    const listChannelsFiltereds = (category_id) => {
        const filtereds = channels.filter((channel) => {
            return String(channel.category_id) === String(category_id);
        });
        console.log(filtereds);
        setFilteredChannels(filtereds);
    };

    const handleChannelClick = (channelUrl) => {
        const formattedUrl = channelUrl.replace(".ts", ".m3u8").trim();
        if (formattedUrl === url) {
            if (playerRef.current) {
                playerRef.current.req;
                uestFullscreen();
                playerRef.current.play();
            }
        } else {
            setUrl(formattedUrl);
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
        <div className="bg-rose-300 rounded-md p-1 shadow-2xl border-box">
            <h2 className="text-white font-bold text-3xl text-center mb-4">
                IPTV Player Pro
            </h2>
            <div className=" w-56 m-auto bg-black rounded-md mb-3">
                <p className="text-white text-center font-semibold">Status: {client.status}</p>
                <p className="text-white text-center font-semibold">{client.message} ao nosso Player</p>
            </div>
            <h3 className="text-white font-bold text-2xl text-center mb-2">
                Escolha uma das Categorias
            </h3>

            <div className="flex gap-2 w-full box-border overflow-hidden">
                <div className="w-1/3 flex flex-col">
                    <select
                        className="bg-rose-50 border-none rounded-md p-2 mb-2 w-full shadow-inner focus:ring-2 focus:ring-rose-500 outline-none text-center"
                        onChange={(e) => {
                            const selectId = e.target.value;
                            listChannelsFiltereds(selectId);
                        }}
                    >
                        {/* <option value="">Escolha uma Categoria</option> */}
                        {categories.map((category) => (
                            <option
                                key={category.category_id}
                                value={category.category_id}
                                onClick={() =>
                                    setCategoryAtual(category.category_name)
                                }
                                className="bg-white m-2 rounded-md w-40 text-center "
                            >
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <div className="max-h-75 overflow-y-auto box-border">
                        {filteredChannels.length > 0 && (
                            <div>
                                {filteredChannels.map((channel, i) => {
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
                                                src={channel.stream_icon}
                                                alt="stream_icon"
                                                className="rounded-md w-6 h-6 mt-1"
                                            />
                                            <button
                                                className={`m-1 rounded-md text-center w-32 transition-all ${isActive ? "bg-blue-400 text-white font-bold" : "bg-slate-100"} `}
                                                onClick={() => {
                                                    handleChannelClick(
                                                        channel.url,
                                                    );
                                                    setChannelAtual(
                                                        channel.name,
                                                    );
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
                </div>
                <div className="w-2/3 overflow-hidden self-start sticky box-border">
                    {channelAtual && (
                        <span className="text-white font-semibold ">
                            {channelAtual}
                        </span>
                    )}
                    {url && <VideoPlay url={url} onReady={handlePlayerReady} />}
                </div>
            </div>
        </div>
    );
}
