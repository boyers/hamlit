var Sprite = React.createClass({
  render: function() {
    return (
      <div className={'sprite sprite-' + this.props.name} />
    );
  }
});
