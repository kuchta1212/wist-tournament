import * as React from 'react';
import { Game } from "../../typings/index"
import newIcon from './../../images/new.svg';
import podium from './../../images/podium.svg'

interface GameBoxProps {
    game: Game;
}

interface GameBoxState {
}

export class GameBox extends React.Component<GameBoxProps, GameBoxState> {

    constructor(props: GameBoxProps) {
        super(props);
    }

    public render() {
        return (
            <div className="card tournament-box bg-secondary">
                <div className="card-body">
                    <h5 className="card-title text-dark">{this.props.game.name}</h5>
                    <h6 className="card-subtitle mb-2 text-dark">{this.props.game.type}</h6>
                    <h6>{this.props.game.rounds.filter(round => round.isDone).length}/16</h6>
                    {this.renderPlayers()}
                </div>
            </div>
        );
    }

    private renderPlayers() {
        return (
            <div>
                {this.props.game.players.map((player, index) => (
                    <p>{player.participant.user.name}</p>
                ))}
            </div>
        )
    }
 }