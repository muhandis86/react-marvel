import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

import './singleCharLayout.scss';

const SingleCharLayout = ({ data }) => {

    const { name, description, thumbnail } = data;
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="single-char">
            <Helmet>
                <meta
                    name="description"
                    content={`${name} page`}
                />
                <title>{name}</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-char__img" />
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
            <Link onClick={goBack} className="single-char__back">Go back</Link>
        </div>
    )
}

export default SingleCharLayout;