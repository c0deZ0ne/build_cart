import React from 'react';
import Select from 'react-select';

const ReactSelect = ({ value, options, onChange, errCheck }) => {
  return (
    <div>
      <Select
        placeholder={'Search for an item'}
        value={value}
        onChange={onChange}
        options={options}
        // onFocus={(e) => setPlaceholder('Kindly SIGN UP to search for other items')}
        // onBlur={(e) => setPlaceholder('Product Name')}
        styles={{
          option: (baseStyles, { data, isDisabled, isFocused, isSelected }) => {
            return {
              ...baseStyles,
              color: isDisabled
                ? '#ccc'
                : isSelected
                ? '#ffffff'
                : isFocused
                ? '#ffffff'
                : '#303030',
              backgroundColor: isDisabled
                ? '#ffffff'
                : isSelected
                ? '#f5862e'
                : isFocused
                ? '#f5862e9a'
                : '#fff',
              fontSize: '0.9em',
              fontStyle: isDisabled && 'italic',
              textAlign: 'left',
            };
          },
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused
              ? '#f5862e'
              : errCheck && value?.rfqItemId === ''
              ? 'red'
              : '#e5e5e5',
            fontSize: '0.9em',
            padding: '5px',
            borderRadius: '8px',
            outline: 'none',
            boxShadow: 'none',
            ':hover': {
              border: '1px solid #f5862e',
            },
          }),
          singleValue: (styles, { data }) => {
            return {
              ...styles,
              color: '#303030',
              textAlign: 'left',
            };
          },
          placeholder: (styles, { data }) => {
            return {
              ...styles,
              color: '#303030',
            };
          },
        }}
      />
    </div>
  );
};

export default ReactSelect;
