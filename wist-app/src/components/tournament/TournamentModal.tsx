import * as React from 'react';
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
                <input type="text" className="form-control" placeholder="Jméno turnaje" value={this.state.name != "" ? this.state.name : "Jméno turnaje"} onChange={(event) => this.setTournamentName(event.target.value)} aria-label="" aria-describedby="basic-addon1" />
                <Rank clickable={true} userSelected={this.userSelected.bind(this)} />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.createTournament()}>Vytvořit</button>
                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={ () => this.props.close()}>Zrušit</button>
            </div>
        );
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

    private createTournament() {
        if (this.state.name === "") {
            alert("Vyplň jméno");
            return;
        }

        if (this.state.selectedUsers.length < 1) {
            alert("Přidej hráče");
            return;
        }

        this.setState({ send: true });
        getApi().createTournament(this.state.name, this.state.selectedUsers).then(() => {
            alert("done");
            this.props.add();
        });
    }

    private setTournamentName(name: string) {
        this.setState({ name: name });
    }
}