var Feed = React.createClass({
  getInitialState: function() {
    return {
      loading: true,
      broken: false
    };
  },
  componentDidMount: function() {
    var component = this;
    window.api('/api/home', { }, function(data) {
      component.setState({ loading: false, broken: false });
    }, function() {
      component.setState({ loading: false, broken: true });
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (prevProps.username !== component.props.username) {
      window.api('/api/home', { }, function(data) {
        component.setState({ loading: false, broken: false });
      }, function() {
        component.setState({ loading: false, broken: true });
      });
    }
  },
  render: function() {
    if (this.state.broken) {
      return <Error500 />;
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div>
        Feed
      </div>
    );
  }
});
