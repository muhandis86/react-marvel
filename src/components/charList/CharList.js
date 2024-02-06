import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        requestLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequestMore();
    }

    onRequestMore = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            requestLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({
            requestLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    selectCharByKey = (event, id) => {
        if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
            this.props.onCharSelected(id);
        }
        if (event.key === 'Escape') {
            event.target.blur();
        }
    }

    renderItems(arr) {
        const items = arr.map(item => {
            const isImg = item.thumbnail.includes('image_not_available') ? true : false;
            const imgStyle = isImg ? { objectFit: 'contain' } : null;

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    onKeyDown={(e) => this.selectCharByKey(e, item.id)}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, offset, requestLoading, charEnded } = this.state;

        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={requestLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequestMore(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;