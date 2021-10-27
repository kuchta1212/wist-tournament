import * as React from 'react';
import card from './card.svg';
import './Loader.css';

interface LoaderProps {

}

export class Loader extends React.Component<LoaderProps> {

    constructor(props: LoaderProps) {
        super(props);
    }

    public render() {
        return (
            <header className="App-header">
                <img src={card} className="Loader-logo" alt="loader" />
            </header>)
    }
}