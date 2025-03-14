import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';

class CharInfo extends Component
{

    state =
    {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    updateChar = () =>
    {
        const {charId} = this.props;
        if (!charId)
        {
            return;
        }
        this.onCharLoading();
        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
    } 

    onCharLoaded = (char) =>
    {
        this.setState({char : char, loading : false})
    }

    componentDidMount()
    {
        this.updateChar();
        //this.timerId = setInterval(this.updateChar, 300000);      
    }

    componentDidUpdate(prevProps, prevState)
    {
        if (this.props.charId !== prevProps.charId)
        {
            this.updateChar();            
        }
    }
    
    componentDidCatch(err, info)
    {
        this.setState({error: true});
    }

    // componentWillUnmount()
    // {
    //     //clearInterval(this.timerId);
    // }

    onError = () =>
    {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoading = () =>
    {
        this.setState({
            loading: true
        })
    }

    
    
    render()
    { 
        const {char, loading, error} = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;

        const content = !(loading || error || !char) ? <View char = {char} /> : null; 

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }    
}

const View = ({char}) =>
{
    let {name, description, thumbnail, homepage, wiki, comics} = char;

    if (comics.length < 1)
    {
        comics = "No comics"
    }
    else if (comics.length > 10)
    {
        comics = comics.map((item, i) =>
            {
                return (
                    <li key={i} className="char__comics-item">
                        {item.name}
                    </li>
                )
            }).slice(0, 10);
    }
    

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics}                
            </ul>
        </>
    )
}

export default CharInfo;