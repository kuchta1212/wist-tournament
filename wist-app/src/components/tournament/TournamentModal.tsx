import * as React from 'react';
import { Link } from 'react-router-dom';
import { getApi } from "./../api/ApiFactory"
import { Rank } from './../UserRank'

interface TournamentModalProps {
    close: () => void;
    add: () => void;
}

interface TournamentModalState {
    send: boolean;
    name: string;
    selectedUsers: string[];
}

export class TournamentModal extends React.Component<TournamentModalProps, TournamentModalState> {

    constructor(props: TournamentModalProps) {
        super(props);

        this.state = {
            send: false,
            name: "",
            selectedUsers: []
        };
    }

    public render() {
        const cardBody = this.state.send
            ? this.renderSend()
            : this.renderNotSend();

        return (
            <div>
                {cardBody}
            </div>
        );
    }

    private renderSend() {
        return (
            <div>
                <h5 className="card-title">Turnaj přidán</h5>
                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={() => this.props.close()}>Zavřít</button>
            </div>
        );
    }

    private renderNotSend() {
        return (
            <div className="row">
                <h5>Přidat turnaj</h5>
                <input type="text" className="form-control" placeholder="Jméno turnaje" value={this.state.name} onChange={(event) => this.setTournamentName(event.target.value)} aria-label="" aria-describedby="basic-addon1" />
                <Rank selectAllPosibility={true} clickable={true} userSelected={this.userSelected.bind(this)} usersSelected={this.usersSelected.bind(this)} />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.createTournament()}>Vytvořit</button>
                <Link to={`/tournament/manual-create`} type="button" className="btn btn-primary btn-lg btn-block">Vytvořit manuálně</Link>
                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={ () => this.props.close()}>Zrušit</button>
            </div>
        );
    }

    private usersSelected(ids: string[], added: boolean) {
        if (added) {
            this.setState({ selectedUsers: this.state.selectedUsers.concat(ids) });

        } else {
            this.setState({ selectedUsers: [] });
        }
    }

    private userSelected(id: string, added: boolean) {
        if (added) {
            this.setState({ selectedUsers: this.state.selectedUsers.concat([id]) });
            
        } else {
            this.setState({
                selectedUsers: this.state.selectedUsers.filter(function (selectedUser) {
                    return selectedUser !== id
                })
            });
        }
    }

    private async createTournament() {
        if (this.state.name === "") {
            alert("Vyplň jméno");
            return;
        }

        if (this.state.selectedUsers.length < 1) {
            alert("Přidej hráče");
            return;
        }

        await getApi().createTournament(this.state.name, this.state.selectedUsers);
        this.setState({ send: true });
        this.props.add();
    }

    private setTournamentName(name: string) {
        this.setState({ name: name });
    }
}