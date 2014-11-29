var User = React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      loading: true,
      nonexistent: false
    };
  },
  componentDidMount: function() {
    var component = this;
    window.api('/api/user', {
      username: this.props.username
    }, function(data) {
      component.setState({ loading: false, nonexistent: false });
    }, function() {
      component.setState({ loading: false, nonexistent: true });
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (prevProps.username !== component.props.username) {
      window.api('/api/user', {
        username: this.props.username
      }, function(data) {
        component.setState({ loading: false, nonexistent: false });
      }, function() {
        component.setState({ loading: false, nonexistent: true });
      });
    }
  },
  render: function() {
    if (this.state.nonexistent) {
      return <Error404 />;
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div>
        { this.props.username }
      </div>
    );
  }
});
