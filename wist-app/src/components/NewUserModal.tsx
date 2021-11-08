import * as React from 'react';
import { getApi } from "./api/ApiFactory"

interface NewUserModalProps {
    close: () => void;
    add: () => void;
}

interface NewUserModalState {
    send: boolean;
    name: string;
}

export class NewUserModal extends React.Component<NewUserModalProps, NewUserModalState> {

    constructor(props: NewUserModalProps) {
        super(props);

        this.state = {
            send: false,
            name: "",
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
                <h5 className="card-title">Hráč přidán</h5>
                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={() => this.props.close()}>Zavřít</button>
            </div>
        );
    }

    private renderNotSend() {
        return (
            <div className="row">
                <h5>Přidat hráče</h5>
                <input type="text" className="form-control" placeholder="Jméno hráče" value={this.state.name} onChange={(event) => this.setTournamentName(event.target.value)} aria-label="" aria-describedby="basic-addon1" />
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.createUser()}>Vytvořit</button>
                <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={() => this.props.close()}>Zrušit</button>
            </div>
        );
    }

    private async createUser() {
        if (this.state.name === "") {
            alert("Vyplň jméno");
            return;
        }

        this.setState({ send: true });
        await getApi().createUser(this.state.name);
        this.props.add();
    }

    private setTournamentName(name: string) {
        this.setState({ name: name });
    }
}