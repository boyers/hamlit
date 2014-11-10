var Header = React.createClass({
  render: function() {
    return (
      <div id="header">
        <div className="container">
          <div className="row">
            <div className="span6">
              <h1 id="brand">
                <a href="/"><Sprite name="icon" /> Eigenfeed</a>
              </h1>
            </div>
            <div className="span6" id="nav">
              <a href="/about">About</a>
              <a href="/">Log in</a>
              <a href="/">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
