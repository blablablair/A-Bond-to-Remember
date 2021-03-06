import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomePage, MoviesPage, FavouritesPage } from './pages';
import { Sidebar } from './components';
import { updateSelectedMovie } from './data/SessionStorageWriter';
import { checkSelectedMovie } from './data/SessionStorageReader';
import { updateCustomMovies, updateFavouriteMovies } from './data/LocalStorageWriter';
import { checkCustomMovies, checkFavouriteMovies } from './data/LocalStorageReader';
import movies from './data/movies.json';

const intitalCustomMovies = checkCustomMovies();
const initialMoviesList = movies['Bond Films'].concat(intitalCustomMovies);
const initialActorsList = [...new Set(initialMoviesList.map((movie) => movie['Bond Actor']))];

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			actorsList: initialActorsList,
			actorFilter: 'None',
			createModalIsOpen: false,
			currentFilter: 'None',
			customMovies: intitalCustomMovies,
			dateFilter: {
				from: '',
				to: '',
			},
			detailsModalIsOpen: Object.keys(checkSelectedMovie()).length !== 0,
			favouriteMovieTitles: checkFavouriteMovies(),
			moviesList: initialMoviesList,
			selectedMovieDetails: checkSelectedMovie(),
		};
	}

	createMovieOnClickHandler = (newMovie) => {
		const newCustomMoviesList = this.state.customMovies.concat(newMovie);
		const newMoviesList = movies['Bond Films'].concat(newCustomMoviesList);
		const newActorsList = this.state.actorsList;
		newActorsList.push(newMovie['Bond Actor']);
		const noDupesNewActorsList = [...new Set(newActorsList)];
		this.setState(() => ({
			actorsList: noDupesNewActorsList,
			customMovies: newCustomMoviesList,
			moviesList: newMoviesList,
		}));
		this.closeCreateOnClickHandler();
		updateCustomMovies(newCustomMoviesList);
	};

	closeCreateOnClickHandler = () => {
		this.setState(() => ({ createModalIsOpen: false }));
	};

	closePreviewOnClickHandler = () => {
		this.setState(() => ({ detailsModalIsOpen: false, selectedMovieDetails: {} }));
		updateSelectedMovie({});
	};

	filterDateOnChangeHandler = (value, isFrom) => {
		const updatedDateFilter = Object.assign({}, this.state.dateFilter);
		updatedDateFilter[isFrom ? 'from' : 'to'] = value;
		this.setState(() => ({ dateFilter: updatedDateFilter }));
	};

	filterActorOnChangeHandler = (event) => {
		this.setState(() => ({ actorFilter: event.target.value }));
	};

	filterSelectOnChangeHandler = (event) => {
		this.setState(() => ({ currentFilter: event.target.value }));
	};

	openCreateOnClickHandler = () => {
		this.setState(() => ({ createModalIsOpen: true }));
	};

	openPreviewOnClickHandler = (movie) => {
		this.setState(() => ({ detailsModalIsOpen: true, selectedMovieDetails: movie }));
		updateSelectedMovie(movie);
	};

	toggleFavouriteMovie = (movie) => () => {
		const isFavourite = this.state.favouriteMovieTitles.includes(movie);
		const currentFaves = [...this.state.favouriteMovieTitles];

		let newFaves;
		if (isFavourite) {
			newFaves = currentFaves.filter((favouriteMovie) => favouriteMovie !== movie);
		} else {
			currentFaves.push(movie);
			newFaves = [...currentFaves];
		}
		this.setState({ favouriteMovieTitles: newFaves });
		updateFavouriteMovies(newFaves);
	};

	render() {
		const {
			actorsList,
			actorFilter,
			createModalIsOpen,
			currentFilter,
			dateFilter,
			detailsModalIsOpen,
			favouriteMovieTitles,
			moviesList,
			selectedMovieDetails,
		} = this.state;
		return (
			<Router>
				<Sidebar />
				<Switch>
					<Route path="/" exact component={() => <HomePage />} />
					<Route
						path="/movies"
						exact
						component={() => (
							<MoviesPage
								actorFilter={actorFilter}
								actorsList={actorsList}
								closeCreateOnClickHandler={this.closeCreateOnClickHandler}
								closePreviewOnClickHandler={this.closePreviewOnClickHandler}
								createMovieOnClickHandler={this.createMovieOnClickHandler}
								createModalIsOpen={createModalIsOpen}
								currentFilter={currentFilter}
								dateFilter={dateFilter}
								detailsModalIsOpen={detailsModalIsOpen}
								favouriteMovieTitles={favouriteMovieTitles}
								filterActorOnChangeHandler={this.filterActorOnChangeHandler}
								filterDateOnChangeHandler={this.filterDateOnChangeHandler}
								filterSelectOnChangeHandler={this.filterSelectOnChangeHandler}
								moviesList={moviesList}
								openCreateOnClickHandler={this.openCreateOnClickHandler}
								openPreviewOnClickHandler={this.openPreviewOnClickHandler}
								selectedMovieDetails={selectedMovieDetails}
								toggleFavouriteMovieOnClick={this.toggleFavouriteMovie}
							/>
						)}
					/>
					<Route
						path="/favourites"
						exact
						component={() => (
							<FavouritesPage
								closePreviewOnClickHandler={this.closePreviewOnClickHandler}
								favouriteMovieTitles={favouriteMovieTitles}
								detailsModalIsOpen={detailsModalIsOpen}
								moviesList={moviesList}
								openPreviewOnClickHandler={this.openPreviewOnClickHandler}
								selectedMovieDetails={selectedMovieDetails}
								toggleFavouriteMovieOnClick={this.toggleFavouriteMovie}
							/>
						)}
					/>
				</Switch>
			</Router>
		);
	}
}

export { App };
