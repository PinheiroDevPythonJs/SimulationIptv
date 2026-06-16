import "./App.css";
import { CardChannel } from "./components/CardChannel";

export function App() {
    return (
        <main className="min-h-screen max-w-full bg-black flex flex-col items-center">
            <h1 className="text-orange-500 text-center font-extrabold text-5xl mb-2">
                Pinheiro PlayFlix
            </h1>
            <CardChannel />
        </main>
    );
}
