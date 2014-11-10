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
        <Header />
        <div className="container">
          { view }
        </div>
      </div>
    );
  }
});
