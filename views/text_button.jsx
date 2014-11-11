var TextButton = React.createClass({
  render: function() {
    var className = this.props.className || '';
    var other = _.omit(this.props, 'className', 'tabIndex');
    return (
      <span {...other} tabIndex="0" className={ 'text-button ' + className }>{ this.props.children }</span>
    );
  }
});
