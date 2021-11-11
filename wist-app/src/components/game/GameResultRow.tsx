import * as React from 'react'
import { Player, Round, Bet, GameStatus, RoundStatus, Game, GamePoints } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary'
import { getApi } from '../api/ApiFactory'
import { Loader } from '../Loader'

interface GameResultProps {
    game: Game;
}

interface GameResultState {
    result: IDictionary<GamePoints>;
    loading: boolean;
}

export class GameResultRow extends React.Component<GameResultProps, GameResultState> {

    constructor(props: GameResultProps) {
        super(props);

        this.state = {
            result: new Dictionary<GamePoints>(),
            loading: true
        }
    }

    public async componentDidMount() {
        await this.getData();
    }

    public async componentWillReceiveProps(nextProps: GameResultProps) {
        await this.getData();
    }

    public render() {
        let contents = this.state.loading
            ? <td><Loader /></td>
            : this.renderResults()

        return (
            <tr>
                <td />
                { contents }
            </tr>
        );
    }

    private renderResults() {
        return (
            <React.Fragment>
                {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player) => {
                    return <td key={player.id}>{this.state.result.get(player.id).points}</td>
                })}
            </React.Fragment>
        );
    }

    private async getData() {
        const gameResult = await getApi().getGameResults(this.props.game.id);
        let stateDate = Dictionary.convert<GamePoints>(gameResult);
        this.setState({ result: stateDate, loading: false });
    }
}