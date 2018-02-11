import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../Base';

class App extends React.Component
{
	state = {
		fishes: {},
		order: {}
	};

	componentWillMount()
	{
		this.ref = base.syncState(
			`${this.props.params.storeId}/fishes`,
			{
				context: this,
				state: 'fishes'
			}
		);
 
		const order = localStorage.getItem(`order-${this.props.params.storeId}`);
		if (order != null)
			this.setState({order: JSON.parse(order)});
	}

	componentWillUnmount()
	{
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState)
	{
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	updateFish = (key, updatedFish) =>
	{
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({fishes: fishes});
	};

	addFish = (fish) =>
	{
		const fishes = {...this.state.fishes};
		const timeStamp = Date.now();
		fishes[`fish-${timeStamp}`] = fish;
		this.setState({fishes: fishes});
	};

	removeFish = (key) =>
	{
		const fishes = {...this.state.fishes};
		fishes[key] = null; // This will also work with firebase.
		this.setState({fishes: fishes});
	};

	addToOrder = (key) =>
	{
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		this.setState({order: order});
	};

	removeFromOrder = (key) =>
	{
		const order = {...this.state.order};
		delete order[key]; // This is safe, because not synced in Firebase
		this.setState({order: order});
	};

	loadSamples = () =>
	{
		this.setState({fishes: sampleFishes});
	};

	render()
	{
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Fish"/>
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => 
										<Fish
											addToOrder={this.addToOrder}
											key={key}
											index={key}
											details={this.state.fishes[key]}
										/>
									)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					removeFish={this.removeFish}
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					storeId={this.props.params.storeId}
				/>
			</div>
		);
	}

	static propTypes = {
		params: React.PropTypes.object.isRequired
	};
}

export default App;
