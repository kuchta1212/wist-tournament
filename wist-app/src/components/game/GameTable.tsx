import * as React from 'react';
import { Game } from "../../typings/index"
import { Table } from 'reactstrap';
import { RoundRow } from './RoundRow'

interface GameTableProps {
    game: Game;
}

interface GameTableState {
}

export class GameTable extends React.Component<GameTableProps, GameTableState> {

    constructor(props: GameTableProps) {
        super(props);
    }

    public render() {
        return (
            <Table className="text-light">
                <thead>
                    <tr>
                        <th>#</th>
                        {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player, index) => (
                            <th>{player.participant.user.name}</th>
                        ))}
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {this.props.game.rounds.sort((r1, r2) => { return r1.roundNumber > r2.roundNumber ? 1 : -1}).map((round) => {
                        return <RoundRow key={round.id} round={round} players={this.props.game.players} />
                    })}
                </tbody>
            </Table>
        );
    }
}