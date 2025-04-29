import {create} from "zustand/react";
import {use} from "react";

interface GameState {
    games: Game[];
    setGames: (games: Array<Game>) => void;
    editGame: (game: Game, newGamename: string) => void;
    removeGame: (game: Game) => void;
}
const getlocalStorage = (key: string): Array<Game> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: Array<Game>) => window.localStorage.setItem(key, JSON.stringify(value));
const useStore = create<GameState>((set) => ({
    games: getlocalStorage('games') || [],
    setGames: (games: Array<Game>) => set(() => {
        setLocalStorage('games', games)
        return {games: games}
    }),
    editGame: (game: Game, newGamename) => set((state) => {
        const temp = state.games.map((g: Game) =>g.gameId === game.gameId ?
            ({...g, title: newGamename} as Game): g)
        setLocalStorage('games', temp)
        return {
            games: state.games.map((g: Game) => g.gameId === game.gameId ?
                ({ ...g, title: newGamename} as Game) : g)
        }
    }),
    removeGame: (game: Game) => set((state) => {
        setLocalStorage('games', state.games.filter(g=>g.gameId !== game.gameId))
        return {
            games: state.games.filter(g=>g.gameId !== game.gameId)
        }
    })
}))

export const useGameStore = useStore;