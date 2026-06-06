import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  primaryColor: 'medalixtPink',
  primaryShade: 6,
  colors: {
    medalixtPink: [
      '#fff0f4',
      '#ffdbe4',
      '#ffb7ca',
      '#ff8fae',
      '#ff6a94',
      '#ff4d7d',
      '#fb3061',
      '#d91f4d',
      '#b71840',
      '#8e1232',
    ],
  },
  white: '#d7d7d7',
  black: '#16040a',
  shadows: {
    sm: '0 6px 16px rgba(251, 48, 97, 0.18), 0 2px 8px rgba(0, 0, 0, 0.45)',
    md: '0 14px 34px rgba(251, 48, 97, 0.2), 0 8px 26px rgba(0, 0, 0, 0.5)',
  },
  defaultRadius: 6,
  globalStyles: () => ({
    '.mantine-Modal-modal, .mantine-Paper-root': {
      background: 'linear-gradient(180deg, rgba(28, 28, 28, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
      border: '1px solid rgba(251, 48, 97, 0.2)',
      boxShadow: '0 18px 42px rgba(251, 48, 97, 0.2), 0 14px 38px rgba(0, 0, 0, 0.52)',
    },
    '.mantine-Input-input, .mantine-Textarea-input, .mantine-Select-input, .mantine-NumberInput-input': {
      backgroundColor: 'rgba(10, 10, 10, 0.58)',
      borderColor: 'rgba(251, 48, 97, 0.2)',
      color: '#d7d7d7',
    },
    '.mantine-Input-input:focus, .mantine-Textarea-input:focus, .mantine-Select-input:focus, .mantine-NumberInput-input:focus':
      {
        borderColor: '#fb3061',
        boxShadow: '0 0 0 2px rgba(251, 48, 97, 0.28)',
      },
    '.mantine-InputWrapper-label': {
      color: '#d7d7d7',
      fontWeight: 700,
    },
    '.mantine-InputWrapper-description': {
      color: 'rgba(215, 215, 215, 0.62)',
    },
  }),
  components: {
    Button: {
      styles: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.18)',
          background: 'linear-gradient(180deg, #fb3061 0%, #9f1739 100%)',
          color: '#171717',
          boxShadow: '0 8px 18px rgba(251, 48, 97, 0.28)',
          fontWeight: 800,
          '&:hover': {
            background: 'linear-gradient(180deg, #ff5d86 0%, #e32958 100%)',
          },
        },
      },
    },
  },
};
