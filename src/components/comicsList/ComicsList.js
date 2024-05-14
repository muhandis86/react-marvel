import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const setContent = (process, Component, requestLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return requestLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state')
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { process, setProcess, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequestMore(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequestMore = (offset, initial) => {
        initial ? setRequestLoading(false) : setRequestLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setRequestLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {

            return (
                <li className="comics__item" key={i} tabIndex={0}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), requestLoading)}
            <button className="button button__main button__long"
                disabled={requestLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequestMore(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;