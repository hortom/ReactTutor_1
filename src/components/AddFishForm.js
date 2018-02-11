import React from 'react';

class AddFishForm extends React.Component
{
	createFish(event)
	{
		event.preventDefault();
		console.log('Add a new Fish');
		const fish = {
			name: this.name.value,
			price: this.price.value,
			status: this.status.value,
			desc: this.desc.value,
			image: this.image.value
		}
		this.props.addFish(fish);
		this.inputForm.reset();
	}

	render()
	{
		return (
			<form ref={this.storeInputForm.bind(this)} className="fish-edit" onSubmit={this.createFish.bind(this)}>
				<input  ref={this.storeNameInput.bind(this)} type="text" placeholder="Fish Name" />
				<input  ref={this.storePriceInput.bind(this)} type="text" placeholder="Fish Price" />
				<select ref={this.storeStatusInput.bind(this)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out! </option>
				</select>
				<textarea  ref={this.storeDescInput.bind(this)} placeholder="Fish Desc"></textarea>
				<input  ref={this.storeImageInput.bind(this)} type="text" placeholder="Fish Image" />
				<button type="submit">+ Add Item</button>
			</form>
		);
	}

	storeInputForm(ref)
	{
		this.inputForm = ref;
	}

	storeNameInput(ref)
	{
		this.name = ref;
	}

	storePriceInput(ref)
	{
		this.price = ref;
	}

	storeStatusInput(ref)
	{
		this.status = ref;
	}

	storeDescInput(ref)
	{
		this.desc = ref;
	}

	storeImageInput(ref)
	{
		this.image = ref;
	}
}

AddFishForm.propTypes = {
	addFish: React.PropTypes.func.isRequired
}

export default AddFishForm;
