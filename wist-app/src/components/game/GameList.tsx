﻿import * as React from 'react'
import { Game, GameStatus, GameType } from "../../typings/index"
import { getApi } from "../api/ApiFactory"
import { Loader } from '../Loader'
import { GameBox } from './GameBox'
import './Game.css'

interface GameListProps {
    type: GameType;
    tournamentId: string;
}

interface GameListState {
    games: Game[];
    loading: boolean;
}

export class GameList extends React.Component<GameListProps, GameListState> {

    constructor(props: GameListProps) {
        super(props);

        this.state = {
            games: [],
            loading: true
        }
    }

    public async componentDidMount() {
        await this.getData();
    }

    private async getData() {
        const games = await getApi().getTournamentGamesForRound(this.props.tournamentId, this.props.type);
        this.setState({ games: games, loading: false });
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderContent()

        return (
            <div>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button title="Vytvoř" type="button" className="btn game-round-btn" onClick={() => this.createNextRound()}>➕</button>
                    <button title="Přegeneruj" type="button" className="btn game-round-btn" onClick={() => this.reCreateGameRound()}>🔃</button>
                    <button title="Smaž" type="button" className="btn game-round-btn" onClick={() => this.removeGameRound()}>🚫</button>
                </div>
                {contents}
            </div>
        );
    }

    public renderContent() {
        return (
            <div className="row game-list text-light">
                {
                    this.state.games.map((game, index) => (
                        <GameBox key={game.id} game={game} />
                    ))
                }
            </div>
        );
    }

    private async createNextRound() {
        if (this.state.games.length === 0) {
            await getApi().createRoundOfGames(this.props.tournamentId, this.props.type);
            await this.getData();
        } else {
            alert("Kolo už existuje");
        }

    }

    private async reCreateGameRound() {
        if (this.state.games.length === 0) {
            alert("Kolo neexistuje");
            return;
        } else if (this.state.games.filter(g => g.status !== GameStatus.notStarted).length !== 0) {
            alert("Některé hry již začali. Nejde přegenerovat");
            return;
        }

        await getApi().createRoundOfGames(this.props.tournamentId, this.props.type);
        await this.getData();
    }

    private async removeGameRound() {
        if (this.state.games.filter(g => g.status !== GameStatus.notStarted).length !== 0) {
            alert("Některé hry již začali. Nejde smazat");
            return;
        }

        await getApi().removeGames(this.props.tournamentId, this.props.type);
        await this.getData();
    }
}