import Game from "./Game";
import {useParams} from "react-router-dom";

const GameWithKey = () => {
    const { id } = useParams();
    return <Game key={id} />;
};
export default GameWithKey;