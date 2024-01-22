import img from './error.gif'

const ErrorMessage = () => {
    return (
        <img src={img}
            style={{ display: 'block', width: '200px', height: '200px', objectFit: 'contain', margin: '0 auto' }}
            alt="Error" />
    )
}

export default ErrorMessage;