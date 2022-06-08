import './App.css';
import {useState, useEffect, useRef} from "react"
import { getCharacter, getPeople, searchCharacter } from './api/people';

function App() {
  const [people, setPeople] = useState([])
  const [errorState, setErrorState] = useState({hasError: false})
  const [currentCharacter, setCurrentCharacter] = useState(1)
  const [details, setDetails] = useState({})
  const [page, setpage] = useState(1)


  const inputSearch = useRef(null)
  const [textSearch, setTextSearch] = useState("")


  useEffect(() => {
    getPeople(page).then(setPeople)
    .catch(handleError)
  }, [page])

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError)
  }, [currentCharacter])

  const handleError = (err) => {
    setErrorState({hasError: true, message: err.message})
  }

  const showDetails = (character) => {
    const id = Number(character.url.split("/").slice(-2)[0])
    setCurrentCharacter(id);
  }

  const onChangeTextSearch = (event) => {
    event.preventDefault();
    const text = inputSearch.current.value
    setTextSearch(text);
  }

  const onSearchSubmit = (event) => {
    if (event.key !== "Enter") return;

    inputSearch.current.value = "";
    setDetails({})
    searchCharacter(textSearch)
    .then((setPeople))
    .catch(handleError)
  }

  const onChangePage = (next) => {
    //Search Array methods
    if(!people.previous && page + next <= 0) return;
    if(![people.next && page + next >= 9]) return;
    setpage(page + next);
  }

  
  return (
    <>
    <input ref = {inputSearch} 
    //search for ONCHANGE
    onChange = {onChangeTextSearch} 
    onKeyDown = {onSearchSubmit} 
    type = "text" 
    placeholder='Search a Character'/>
    <ul>
      {errorState.hasError && <div>{errorState.message}</div>}
      {people?.results?.map((character) =>  (
       <li key = {character.name} onClick = {showDetails}>{character.name}</li>
     ))}
    </ul>

    <section>
      <button onClick = {() => onChangePage(-1)}>Prev</button>
      {page}
      <button onClick = {() => onChangePage(+1)}>Next</button>
    </section>
    
    {details && (
      //Search Conditionals
      //Search Aside
      <aside>
        <h1>Name: {details.name}</h1>
        <ul>
          <li>Weigth: {details.mass}</li>
          <li>Height: {details.height}</li>
          <li>Birth: {details.birth_year}</li>
        </ul>
      </aside>
    )}
    
    </>
  );
}

export default App;
