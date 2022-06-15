import * as React from 'react';
import { GameType, Tournament, TournamentStatus, User } from "../../typings/index"
import { getApi } from './../api/ApiFactory';
import { Loader } from './../Loader'
import { GameList } from './../game/GameList'
import { RouteComponentProps } from 'react-router-dom';
import { Rank } from './../UserRank'
import { TournamentLive } from './TournamentLive';
import { Link } from 'react-router-dom';

enum TournamentCreateState {
    init,
    tables
}

interface TournamentManualCreateParams {

}

interface TournamentManualCreateState {
    name: string,
    numOfTables: number,
    tables: Array<Array<string>>,
    users: User[],
    state: TournamentCreateState
}

export class TournamentManualCreate extends React.Component<RouteComponentProps<TournamentManualCreateParams>, TournamentManualCreateState> {

    constructor(props: RouteComponentProps<TournamentManualCreateParams>) {
        super(props);

        this.state = {
            users: {} as User[],
            name: "",
            numOfTables: 0,
            tables: [],
            state: TournamentCreateState.init
        }
    }

    public async componentDidMount() {
        await this.getData();
    }

    public render() {
        const content = this.state.state == TournamentCreateState.init
            ? this.renderInit()
            : this.renderTableSelection();

        return (
            <div className="text-light">
                {content}
            </div>
        );
    }

    public renderInit() {
        return (
            <div className="row">
                <div className="form-group col">
                    <label htmlFor="InputTournamentName">Jméno turnaje:</label>
                    <input id="InputTournamentName" type="text" className="form-control col" placeholder="Jméno turnaje" value={this.state.name} onChange={(event) => this.setTournamentName(event.target.value)} aria-label="" aria-describedby="basic-addon1" />
                </div>
                <div className="form-group col">
                    <label className="col" htmlFor="InputTableCount">Počet stolů:</label>
                    <input id="InputTableCount" type="number" min="0" className="form-control col" placeholder="Počet stolů" value={this.state.numOfTables} onChange={(event) => this.setTableCount(event.target.value)} aria-label="" aria-describedby="basic-addon1" />
                </div>
                <br />
                <br />
                <br />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.createTables()}>Pokračovat</button>
            </div>
        );
    }

    public renderTableSelection() {
        return (
            <div className="col">
                <div className="row">
                    {this.state.tables.map((table, index) => (
                        <div id={"table-" + index} className="card tournament-box bg-secondary col">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-dark">{index+1}. stůl</h6>
                                {this.renderPlayers(table, index)}
                            </div>
                        </div>
                    ))}
                </div>
                <br />
                <br />
                <br />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.createTournament()}>Spustit</button>
            </div>
        );
    }

    //private renderDropdowns(table: string[], tableNumber: number) {
    //    const selectedPlayersCount = table.length;
    //    const remainToSelect = 4 - selectedPlayersCount;

    //    let emptySelects: number[] = [];
    //    for (var i = 0; i < remainToSelect; i++) {
    //        emptySelects.push(i)
    //    }

    //    return this.renderPlayers(table, emptySelects, tableNumber);
    //}

    private renderPlayers(playerIds: string[], tableNumber: number) {
        return (
            <div className="col">
                <select id={"select-" + tableNumber + "-" + 0} className="form-select" onChange={(event) => this.userSelected(event.target.value, tableNumber, 0)}>
                    <option id="option-placeholder-0" selected>Vyber hráče</option>
                    {this.state.users.map((user) => (
                        <option id={"option-0" + user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <select id={"select-" + tableNumber + "-" + 1} className="form-select" onChange={(event) => this.userSelected(event.target.value, tableNumber, 1)}>
                    <option id="option-placeholder-1" selected>Vyber hráče</option>
                    {this.state.users.map((user) => (
                        <option id={"option-1" + user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <select id={"select-" + tableNumber + "-" + 2} className="form-select" onChange={(event) => this.userSelected(event.target.value, tableNumber, 2)}>
                    <option id="option-placeholder-2" selected>Vyber hráče</option>
                    {this.state.users.map((user) => (
                        <option id={"option-2" + user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <select id={"select-" + tableNumber + "-" + 3} className="form-select" onChange={(event) => this.userSelected(event.target.value, tableNumber, 3)}>
                    <option id="option-placeholder-3" selected>Vyber hráče</option>
                    {this.state.users.map((user) => (
                        <option id={"option-3" + user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
        );
    }

    private userSelected(id: string, tableNumber: number, playerNumber: number) {
        //check that user is not selected on same table
        for (let table of this.state.tables) {
            if (!!table.find(pId => pId === id)) {
                alert("Hráč už je na jiném stole");
                return;
            }
        }

        const newTables = this.state.tables;
        newTables[tableNumber][playerNumber] = id;

        this.setState({ tables: newTables });
    }


    private setTournamentName(name: string) {
        this.setState({ name: name });
    }

    private setTableCount(num: string) {
        this.setState({ numOfTables: parseInt(num) });
    }

    private createTables() {
        if (this.state.name == "") {
            alert("Vyplň jméno");
            return;
        }

        if (this.state.numOfTables == 0) {
            alert("Počet stolů musí být větší než 0");
            return;
        }

        let tables = new Array<Array<string>>();
        for (let i = 0; i < this.state.numOfTables; i++) {
            let table = new Array<string>();
            table.push("");
            table.push("");
            table.push("");
            table.push("");
            tables.push(table);
        }

        this.setState({ state: TournamentCreateState.tables, tables: tables })
    }

    private createTournament() {
        for (let table of this.state.tables) {
            if (table.some(pId => pId === "")) {
                alert("Ne všechny skupiny jsou vyplněny");
                return;
            }
        }

        getApi().createTournamentManual(this.state.name, this.state.tables).then(
            () => { this.props.history.push('/')},
            error => { console.log(error) }
        );
    }


    private async getData() {
        const users = await getApi().getUsers();
        this.setState({ users: users });
    }
}