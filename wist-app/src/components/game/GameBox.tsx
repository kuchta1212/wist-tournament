import * as React from 'react';
import { Game, GameType } from "../../typings/index"

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
            <div className="card game-box bg-info" onClick={() => this.openGame()}>
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-dark">{this.gameTypeToText(this.props.game.type)}</h6>
                    {this.renderPlayers()}
                    <h6>Odehráno: {this.props.game.rounds.filter(round => round.isDone).length}/16</h6>
                </div>
            </div>
        );
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

    private openGame() {

    }
 }