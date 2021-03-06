import * as React from 'react';
import { Link } from 'react-router-dom';
import { Game, GameStatus, GameType, RoundStatus } from "../../typings/index"

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
            <div className="col">
                <Link className="link-box" to={`/game-live/${this.props.game.id}`}>
                    <div className={this.getClassName()}>
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-dark">{this.gameTypeToText(this.props.game.type)}</h6>
                            {this.renderPlayers()}
                            <h6>Odehráno: {this.props.game.rounds.filter(round => round.status == RoundStatus.done).length}/16</h6>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    private getClassName() {
        let className = "card game-box";

        switch (this.props.game.status) {
            case GameStatus.finished:
                className = className.concat(" bg-success");
                break;
            case GameStatus.started:
                className = className.concat(" bg-warning");
                break;
            case GameStatus.notStarted:
                className = className.concat(" bg-danger");
                break;
        }

        return className;
    }

    private renderPlayers() {
        return (
            <p>
                {this.props.game.players.map((player, index) => (
                    player.participant.user.name + " "
                ))}
            </p>
        )
    }

    private gameTypeToText(gameType: GameType) {
        switch (gameType) {
            case GameType.FirstRound:
                return "První kolo";
            case GameType.SecondRound:
                return "Druhé kolo";
            case GameType.ThirdRound:
                return "Třetí kolo";
            case GameType.FinalRound:
                return "Finálové kolo";
        }
    }
 }