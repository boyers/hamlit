var Content = React.createClass({
  render: function() {
    var view;
    if (this.props.view === 'index') {
      view = <ViewIndex />;
    } if (this.props.view === 'about') {
      view = <ViewAbout />;
    } if (this.props.view === '404') {
      view = <View404 />;
    } if (this.props.view === '500') {
      view = <View500 />;
    }

    return (
      <div>
        <div id="header">
          <div className="container">
            <div className="row">
              <div className="span6">
                <h1 id="brand">
                  <Sprite name="icon" />
                  &nbsp;
                  <a href="/">Eigenfeed</a>
                </h1>
              </div>
              <div className="span6" id="nav">
                <a href="https://twitter.com/eigenfeed"><i className="fa fa-twitter"></i></a>
                <a href="https://www.facebook.com/eigenfeed"><i className="fa fa-facebook-square"></i></a>
                <a href="/about">About</a>
                <a href="/">Log in</a>
                <a href="/">Sign up</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          { view }
        </div>
      </div>
    );
  }
});
