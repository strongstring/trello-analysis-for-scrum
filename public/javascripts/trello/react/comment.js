var data = [
  {id : 1, author: "Pete Hunt", text : "This is one comment"},
  {id : 2, author: "Jordan", text : "This is *another* comment"},
  {id : 3, author: "Jordan", text : "This is *another* comment"},
  {id : 4, author: "Jordan", text : "This is *another* comment"},
  {id : 5, author: "Jordan", text : "This is *another* comment"},
];

var Comment = React.createClass({
  rawMarkup : function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return {__html : rawMarkup};
  },
  render : function() {
    var md = new Remarkable();
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render : function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState : function() {
    return {author : '', text: ''};
  },
  handleAuthorChange : function(e) {
    this.setState({author : e.target.value});
  },
  handleTextChange : function(e) {
    this.setState({text : e.target.value});
  },
  handleSubmit : function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return ;
    } else {

    }
    this.props.onCommentSubmit({author : author, text : text});
    this.setState({author : '', text : ''});
  },
  render : function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
        <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer : function() {
    $.ajax({
      url : this.props.url,
      dataType: 'json',
      cache: false,
      success : function(data) {
        this.setState({data : data});
      }.bind(this),
      error : function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit : function(comment) {
    // TODO: submit to the server and refresh the list
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data : newComments});
    $.ajax({
      url : this.props.url,
      dataType : 'json',
      type : 'POST',
      data : comment,
      success : function(data) {
        this.setState({data : data});
      }.bind(this),
      error : function(xhr, status, err) {
        this.setState({data : comments});
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  getInitialState : function() {
    return {data: []};
  },
  componentDidMount : function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render : function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={5000}/>,
  document.getElementById('container')
);