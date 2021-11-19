import * as React from 'react'
import { Game, RoundStatus, Round } from "../../typings/index"
import { Table } from 'reactstrap'
import { RoundRow } from './RoundRow'
import { GameResultRow } from './GameResultRow'
import { RoundRowLive } from './RoundRowLive'
import { HubConnectionBuilder } from '@aspnet/signalr';
import { getApi } from '../api/ApiFactory'
import { Loader } from '../Loader'

interface GameTableLiveProps {
    gameId: string;
}

interface GameTableLiveState {
    game: Game,
    loading: boolean,
    hubConnection: any
}

export class GameTableLive extends React.Component<GameTableLiveProps, GameTableLiveState> {

    constructor(props: GameTableLiveProps) {
        super(props);

        this.state = {
            game: {} as Game,
            loading: true,
            hubConnection: null
        }
    }

    public async componentDidMount() {
        const game = await getApi().getGame(this.props.gameId);
        //const hubConnection = new HubConnectionBuilder().withUrl("https://wist-grandslam.azurewebsites.net/hubs/notifications").build();
        const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44340/hubs/notifications").build();

        this.setState({ hubConnection: hubConnection, game: game, loading: false }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("Connection set up"))
                .catch(err => console.log("Error:" + err));

            this.state.hubConnection.on("GameUpdate", async (roundId) => {
                if (this.state.game.rounds.filter(g => g.id == roundId).length > 0) {
                    this.setState({ loading: true });
                    await this.getData();
                }
            });
        });
    }

    private async getData() {
        const game = await getApi().getGame(this.props.gameId);
        this.setState({ game: game, loading: false })
    }

    public render() {
        let contents = this.state.loading
            ? <Loader />
            : this.renderTable();

        return (
            <div className="col">
                {contents}
            </div>
        );
    }

    public renderTable() {
        return (
            <Table className="text-light table-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        {this.state.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player, index) => (
                            <th key={player.id}>{player.participant.user.name}</th>
                        ))}
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {this.state.game.rounds.filter(r => r.status != RoundStatus.notStarted).sort((r1, r2) => { return r1.roundNumber > r2.roundNumber ? 1 : -1 }).map((round) => {
                        return <RoundRowLive key={round.id} round={round} players={this.state.game.players} />
                    })}
                    <GameResultRow game={this.state.game} showResultRow={false} />
                </tbody>
            </Table>
        );
    }
}