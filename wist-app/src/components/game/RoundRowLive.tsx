import * as React from 'react'
import { Player, Round, Bet, GameStatus, RoundStatus, BetStatus } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary'
import { getApi } from '../api/ApiFactory'
import { BetCell } from './BetCell'

interface RoundRowLiveProps {
    round: Round;
    players: Player[]
}

interface RoundRowLiveState {
    round: Round;
}

export class RoundRowLive extends React.Component<RoundRowLiveProps, RoundRowLiveState> {
    constructor(props: RoundRowLiveProps) {
        super(props);

        this.state = {
            round: this.props.round,
        }
    }

    public render() {
        const content = this.renderReadOnly();
        return (
            <tr>
                <td>{this.props.round.amountOfCards}</td>
                {content}
            </tr>
        );
    }


    private renderReadOnly() {
        return !!this.state.round.bets 
            ? (<React.Fragment>
                    {this.state.round.bets.sort((b1, b2) => { return b1.player.gameRank > b2.player.gameRank ? 1 : -1 }).map((bet) => {
                        return bet.status == BetStatus.withResult
                            ? <td key={bet.id} className={bet.isSuccess ? "bg-success" : "bg-danger"}>{bet.isSuccess ? bet.tip + 10 : bet.tip * (-1)}</td>
                            : <td key={bet.id}>{bet.tip}</td>
                    })}
                </React.Fragment>)
            : (<React.Fragment>
                {this.props.players.sort(p => p.gameRank).map((player) => {
                    return (
                        <td key={player.id}>0</td>
                    )
                })}
             </React.Fragment>)
    }

}