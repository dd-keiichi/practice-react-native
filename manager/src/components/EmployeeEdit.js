import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Communications from 'react-native-communications';
import { Card, CardSection, Button, Confirm } from './common';
import EmployeeForm from './EmployeeForm';
import { employeeUpdate, employeeSave, employeeDelete } from '../actions';

class EmployeeEdit extends Component {
  state = { showModal: false };

  componentWillMount() {
    _.each(this.props.employee, (value, prop) => {
      this.props.employeeUpdate({ prop, value });
    });
  }

  onButtonPress() {
    const { name, phone, shift } = this.props;

    this.props.employeeSave({
      name,
      phone,
      shift,
      uid: this.props.employee.uid,
    });
  }

  onTextPress() {
    const { phone, shift } = this.props;

    Communications.text(phone, `Your upcoming shift is on ${shift}`);
  }

  onFirePress() {
    this.setState({ showModal: true });
  }

  onAccept() {
    const { uid } = this.props.employee;
    
    this.props.employeeDelete({ uid });
  }

  onDecline() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <Card>
        <EmployeeForm />
        <CardSection>
          <Button onPress={event => this.onButtonPress(event)}>
            Save chages
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={event => this.onTextPress(event)}>
            Text Schedule
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={event => this.onFirePress(event)}>
            Fire employee
          </Button>
        </CardSection>

        <Confirm
          visible={this.state.showModal}
          onAccept={event => this.onAccept(event)}
          onDecline={event => this.onDecline(event)}
        >
          Are you sure you want to delete this?
        </Confirm>
      </Card>
    );
  }
}

EmployeeEdit.propTypes = {
  employee: PropTypes.object.isRequired,
  employeeUpdate: PropTypes.func.isRequired,
  employeeSave: PropTypes.func.isRequired,
  employeeDelete: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  shift: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { name, phone, shift } = state.employeeForm;

  return { name, phone, shift };
};

export default connect(mapStateToProps, {
  employeeUpdate,
  employeeSave,
  employeeDelete,
})(EmployeeEdit);
