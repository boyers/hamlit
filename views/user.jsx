var User = React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div>
        { this.props.username }
      </div>
    );
  }
});
