import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';

import "./charSearchForm.scss";

const setContent = (process, Component, data, charNotFinded) => {
    switch (process) {
        case 'waiting':
            return;
            break;
        case 'loading':
            return;
            break;
        case 'confirmed':
            return !charNotFinded ? <Component data={data} /> : <CharNotFinded />;
            break;
        case 'error':
            return <ErrorMessage />;
            break;
        default:
            throw new Error('Unexpected process state')
    }
}

const CharSearchForm = () => {

    const [char, setChar] = useState(null);
    const [charNotFinded, setCharNotFinded] = useState(false);

    const { process, setProcess, getCharacterByName, clearError } = useMarvelService();

    const updateChar = (name) => {
        clearError();
        getCharacterByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        if (!char) {
            setCharNotFinded(true);
        } else {
            setChar(char);
            setCharNotFinded(false);
        }
    }

    return (
        <Formik
            initialValues={{
                charName: ''
            }}
            validationSchema={Yup.object({
                charName: Yup.string().required('This field is required')
            })}
            onSubmit={values => updateChar(values.charName)}
        >

            <Form className='char__form'>
                <label htmlFor="charName">Or find a character by name:</label>
                <div className="char__form-search">
                    <Field
                        className="char__form-input"
                        name="charName"
                        type="text"
                        placeholder="Enter Name"
                    />
                    <button
                        type="submit"
                        className="button button__main"
                    >
                        <div className="inner">find</div>
                    </button>
                </div>
                <ErrorMessage className='char__form-error' name='charName' component="div" />
                {setContent(process, CharFinded, char, charNotFinded)}
            </Form>
        </Formik>
    )
}

const CharFinded = ({ data }) => {

    const { name, id } = data;

    return (
        <div className='char__form-finded'>
            <p>There is! Visit {name} page? </p>
            <Link to={`/characters/${id}`}
                className="button button__secondary">
                <div className="inner">to page</div>
            </Link>
        </div>
    )
}

const CharNotFinded = () => {
    return (
        <div className='char__form-error'>
            The character was not found. Check the name and try again
        </div>
    )
}

export default CharSearchForm;