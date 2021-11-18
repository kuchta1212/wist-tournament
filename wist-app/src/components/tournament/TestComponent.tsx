import * as React from 'react'
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

interface TestComponentProps {

}

interface TestComponentState {
    message: string,
    hubConnection: any
}

export class TestComponent extends React.Component<TestComponentProps, TestComponentState> {
    constructor(props: TestComponentProps) {
        super(props);

        this.state = {
            message: 'Default one',
            hubConnection: null,
        };
    }

    public async componentDidMount() {
        const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44340/hubs/notifications").build();

        this.setState({ hubConnection: hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log("Connection set up"))
                .catch(err => console.log("Error:" + err));

            this.state.hubConnection.on("GameUpdate", (message) => {
                console.log(message);
                this.setState({ message: message })
            });
        });
    }

    public render() {
        return <div>{this.state.message}</div>;
    }
}
