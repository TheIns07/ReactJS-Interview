import './App.css';
import { useState, useEffect, useRef } from "react"
import { getCharacter, getPeople, searchCharacter } from './api/people';
import { Box, Button, Card, CardContent, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import InputUnstyled from '@mui/base/InputUnstyled';


function App() {
  const [people, setPeople] = useState([])
  const [errorState, setErrorState] = useState({ hasError: false })
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
    setErrorState({ hasError: true, message: err.message })
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
    if (!people.previous && page + next <= 0) return;
    if (![people.next && page + next >= 9]) return;
    setpage(page + next);
  }


  return (
    <Box sx={{
      width: 700,
      height: 600,
      border: '5px black'
    }}
    >



      <Card sx={{ maxWidth: 675 }}>
        <Stack direction="row" spacing={2}>

          <CardContent>

            <List
              sx={{
                width: '100%',
                maxWidth: 760,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {errorState.hasError && <div>{errorState.message}</div>}

              {people?.results?.map((character) => (
                <ListItem key={character.name}>
                  <ListItemText primary={character.name} onClick={showDetails} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <Stack direction="column">
          <CardContent>
            {details && (
              //Search Conditionals
              //Search Aside
              <aside>
                <Typography variant="h3">Personal Data</Typography>
                <Typography variant="h4">Name: {details.name}</Typography>
                <Typography variant="h4"> Weigth: {details.mass}</Typography>
                <Typography variant="h4">Height: {details.height}</Typography>
              </aside>
            )}
          </CardContent>
          <Stack direction="row" spacing={4} justifyContent="center"
            alignItems="center">
            <Typography variant="h5">Search Bar</Typography>
            <input id="searchBar" ref={inputSearch}
              //search for ONCHANGE
              onChange={onChangeTextSearch}
              onKeyDown={onSearchSubmit}
              type="text"
              placeholder='Search a Character' />
          </Stack>
          </Stack>
        </Stack>
      </Card>


      <Box sx={{
        width: 600,
        height: 100
      }}>


        <Stack direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}>
          <Button variant="contained" onClick={() => onChangePage(-1)}>Prev</Button>
          <Typography variant="h4" component="h2">{page}</Typography>
          <Button variant="contained" onClick={() => onChangePage(+1)}>Next</Button>
        </Stack>
      </Box>




    </Box>
  );
}

export default App;
