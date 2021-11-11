import * as React from 'react'
import { IDictionary, Dictionary } from '../../typings/Dictionary'
import { Player } from "../../typings/index"
import { getApi } from './../api/ApiFactory'

interface GameOrderProps {
    players: Player[];
    gameId: string;
    reload: () => void;
}

interface GameOrderState {
}

export class GameOrder extends React.Component<GameOrderProps, GameOrderState> {

    private data: IDictionary<number> = new Dictionary<number>();

    constructor(props: GameOrderProps) {
        super(props);
    }

    public render() {
        return (
            <div className="col-lg">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="firstHand" >První rozdávající (neboli pochcanej)</label>
                    </div>
                    <select className="custom-select" id="firstHand" onChange={(e) => this.selected(1, e)}>
                        <option selected>---</option>
                        {this.props.players.map((player, index) => {
                            return <option value={player.id}>{player.participant.user.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="secondHand" >Druhý rozdávající</label>
                    </div>
                    <select className="custom-select" id="secondHand" onChange={(e) => this.selected(2, e)}>
                        <option selected>---</option>
                        {this.props.players.map((player, index) => {
                            return <option value={player.id}>{player.participant.user.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="thirdHand" >Třetí rozdávající</label>
                    </div>
                    <select className="custom-select" id="thirdHand" onChange={(e) => this.selected(3, e)}>
                        <option selected>---</option>
                        {this.props.players.map((player, index) => {
                            return <option value={player.id}>{player.participant.user.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="fourthHand">Čtvrtý rozdávající (neboli taky pochcanej)</label>
                    </div>
                    <select className="custom-select" id="fourthHand" onChange={(e) => this.selected(4, e)}>
                        <option selected>---</option>
                        {this.props.players.map((player, index) => {
                            return <option value={player.id}>{player.participant.user.name}</option>
                        })}
                    </select>
                </div>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.submit()}>Potvrdit a začít hrát</button>
            </div>
        );
    }

    private selected(selector: number, e: any) {
        if (this.data.getKeys().filter(v => v == e.target.value).length != 0) {
            alert("Ten už rozdává");
            return;
        }

        this.data.put(e.target.value, selector);
    }

    private async submit() {
        await getApi().setGameOrder(this.data, this.props.gameId);
        this.props.reload();
    }
}