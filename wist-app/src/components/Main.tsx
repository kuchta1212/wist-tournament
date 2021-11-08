import * as React from 'react';
import logo from './card.svg';
import './../App.css';
import { Rank } from './UserRank'
import { TournamentList } from './tournament/TournamentList'

interface MainPageProps {

}

export class Main extends React.Component<MainPageProps> {

    constructor(props: MainPageProps) {
        super(props);
    }

    public render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <TournamentList />
                    </div>
                    <div className="col-lg-2">
                        <Rank selectAllPosibility={false} clickable={false} userSelected={(id, added) => { return; }} />
                    </div>
                </div>
            </div>
        );
    }
}