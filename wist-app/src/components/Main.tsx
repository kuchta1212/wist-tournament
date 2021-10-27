import * as React from 'react';
import logo from './card.svg';
import './../App.css';
import { Rank } from './UserRank'

interface MainPageProps {

}

export class Main extends React.Component<MainPageProps> {

    constructor(props: MainPageProps) {
        super(props);
    }

    public render() {
        return (
            <div className="container body-content">
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Wistový GrandSlam <code>19.11 2021 18:00</code> Veselý Králíček
                    </p>
                </header>
                </div>
                {/*<Rank />*/}
            </div>
        );
    }
}