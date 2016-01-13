import React from 'react';
import { Input } from 'react-bootstrap';

var Catalog = React.createClass({

  handleSubmit: function (e) {
    e.preventDefault();
    this.props.addTodo(this.state.text);
    this.setState({
      text: ''
    });
  },

  handleChange: function (e) {
    this.setState({
      text: e.target.value
    });
  },

  getInitialState: function () {
    return {
      text: ''
    };
  },

  handleChangeCatalogUrl: function() {

  },

  render: function() {

    return (
      <div>
        <Input type="text"
          defaultValue="http://localhost:8000"
          ref="url"
          groupClassName="group-class"
          wrapperClassName="wrapper-class"
          labelClassName="label-class"
          onChange={self.handleChangeCatalogUrl} />
      </div>
    )
  }
});

module.exports = Catalog;