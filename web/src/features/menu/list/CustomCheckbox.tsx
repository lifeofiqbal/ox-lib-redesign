import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(53, 7, 18, 0.95)',
    borderColor: 'rgba(248, 90, 127, 0.45)',
    '&:checked': { backgroundColor: '#fb3061', borderColor: '#fb3061' },
  },
  inner: {
    '> svg > path': {
      fill: '#580e1f',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
