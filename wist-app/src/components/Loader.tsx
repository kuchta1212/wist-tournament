import * as React from 'react';
import card from './../images/card.svg';
import './Loader.css';

interface LoaderProps {

}

export class Loader extends React.Component<LoaderProps> {

    constructor(props: LoaderProps) {
        super(props);
    }

    public render() {
        return (
            <div className="loader">
                <img src={card} className="loader-logo" alt="loader" />
            </div>)
    }
}