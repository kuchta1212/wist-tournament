import * as React from 'react'
import { Game, RoundStatus, Round } from "../../typings/index"
import { Table } from 'reactstrap'
import { RoundRow } from './RoundRow'
import { GameResultRow } from './GameResultRow'

interface GameTableProps {
    game: Game;
}

interface GameTableState {
    rounds: Round[]
}

export class GameTable extends React.Component<GameTableProps, GameTableState> {

    constructor(props: GameTableProps) {
        super(props);

        this.state = {
            rounds: this.props.game.rounds
        }
    }

    public render() {
        return (
            <Table className="text-light">
                <thead>
                    <tr>
                        <th>#</th>
                        {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player, index) => (
                            <th key={player.id}>{player.participant.user.name}</th>
                        ))}
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {this.state.rounds.filter(r => r.status == RoundStatus.done).sort((r1, r2) => { return r1.roundNumber > r2.roundNumber ? 1 : -1 }).map((round) => {
                        return <RoundRow key={round.id} round={round} players={this.props.game.players} roundFinished={this.roundFinished.bind(this)} />
                    })}
                    <GameResultRow game={this.props.game} />
                    {this.state.rounds.filter(r => r.status != RoundStatus.done).sort((r1, r2) => { return r1.roundNumber > r2.roundNumber ? 1 : -1 }).map((round) => {
                        return <RoundRow key={round.id} round={round} players={this.props.game.players} roundFinished={this.roundFinished.bind(this)} />
                    })}
                </tbody>
            </Table>
        );
    }

    private roundFinished(roundId: string) {
        let rounds = this.state.rounds;
        var round = rounds.find(r => r.id == roundId);
        if (!!round) {
            round.status = RoundStatus.done;
        }
        
        this.setState({ rounds: rounds });
    }
}