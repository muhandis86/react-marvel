import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequestMore();
        // eslint-disable-next-line
    }, []);

    const onRequestMore = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setRequestLoading(requestLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onCharListLoading = () => {
        setRequestLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    const selectCharByKey = (event, id) => {
        if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            props.onCharSelected(id);
        }
        if (event.key === 'Escape') {
            event.target.blur();
        }
    }

    function renderItems(arr) {
        const items = arr.map(item => {
            const isImg = item.thumbnail.includes('image_not_available') ? true : false;
            const imgStyle = isImg ? { objectFit: 'contain' } : null;

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    onKeyDown={(e) => selectCharByKey(e, item.id)}
                    onClick={() => props.onCharSelected(item.id)}>
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

    const items = renderItems(charList);
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
                onClick={() => onRequestMore(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;