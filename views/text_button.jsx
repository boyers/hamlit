var TextButton = React.createClass({
  render: function() {
    var className = this.props.className || '';
    var other = _.omit(this.props, 'className');
    return (
      <span {...other} className={ 'text-button ' + className }>{ this.props.children }</span>
    );
  }
});
