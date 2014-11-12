var Sprite = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className={'sprite sprite-' + this.props.name} />
    );
  }
});
