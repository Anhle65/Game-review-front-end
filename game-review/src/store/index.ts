import {create} from "zustand/react";
import {use} from "react";

interface GameState {
    games: Game[];
    genres: Genre[];
    setGames: (games: Array<Game>) => void;
    setGenres: (genres: Array<Genre>) => void;
    editGame: (game: Game, newGamename: string) => void;
    removeGame: (game: Game) => void;
}
// const getlocalStorage = (key: string): Array<Game> => JSON.parse(window.localStorage.getItem(key) as string);
// const setLocalStorage = (key: string, value: Array<Game>) => window.localStorage.setItem(key, JSON.stringify(value));
const getLocalStorage = <T>(key: string): T[] =>
    JSON.parse(window.localStorage.getItem(key) || '[]');

const setLocalStorage = <T>(key: string, value: T[]) =>
    window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<GameState>((set) => ({
    games: getLocalStorage<Game>('games') || [],
    genres: getLocalStorage<Genre>('genres') || [],
    setGames: (games: Array<Game>) => set(() => {
        setLocalStorage('games', games)
        return {games: games}
    }),
    setGenres: (genres: Array<Genre>) => set(() => {
        setLocalStorage('genres', genres)
        return {genres: genres}
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