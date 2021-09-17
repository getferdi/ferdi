import Form from '../../lib/Form';

export default new Form({
  fields: {
    user: {
      label: 'user',
      placeholder: 'Username',
      value: '',
    },
    password: {
      label: 'Password',
      placeholder: 'Password',
      value: '',
      type: 'password',
    },
  },
});
