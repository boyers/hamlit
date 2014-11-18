/*
  The endpoint should return a JSON object containing at least two fields:
    error: null or an error String
    validationErrors: null or an object mapping field names to error strings
*/

var Form = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    submitText: React.PropTypes.string.isRequired,
    endpoint: React.PropTypes.string.isRequired,
    onSuccess: React.PropTypes.func,
    fields: React.PropTypes.arrayOf(React.PropTypes.element.isRequired).isRequired
  },
  getInitialState: function() {
    return { submitted: false, error: null };
  },
  focus: function() {
    var firstFieldRef = this.props.fields[0].props.id;
    this.refs[firstFieldRef].focus();
  },
  submit: function(event) {
    var i, field;
    var component = this;
    event.preventDefault();
    event.stopPropagation();

    if (!component.state.submitted) {
      $(component.getDOMNode()).find('textarea, input').prop('disabled', true);
      component.setState({ submitted: true, error: null });

      var data = {};
      for (i = 0; i < component.props.fields.length; i++) {
        field = component.props.fields[i];
        var name = component.refs[field.props.id].props.id;
        var value = component.refs[field.props.id].getValue();
        data[name] = value;
      }

      $.ajax({
        type: 'POST',
        url: component.props.endpoint,
        data: data
      }).always(function() {
        $(component.refs.submit.getDOMNode()).blur();
        $(component.getDOMNode()).find('textarea, input').prop('disabled', false);
        component.setState({ submitted: false });
      }).done(function(data) {
        if (data.error === null && (!data.hasOwnProperty('validationErrors') || data.validationErrors === null || $.isEmptyObject(data.validationErrors))) {
          for (i = 0; i < component.props.fields.length; i++) {
            field = component.props.fields[i];
            component.refs[field.props.id].reset();
          }
          if (component.props.hasOwnProperty('onSuccess')) {
            component.props.onSuccess(data);
          }
        } else {
          if (data.error !== null) {
            component.focus();
          }
          component.setState({ error: data.error });
          if (data.hasOwnProperty('validationErrors') && data.validationErrors !== null) {
            for (i = 0; i < component.props.fields.length; i++) {
              field = component.props.fields[i];
              component.refs[field.props.id].setError(null);
            }
            for (var ref in data.validationErrors) {
              component.refs[ref].setError(data.validationErrors[ref]);
            }
            for (i = 0; i < component.props.fields.length; i++) {
              field = component.props.fields[i];
              if (data.validationErrors.hasOwnProperty(field.props.id)) {
                component.refs[field.props.id].focus();
                break;
              }
            }
          }
        }
      }).fail(function() {
        component.setState({ error: 'Uh oh, there was a network error.' });
      });
    }
  },
  render: function() {
    var fields = _.map(this.props.fields, function(field) {
      return React.addons.cloneWithProps(field, {
        key: field.props.id,
        ref: field.props.id
      });
    });

    return (
      <form onSubmit={ this.submit }>
        <h2>{ this.props.title }</h2>
        <hr />
        { (this.state.error === null) ? null : <div className="form-error">{ this.state.error }</div> }
        { fields }
        <div className="form-row align-right">
          { this.state.submitted ? <Spinner /> : null }
          <input type="submit" ref="submit" value={ this.props.submitText } />
        </div>
      </form>
    );
  }
});
