export function bindToInput(fieldName){
	return (ev)=> {
		this.setState({
			[fieldName]: ev.target.value
		})
	}
}