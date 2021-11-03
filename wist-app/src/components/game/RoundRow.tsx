import * as React from 'react';
import { Player, Round, Bet } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary';
import { getApi } from '../api/ApiFactory';
import { BetCell } from './BetCell';

interface RoundRowProps {
    round: Round;
    players: Player[];
}

interface RoundRowState {
    state: RoundState;
    round: Round;
}

enum RoundState {
    init,
    bets,
    done
}



export class RoundRow extends React.Component<RoundRowProps, RoundRowState> {

    private data: IDictionary<number> = new Dictionary<number>();
    private results: IDictionary<boolean> = new Dictionary<boolean>();

    constructor(props: RoundRowProps) {
        super(props);

        this.state = {
            state: this.props.round.isDone ? RoundState.done : RoundState.init,
            round: this.props.round,
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
        switch (this.state.state) {
            case RoundState.init:
                return this.renderInit();
            case RoundState.bets:
                return this.renderBets();
            default:
                return this.renderReadOnly();
        }
    }

    private renderReadOnly() {
        return (
            <React.Fragment>
                {this.props.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    <td key={bet.id}>{bet.isSuccess ? bet.tip + 10 : bet.tip * (-1)}</td>
                })}
            </React.Fragment>
        );
    }

    private renderBets() {
        return (
            <React.Fragment>
                {this.props.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    <BetCell key={bet.id} bet={bet} onBetResultSet={this.betResult.bind(this)} />
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitResults()}>Potvrdit</button>
                </td>
            </React.Fragment>
        );
    }

    private renderInit() {
        return (
            <React.Fragment>
                {this.props.players.sort(p => p.gameRank).map((player) => {
                    return <td key={player.id}><input type="number" min="0" max={this.props.round.amountOfCards} value={this.data.contains(player.id) ? this.data.get(player.id) : "0"} onChange={(event) => this.setBet(event.target.value, player.id)} /></td>
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitBets()}>Potvrdit</button>
                </td>
            </React.Fragment>
        );
    }

    private setBet(value: string, playerId: string) {
        this.data.put(playerId, parseInt(value))
    }

    private async submitBets() {
        await getApi().setBets(this.props.round.id, this.data);
        const round = await getApi().getRound(this.state.round.id);
        this.setState({ state: RoundState.bets, round: round })
    }

    private async submitResults() {
        await getApi().setBetsResult(this.props.round.id, this.state.results);
        this.setState({ state: RoundState.bets })
    }

    private betResult(betId: string, isSuccess: boolean) {
        this.results.put(betId, isSuccess);
    }
}