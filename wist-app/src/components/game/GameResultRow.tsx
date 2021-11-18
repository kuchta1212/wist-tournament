import * as React from 'react'
import { Player, Round, Bet, GameStatus, RoundStatus, Game } from "../../typings/index"
import { Dictionary, IDictionary } from '../../typings/Dictionary'
import { getApi } from '../api/ApiFactory'
import { Loader } from '../Loader'

interface GameResultProps {
    game: Game;
    showResultRow: boolean;
}

interface GameResultState {
    result: IDictionary<number>;
    places: IDictionary<number>;
    loading: boolean;
    finished: boolean;
}

export class GameResultRow extends React.Component<GameResultProps, GameResultState> {

    constructor(props: GameResultProps) {
        super(props);

        this.state = {
            result: new Dictionary<number>(),
            places: new Dictionary<number>(),
            loading: true,
            finished: this.props.game.status == GameStatus.finished
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
            <React.Fragment>
                <tr>
                    <td />
                    { contents }
                </tr>
                {this.props.showResultRow
                    ? this.renderResultRow()
                    : null}
            </React.Fragment>
        );
    }

    private renderResultRow() {
        return (
            <tr>
                <td />
                {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player) => {
                    return <td key={player.id} className={this.getResultRowClass(this.state.places.get(player.id))}>{this.state.places.get(player.id)}</td>
                })}
                {!this.state.finished
                    ? <td><button type="button" className="btn btn-primary" onClick={() => this.confirmGame()}>Potvrdit výsledek</button></td>
                    : <td />
                }
            </tr>
        );
    }

    private getResultRowClass(place: number): string {
        switch (place) {
            case 1: return "bg-success";
            case 2: return "bg-warning";
            case 3: return "bg-info";
            case 4: return "bg-danger";
        }

        return "";
    }

    private renderResults() {
        return (
            <React.Fragment>
                {this.props.game.players.sort((p1, p2) => { return p1.gameRank > p2.gameRank ? 1 : -1 }).map((player) => {
                    return <td key={player.id}>{this.state.result.get(player.id)}</td>
                })}
            </React.Fragment>
        );
    }

    private async getData() {
        const gameResult = await getApi().getGameResults(this.props.game.id);
        let stateDate = Dictionary.convert<number>(gameResult);
        if (this.props.showResultRow) {
            const gamePlaces = await getApi().getGamePlaced(this.props.game.id);
            let statePlaces = Dictionary.convert<number>(gamePlaces);
            this.setState({ result: stateDate, places: statePlaces, loading: false });
        } else {
            this.setState({ result: stateDate, loading: false });
        }
    }

    private async confirmGame() {
        await getApi().finishGame(this.props.game.id);
        this.setState({ finished: true });
    }
}