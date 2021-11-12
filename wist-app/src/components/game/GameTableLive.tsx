import * as React from 'react'
import { Game, RoundStatus, Round } from "../../typings/index"
import { Table } from 'reactstrap'
import { RoundRow } from './RoundRow'
import { GameResultRow } from './GameResultRow'
import { RoundRowLive } from './RoundRowLive'

interface GameTableLiveProps {
    game: Game;
}

interface GameTableLiveState {
    rounds: Round[]
}

export class GameTableLive extends React.Component<GameTableLiveProps, GameTableLiveState> {

    constructor(props: GameTableLiveProps) {
        super(props);

        this.state = {
            rounds: this.props.game.rounds
        }
    }

    public render() {
        return (
            <div className="col">
                <Table className="text-light table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player, index) => (
                                <th key={player.id}>{player.participant.user.name}</th>
                            ))}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rounds.filter(r => r.status != RoundStatus.notStarted).sort((r1, r2) => { return r1.roundNumber > r2.roundNumber ? 1 : -1 }).map((round) => {
                            return <RoundRowLive key={round.id} round={round} players={this.props.game.players} />
                        })}
                        <GameResultRow game={this.props.game} />
                    </tbody>
                </Table>
            </div>
        );
    }
}