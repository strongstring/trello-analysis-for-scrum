var ProductCategoryRow = React.createClass({
	render : function() {
		return (<tr><th colSpan="2">{this.props.category}</th></tr>)
	}

});

var ProductRow = React.createClass({
	render : function() {
		var name = this.props.product.stocked ? 
			this.props.product.name : 
			<span style={{color : 'red'}}>
				{this.props.product.name}
			</span>
		return (
			<tr>
			<td>{name}</td>
			<td>{this.props.product.price}</td>
			</tr>
		);
	}
});

var ProductTable = React.createClass({
	getInitialState : function() {
		return {product : []};
	},

	loadProductsFromServer : function() {
		$.ajax({
			url : this.props.url,
			dataType : 'json',
			cache : false,
			success : function(data) {
				this.setState({product : data});
			}.bind(this),
			error : function(xhr, status, err) {
				console.log(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount : function() {
		this.loadProductsFromServer();
	},
	render : function() {
		var lastCategory = null;
		var rows = [];
		this.state.product.forEach(function(product) {
			if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
				return;
			}
			if (product.category !== lastCategory) {
				rows.push(<ProductCategoryRow category={product.category} key={product.category} />)
			}

			rows.push(<ProductRow product={product} key={product.name} />);
			lastCategory = product.category;
		});

		return (
			<table>
				<thead>
				 <tr>
				 	<th>Name</th>
				 	<th>Price</th>
				 </tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
});

var SearchBar = React.createClass({
	render : function() {
		return (
			<form>
				<input type="text" placeholder="Search...." value={this.props.filterText} />
				<p>
					<input type="checkbox" checked={this.props.inStockOnly} />
					{ ' ' }
					Only show products in stock
				</p>
			</form>
		);
	}
});

var FilterableProcuctTable = React.createClass({
	getInitialState : function() {
		return {
			filterText : '',
			inStockOnly : false
		}
	},
	render : function() {
		return (
			<div>
				<SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} />
				<ProductTable url={this.props.url} filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} />
			</div>
		);
	}
});

ReactDOM.render(
  <ProductTable url='/api/product' />,
  document.getElementById('container')
);