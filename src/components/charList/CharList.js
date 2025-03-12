import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component 
{

    constructor(props)
    {
        super(props);
    }

    state =
    {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    activeRef = null;
    marvelService = new MarvelService();


    componentDidMount()
    {
        this.onRequest();
    }

    onError = () =>
    {
        this.setState({
            loading: false,
            error: true,
        })
    }

    onCharsLoaded = (newChars) =>
    {
        let ended = false;
        if (newChars.length < 9)
        {
            ended = true;
        }

        this.setState(({chars, offset}) => (
            {chars : [...chars, ...newChars], 
                loading : false, 
                newItemLoading: false, 
                offset: offset + 9,
                charEnded: ended}));        
    }

    getChars()
    {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService.getAllCharacters().then(this.onCharsLoaded).catch(this.onError)
    }

    onRequest = (offset) =>
    {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset).then(this.onCharsLoaded).catch(this.onError);
    }

    onCharListLoading = () =>
    {
        this.setState({newItemLoading: true});
    }

   

    

    makeActive = e =>
    {
        if(this.activeRef !== null)
        {
            this.activeRef.classList.remove("char__item_selected");
        }

        e.currentTarget.classList.add("char__item_selected");
        this.activeRef = e.currentTarget;
    }

    render()
    {
        let {chars, loading, error, newItemLoading, offset, charEnded} = this.state;
        let charsArr = null;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;

        if (!loading)
        {
            charsArr = chars.map(item =>
            {
                let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                    imgStyle = {'objectFit' : 'unset'};
                }
                return (
                    <li key={item.id} className="char__item" onClick={(e) =>{ this.makeActive(e); this.props.onCharSelected(item.id);}}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                )
            })
        }
        
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {charsArr}
                </ul>
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{display: charEnded ? 'none' : 'block'}}
                        onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;