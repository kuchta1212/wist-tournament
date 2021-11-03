import * as React from 'react';
import { Game } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'

interface GameListProps {
    games: Game[];
}

interface GameListState {
}

export class GameList extends React.Component<GameListProps, GameListState> {

    constructor(props: GameListProps) {
        super(props);
    }


    public render() {
        return (
            <div className="game-list text-light">
                {
                    this.props.games.map((game, index) => (
                        <GameBox key={game.id} game={game} />
                    ))
                }
            </div>
        );
    }
}