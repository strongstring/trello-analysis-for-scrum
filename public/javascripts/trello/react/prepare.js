var Board = React.createClass({
	getInitialState : function() {
		return {
			name : "",
			id : ""
		}
	},
	render : function() {
		return (
			<div style={{margin : '10px'}}>
				<input type="text" className="col-md-6" value={this.state.name} placeholder="insert board name.." />
				<input type="text" className="col-md-6" value={this.state.id} placeholder="insert board id.." />
				<br />
			</div>
		);
	},
	componentDidMount : function() {
		this.setState({ name : this.props.name});
		this.setState({ id : this.props.boardID});
	}
});

var BoardTable = React.createClass({
	getInitialState : function() {
		return { 
			boards : []
		};
	},
	addBoard : function() {
		var newBoard = {name : "", id : ""};
		var newBoards = [];

		newBoards = this.state.boards.concat([newBoard]);
		this.setState({boards : newBoards});
	},
	updateBoard : function() {
		this.refs['memberTable'].updateMember();
	},
	render : function() {
		var boardsNode = this.state.boards.map(function(board, i) {
      return (
        <Board name={board.name} boardID={board.id} key={i}/>
      )
    });
	   return (
	   	<div className="col-md-12">
			<div className="col-md-6">
				<div className="panel panel-default">
		      <div className="panel-heading">
		        <h4 className="panel-title">
		          <a data-toggle="collapse">Board</a>
		        </h4>
		      </div>
		      <div className="">
		        <div className="panel-body">
		        	{boardsNode}
		        	<div className="boardAddBtn" onClick={this.addBoard} > Add Board </div>
		        </div>
		      </div>
		    </div>
		  </div>
		  <MemberTable ref="memberTable" boards={this.state.boards} />
		  </div>
		);
	},
	componentDidMount : function() {
		$.ajax({
			url : this.props.url,
			dataType : 'json',
			cache : false,
			success : function(data) {
				this.setState({boards : data});
				this.updateBoard();
			}.bind(this),
			error : function(xhr, status, err) {
				console.log(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
});

var MemberTable = React.createClass({
	getInitialState : function() {
		return {
			members : []
	  };
	},
	updateMember : function() {
		this.props.boards.forEach(function(project) {
			Trello.get(
				'/boards/' + project.id + '/members/',
				function(data) {
					var length = data.length;

					for(var i = 0; i < length; i++ ){
						var _userName = data[i].username;
						var _memberLength = this.state.members.length;

						var _find = false;
						for(var j = 0; j < _memberLength; j++) {
							if(this.state.members[j].username === _userName) {
								_find = true;
								break;
							}
						}
						if(!_find) {
							var newMember = data[i];
							var newMembers = this.state.members.concat([newMember]);

							this.setState({members : newMembers});
						}
					}
				}.bind(this), 
				function(xhr, status, err) {
					console.log(error);
				}.bind(this)
			)
		}.bind(this));
	},
	render : function() {
		var optionsNode = this.state.members.map(function(member, i) {
      return (
      	<option value={member.username} key={i}>{member.fullName}</option>
      )
    });

		return (
			<div className="col-md-6">
				<div className="panel panel-default">
		      <div className="panel-heading">
		        <h4 className="panel-title">
		          <a data-toggle="collapse">Member</a>
		        </h4>
		      </div>
		      <div className="">
		        <div className="panel-body">
		        	<span> Selected member : </span>
		        	<select>{optionsNode}</select>
		        </div>
		      </div>
		    </div>
		  </div>
		);
	},
	componentDidMount : function() {

	}
});