export const selectAddressStyles = {
  option: (provided: any, { isFocused }: any) => ({
    ...provided,
    color: isFocused ? '#B35EC2' : '#2C0434',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  }),
  placeholder: (provided: any, { isFocused }: any) => ({
    ...provided,
    color: isFocused ? '#B35EC2' : '#2C0434',
  }),
  control: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    border: 1,
    borderRadius: 0,
    borderBottom: `1px solid ${isFocused || isSelected ? '#B35EC2' : '#EBEBEB'}`,
    //this line remove select border when focus
    boxShadow: 'none',
    color: isFocused || isSelected ? '#B35EC2' : '#2C0434',
    '&:hover': {
      borderBottom: '1px solid #B35EC2',
      cursor: 'pointer',
    },
  }),
}
