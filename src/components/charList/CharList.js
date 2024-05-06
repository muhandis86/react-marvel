import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequestMore(offset, true);
    }, []);

    const onRequestMore = (offset, initial) => {
        initial ? setRequestLoading(false) : setRequestLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = async (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (let char of newCharList) {
            await delay(350);
            setCharList(charList => [...charList, char]);
        }

        // setCharList(charList => [...charList, ...newCharList]);
        setRequestLoading(requestLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
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
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        className="char__item"
                        key={item.id}
                        tabIndex={0}
                        onKeyDown={(e) => selectCharByKey(e, item.id)}
                        onClick={() => props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        })

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !requestLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
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