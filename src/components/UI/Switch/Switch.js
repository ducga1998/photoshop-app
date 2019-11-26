import React from 'react';
import styled from 'styled-components';

const Round = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: ${props =>
    props.disabled ? '#ccc' : 'rgba(0, 0, 0, 0.5)'};
  transition: 0.4s;
  border-radius: 25px;

  &:before {
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 3px;
    bottom: 3px;
    border-radius: 50%;
    background-color: #fff;
    transition: 0.4s;
  }
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;

  input {
    opacity: 0;
    width: 0px;
    height: 0px;
  }

  input:checked + ${Round} {
    background-color: ${props => (props.disabled ? '#ccc' : '#b06ab3')};
  }

  input:focus + ${Round} {
    box-shadow: 0 0 1px ${props => (props.disabled ? '#ccc' : '#b06ab3')};
  }

  input:checked + ${Round}:before {
    transform: translateX(30px);
  }
`;

function Switch({ disabled, value, onChange }) {
  return (
    <Label disabled={disabled} onChange={onChange}>
      <input type={'checkbox'} value={value} />
      <Round disabled={disabled} />
    </Label>
  );
}

export default Switch;
