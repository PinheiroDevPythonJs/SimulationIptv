import "./App.css";
import { CardChannel } from "./components/CardChannel";



export function App() {

  return (
    <main className="h-screen w-screen bg-black flow-root p-2">
      <h1 className="text-orange-500 text-center font-extrabold text-5xl mb-6">Pinheiro Iptv Flix</h1>
      <CardChannel />
    </main>
  )
}
