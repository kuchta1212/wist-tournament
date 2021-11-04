import * as React from 'react'
import { Player, Round, Bet, GameStatus, RoundStatus } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary'
import { getApi } from '../api/ApiFactory'
import { BetCell } from './BetCell'

interface RoundRowProps {
    round: Round;
    players: Player[];
}

interface RoundRowState {
    round: Round;
    bets: IDictionary<number>;
}

export class RoundRow extends React.Component<RoundRowProps, RoundRowState> {
    private results: IDictionary<boolean> = new Dictionary<boolean>();

    constructor(props: RoundRowProps) {
        super(props);

        this.state = {
            round: this.props.round,
            bets: new Dictionary<number>()
        }
    }

    public render() {
        const content = this.getContent();
        return (
            <tr>
                <td>{this.props.round.amountOfCards}</td>
                {content}
            </tr>
        );
    }

    private getContent() {
        switch (this.state.round.status) {
            case RoundStatus.notStarted:
                return this.renderInit();
            case RoundStatus.betsAreSet:
                return this.renderBets();
            default:
                return this.renderReadOnly();
        }
    }

    private renderReadOnly() {
        return (
            <React.Fragment>
                {this.props.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    return <td key={bet.id} className={bet.isSuccess ? "bg-success" : "bg-danger"}>{bet.isSuccess ? bet.tip + 10 : bet.tip * (-1)}</td>
                })}
            </React.Fragment>
        );
    }

    private renderBets() {
        return (
            <React.Fragment>
                {this.props.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    return <BetCell key={bet.id} bet={bet} onBetResultSet={this.betResult.bind(this)} />
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitResults()}>Potvrdit výsledek</button>
                </td>
            </React.Fragment>
        );
    }

    private renderInit() {
        return (
            <React.Fragment>
                {this.props.players.sort(p => p.gameRank).map((player) => {
                    return <td key={player.id}><input type="number" min="0" max={this.props.round.amountOfCards} value={this.state.bets.contains(player.id) ? this.state.bets.get(player.id) : "0"} onChange={(event) => this.setBet(event.target.value, player.id)} /></td>
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitBets()}>Potvrdit</button>
                </td>
            </React.Fragment>
        );
    }

    private setBet(value: string, playerId: string) {
        const data = this.state.bets;
        data.put(playerId, parseInt(value));
        this.setState({ bets: data });
    }

    private async submitBets() {
        this.validateBets();
        await getApi().setBets(this.props.round.id, this.state.bets);
        const round = await getApi().getRound(this.state.round.id);
        this.setState({ round: round })
    }

    private validateBets() {
        if (this.state.bets.getKeys().length == 4) {
            return;
        }

        let data = this.state.bets;
        this.props.players.map((player) => {
            if (!data.contains(player.id)) {
                data.put(player.id, 0);
            }
        });

        this.setState({ bets: data });
    }

    private async submitResults() {
        if (!this.validateResults()) {
            alert("Not all results are set");
            return;
        }
        await getApi().setBetsResult(this.props.round.id, this.results);
        const round = await getApi().getRound(this.state.round.id);
        this.setState({ round: round })
    }

    private betResult(betId: string, isSuccess: boolean) {
        this.results.put(betId, isSuccess);
    }

    private validateResults(): boolean {
        return this.results.getKeys().length == 4;
    }
}