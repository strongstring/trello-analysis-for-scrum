var BoardInformation = [];

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
	passHandler : function(data) {
		console.log(this.props);
		this.props.taskUpdateHandler(data);
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
		  <MemberTable ref="memberTable" taskUpdateHandler={this.passHandler} boards={this.state.boards} />
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
				BoardInformation = data;
				console.log(BoardInformation);
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
	sendUpdateEvent : function(e) {
		console.log(e.target.value);
		this.props.taskUpdateHandler(e.target.value).bind(null, this);
	},
	render : function() {
		var optionsNode = this.state.members.map(function(member) {
      return (
      	<option value={member.username} >{member.fullName}</option>
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
		        	<select onChange={this.sendUpdateEvent}>{optionsNode}</select>
		        </div>
		      </div>
		    </div>
		  </div>
		);
	},
	componentDidMount : function() {

	}
});

var Task = React.createClass({
	render : function() {
		var percentage = (this.props.spend / this.props.estimate * 100).toFixed(2);
		return (
			<tr className={this.props.type} >
				<td>{this.props.name} {percentage} </td>
				<td>{this.props.spend}</td>
				<td>{this.props.estimate}</td>
			</tr>
		);
	}
});

var TaskGroup = React.createClass({
	render : function() {
		var taskNode = this.props.tasks.map(function(task, i) {
      return (
        <Task name={task.name} spend={task.spend} estimate={task.estimate} type={this.props.type} />
      )
    });

    return {taskNode}
	}
});

var Hash = React.createClass({
	render : function() {
		var tasks = this.props.tasks;
		var taskLength = tasks.length;
		var backlog = [];
		var doing = [];
		var done = [];

		for(var i = 0; i < taskLength; i++) {
			if(tasks[i].estimate === 0 || tasks[i].spend === 0) {
				backlog.push(tasks[i]);
			} else if (task[i].estimate === tasks[i].spend) {
				done.push(tasks[i]);
			} else {
				doing.push(tasks[i]);
			}
		}

		return (
			<div className="col-md-6">
				<div className="panel panel-default">
		      <div className="panel-heading">
		        <h4 className="panel-title">
		          {this.props.hashtag}
		        </h4>
		      </div>
		      <div className="panel-body">
						<table>
							<tbody>
								<TaskGroup tasks={doing} />
								<TaskGroup tasks={backlog} />
								<TaskGroup tasks={done} />
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
});

var HashTable = React.createClass({
	getInitialState : function() {
		return {
			hashs : []
		}
	},
	loadCard : function(boards) {
		console.log("hi");
	},
	render : function() {
		return (
			<div>
				<button value="load" />
			</div>
		);
	}
});

var PageWrapper = React.createClass({
	getInitialState : function() {
		return { 
			authorized : false,
		};
	},
	componentWillMount : function() {
		if(!this.state.authorized) {
			Trello.authorize({
				type : 'redirect',
	      success : function() { 
	      	console.log("Successful authentication");
	      	this.setState({authorized : true});
	      }.bind(this),
	      error : function(xhr, status, err) {
	      	console.log("tello authonization error", status, err.toString());
	      }.bind(this)
		  });
		} else {
			console.log("protect twice bug");
		}
	},
	updater : function(data) {
		return console.log(data);
		// this.refs.hashTable.loadCard(data);
	},
	render : function() {
		return (
			<div>
				<BoardTable ref="boardTable" url="/api/mobile/board" taskUpdateHandler={this.updater}/>
				<HashTable ref="hashTable" />
			</div>
		);
	},
	componentDidMount : function() {
		if(this.state.authorized) {
			// this.refs.memberTable.loadMemberInformation();
		} else {
			console.log("not authonization");
		}
	}
});

ReactDOM.render(
	<PageWrapper />,
	document.getElementById('container')
);