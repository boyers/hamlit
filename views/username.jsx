var Username = React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired,
    normalizedUsername: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <a href={ '/' + encodeURIComponent(this.props.normalizedUsername) }>{ this.props.username }</a>
    );
  }
});
