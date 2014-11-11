var Header = React.createClass({
  render: function() {
    var component = this;

    return (
      <div className="header">
        <div className="container">
          <div className="row">
            <div className="span6">
              <h1 className="brand">
                <a href="/"><Sprite name="icon" /> Eigenfeed</a>
              </h1>
            </div>
            <div className="span6 nav">
              <a href="/about">About</a>
              <TextButton onClick={ component.props.clickLogIn }>Log in</TextButton>
              <TextButton onClick={ component.props.clickSignUp }>Sign up</TextButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
