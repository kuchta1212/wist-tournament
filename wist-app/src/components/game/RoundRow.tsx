import * as React from 'react'
import { Player, Round, Bet, GameStatus, RoundStatus, BetStatus } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary'
import { getApi } from '../api/ApiFactory'
import { BetCell } from './BetCell'

interface RoundRowProps {
    round: Round;
    players: Player[]
    roundFinished: (round: Round) => void;
    gameStaus: GameStatus
}

interface RoundRowState {
    round: Round;
    bets: IDictionary<number>;
    inputValid: IDictionary<boolean>
}

export class RoundRow extends React.Component<RoundRowProps, RoundRowState> {
    private results: IDictionary<boolean> = new Dictionary<boolean>();

    constructor(props: RoundRowProps) {
        super(props);

        if (!!this.props.round.bets) {
            this.props.round.bets.map((bet) => {
                if (bet.status == BetStatus.withResult) {
                    this.results.put(bet.id, bet.isSuccess);
                }
            })
        }

        this.state = {
            round: this.props.round,
            bets: this.betsToDict(this.props.round.bets),
            inputValid: this.playersToDict(this.props.players),
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

    private betsToDict(bets: Bet[]): IDictionary<number> {
        let result = new Dictionary<number>();
        if (!bets) {
            return result;
        }

        for (let bet of bets) {
            result.put(bet.player.id, bet.tip);
        }

        return result;
    }

    private playersToDict(players: Player[]): IDictionary<boolean> {
        let result = new Dictionary<boolean>();
        if (!players) {
            return result;
        }

        for (let player of players) {
            result.put(player.id, true);
        }

        return result;
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
                {this.state.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    return <td key={bet.id} className={bet.isSuccess ? "bg-success" : "bg-danger"}>{bet.isSuccess ? bet.tip + 10 : bet.tip * (-1)}</td>
                })}
                {
                    this.props.gameStaus != GameStatus.finished
                    ? <td><button type="button" className="btn btn-light" onClick={() => this.changeBetsResults()}>Změnit výsledky</button></td>
                    : null
                }
            </React.Fragment>
        );
    }

    private renderBets() {
        return (
            <React.Fragment>
                {this.state.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                    return <BetCell key={bet.id} bet={bet} onBetResultSet={this.betResult.bind(this)} />
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitResults()}>Potvrdit výsledek</button>
                </td>
                <td>
                    <button type="button" className="btn btn-light" onClick={() => this.changeBets()}>Změnit</button>
                </td>
            </React.Fragment>
        );
    }

    private renderInit() {
        return (
            <React.Fragment>
                {this.props.players.sort(p => p.gameRank).map((player) => {
                    return (
                        <td key={player.id} className={player.gameRank == this.state.round.dealerNumber ? "dealer-cell" : ""}>
                            <input className={!this.state.inputValid.get(player.id) ? "bg-danger" : ""} type="number" min="0" max={this.state.round.amountOfCards} placeholder="--" value={this.state.bets.get(player.id)} onChange={(event) => this.setBet(event.target.value, player.id)} />
                        </td>
                    )
                })}
                <td>
                    <button type="button" className="btn btn-secondary" onClick={() => this.submitBets()}>Potvrdit</button>
                </td>
            </React.Fragment>
        );
    }

    private changeBetsResults() {
        let round = this.state.round;
        round.status = RoundStatus.betsAreSet;
        this.setState({ round: round });
    }

    private changeBets() {
        let round = this.state.round;
        round.status = RoundStatus.notStarted;
        this.setState({ round: round });
    }

    private setBet(value: string, playerId: string) {
        const intValue = parseInt(value);
        if (this.validateBet(intValue)) {
            const data = this.state.bets;
            data.put(playerId, intValue);

            if (!this.state.inputValid.get(playerId)) {
                let inputValid = this.state.inputValid;
                inputValid.put(playerId, true);
                this.setState({ inputValid: inputValid, bets: data })
            } else {
                this.setState({ bets: data });
            }
        } else {
            let inputValid = this.state.inputValid;
            inputValid.put(playerId, false);
            this.setState({ inputValid: inputValid })
        }
    }

    private validateBet(value: number): boolean {
        if (value < 0 || value > this.state.round.amountOfCards) {
            return false;
        }
        
        return true;
    }

    private async submitBets() {
        if (this.validateBets()) {
            await getApi().setBets(this.state.round.id, this.state.bets);
            const round = await getApi().getRound(this.state.round.id);
            this.setState({ round: round })
        } else {
            alert("Zkontroluj sázky")
        }

    }

    private validateBets(): boolean {
        if (this.state.bets.getKeys().length != 4) {
            return false;
        }

        for (let player of this.props.players) {
            if (!this.state.inputValid.get(player.id)) {
                return false;
            }
        }

        const sum = this.state.bets.getValues().reduce((sum, current) => sum += current, 0)
        if (sum == this.state.round.amountOfCards) {
            return false;
        }

        return true;
    }

    private async submitResults() {
        if (!this.validateResults()) {
            return;
        }
        await getApi().setBetsResult(this.state.round.id, this.results);
        const round = await getApi().getRound(this.state.round.id);
        this.props.roundFinished(round);
        //this.setState({ round: round });
    }

    private betResult(betId: string, isSuccess: boolean) {
        this.results.put(betId, isSuccess);
    }

    private validateResults(): boolean {
        if (this.results.getKeys().length != 4) {
            alert("Zadej všechny výsledky");
            return false;
        }

        if (this.results.getValues().filter(v => !v).length == 0) {
            alert("Bohužel ne všichni můžou vyhrát");
            return false;
        }

        return true;
    }
}