import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component
{
	goToStore = (event) =>
	{
		event.preventDefault();
		const storeId = this.inputStore.value;
		console.log(`Go to Store: ${storeId}`);
		this.context.router.transitionTo(`/store/${storeId}`);
	};

	render()
	{
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please Enter A Store</h2>
				<input type="text" ref={this.storeInput} required placeholder="Store Name" value={getFunName()}/>
				<button type="submit">Visit Store →</button>
			</form>
		);
	}

	storeInput = (ref) =>
	{
		this.inputStore = ref;
	};

	static contextTypes = {
		router: React.PropTypes.object
	};
}

export default StorePicker;
