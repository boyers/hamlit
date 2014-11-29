/*
  The endpoint should return a JSON object containing at least this field:
    error: null or an error String

  And optionally this field:
    validationErrors: an object mapping field names to error strings
*/

var Form = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    submitText: React.PropTypes.string.isRequired,
    endpoint: React.PropTypes.string.isRequired,
    onSuccess: React.PropTypes.func,
    fields: React.PropTypes.arrayOf(React.PropTypes.element.isRequired).isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function() {
    return { submitted: false, error: null };
  },
  componentDidMount: function() {
    if (this.props.disabled === true) {
      $(this.getDOMNode()).find('textarea, input').prop('disabled', true);
    }
    for (var i = 0; i < this.props.fields.length; i++) {
      var field = this.props.fields[i].props.id;
      this.refs[field].setForm(this);
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    $(this.getDOMNode()).find('textarea, input').prop('disabled', this.props.disabled === true || this.state.submitted);
  },
  focus: function() {
    var firstFieldRef = this.props.fields[0].props.id;
    this.refs[firstFieldRef].focus();
  },
  clearFormError: function() {
    this.setState({ error: null });
  },
  reset: function() {
    for (i = 0; i < this.props.fields.length; i++) {
      var field = this.props.fields[i].props.id;
      this.refs[field].reset();
    }
    this.setState({ error: null });
  },
  submit: function(event) {
    if (this.props.disabled === true) {
      return;
    }

    var i, field;
    var component = this;
    event.preventDefault();
    event.stopPropagation();

    if (!component.state.submitted) {
      $(component.getDOMNode()).find('textarea, input').prop('disabled', true);
      component.setState({ submitted: true, error: null });

      var data = {};
      for (i = 0; i < component.props.fields.length; i++) {
        field = component.props.fields[i].props.id;
        var name = component.refs[field].props.id;
        var value = component.refs[field].getValue();
        data[name] = value;
      }

      var always = function() {
        $(component.refs.submit.getDOMNode()).blur();
        $(component.getDOMNode()).find('textarea, input').prop('disabled', false);
        component.setState({ submitted: false });
      };

      window.api(component.props.endpoint, data, function(data) {
        always();
        component.reset();
        if (component.props.onSuccess) {
          component.props.onSuccess(data);
        }
      }, function(data) {
        always();
        if (data === null) {
          component.setState({ error: 'Uh oh, something went wrong.' });
        } else {
          component.setState({ error: data.error });
          var found = false;
          if (data.validationErrors) {
            for (i = 0; i < component.props.fields.length; i++) {
              field = component.props.fields[i].props.id;
              if (data.validationErrors[field]) {
                component.refs[field].setError(data.validationErrors[field]);
                if (!found) {
                  component.refs[field].focus();
                  found = true;
                }
              } else {
                component.refs[field].setError(null);
              }
            }
          }
          if (!found) {
            component.focus();
          }
        }
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
        {
          this.props.title ? (
            <div>
              <h2>{ this.props.title }</h2>
              <hr />
            </div>
          ) : null
        }
        { (this.state.error) ? <div className="form-error">{ this.state.error }</div> : null }
        { fields }
        <div className="form-row form-row-submit align-right">
          <input type="submit" ref="submit" value={ this.props.submitText } />
        </div>
      </form>
    );
  }
});
