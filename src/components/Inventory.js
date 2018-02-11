import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../Base';

class Inventory extends React.Component
{
	state = {
		uid: null,
		owner: null
	};

	componentDidMount()
	{
		base.onAuth((user) => {
			this.authHandler(null, {user});
		});
	}

	handleChange = (e, key) =>
	{
		const fish = this.props.fishes[key];
		// Copy the old fish data to the new one and update the entered information
		const updatedFish = {
			...fish, 
			[e.target.name]: e.target.value
		};

		this.props.updateFish(key, updatedFish);
	};

	renderLogin = () =>
	{
		return(
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="facebook" onClick={() => this.authenticate('google')}>Login with Google+</button>
			</nav>
		);
	};

	logout = () =>
	{
		base.unauth();
		this.setState({uid: null});
	};

	authenticate = (provider) =>
	{
		console.log(`Try to log in with ${provider}`);
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	authHandler = (err, authData) =>
	{
		console.log(authData);
		if (err)
		{
			console.error(err);
			return;
		}

		// grab the store info
		const storeRef = base.database().ref(this.props.storeId);
		// Query the firebase once for the store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			const uid = authData != null && authData.user != null ? authData.user.uid : null;

			// claim the store if there is no owner
			if (!data.owner)
			{
				storeRef.set({
					owner: uid,
					fishes: this.props.fishes
				});
			}

			this.setState({
				uid: uid,
				owner: data.owner || uid
			});
		});
	};

	renderInventory = (key) =>
	{
		const fish = this.props.fishes[key];

		return(
			<div className="fish-edit" key={key}>
			<input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
			<input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>
			<select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
				<option value="available">Fresh!</option>
				<option value="unavailable">Sold Out! </option>
			</select>
			<textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}/>
			<input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
			<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		);
	};

	render()
	{
		const logOut = <button onClick={ this.logout}>Log Out</button>;
		// check if the user is logged in
		if (!this.state.uid)
		{
			return <div>{this.renderLogin()}</div>;
		}

		// check if the user is the owner of this shop
		if (this.state.uid !== this.state.owner)
		{
			return (
				<div>
					<p>Sorry, you aren't the owner of this store!</p>
					{logOut}
				</div>
			);
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logOut}<br/><br/>
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}

	static propTypes = {
		fishes: React.PropTypes.object.isRequired,
		loadSamples: React.PropTypes.func.isRequired,
		addFish: React.PropTypes.func.isRequired,
		removeFish: React.PropTypes.func.isRequired,
		updateFish: React.PropTypes.func.isRequired,
		storeId: React.PropTypes.string.isRequired
	};
}

export default Inventory;
