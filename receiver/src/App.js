import React, {Component} from 'react';
import './App.css';

const blankState = {
	loading: true,
	error: false,
	prev: 0,
	current: 0,
	next: 0,
	photos: []
};

class App extends Component {
	constructor() {
		super();

		this.timer = null;
		this.state = blankState;
	}

	componentDidMount() {
		const url = 'https://hello.indyhall.org/wp-admin/admin-ajax.php?action=galahad_photo_wall_get_photos';
		fetch(url).then((res) => res.json()).then((json) => {
			console.log(json);

			if (!json.success) {
				throw new Error();
			}

			this.setState({
				...this.state,
				loading: false,
				photos: json.data.filter(data => data.photo && 'false' !== data.photo)
			});

			this.timer = setInterval(() => this.tick(), 10000);

		}).catch((e) => {
			this.setState({
				...blankState,
				loading: false,
				error: true
			});
		});
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick() {
		this.setState({
			...this.state,
			prev: this.state.current,
			current: this.next(this.state.current)
		});
	}

	next(i) {
		var next = i + 1;
		if (!this.state.photos[next]) {
			next = 0;
		}
		return next;
	}

	render() {
		if (true === this.state.loading) {
			return <div className="loading">Loading...</div>;
		}

		if (true === this.state.error) {
			return <div className="error">Error</div>;
		}
		
		const { prev, current, photos } = this.state;
		const prevPhoto = photos[prev];
		const photo = photos[current];
		
		return (
			<div className="app">
				<div className="photo prev out" key={prevPhoto.ID}>
					<img src={prevPhoto.photo} alt={prevPhoto.display_name} />
					<h1 className="caption out">{prevPhoto.display_name}</h1>
				</div>
				<div className="photo current" key={photo.ID}>
					<img src={photo.photo} alt={photo.display_name} />
					<h1 className="caption">{photo.display_name}</h1>
				</div>
			</div>
		);
	}
}

export default App;
