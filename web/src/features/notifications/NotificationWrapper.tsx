import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes, Stack, Text } from '@mantine/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleInfo, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles(() => ({
  container: {
    width: 'fit-content',
    maxWidth: 'min(420px, calc(100vw - 40px))',
    minHeight: 52,
    color: '#d7d7d7',
    padding: '9px 12px 9px 10px',
    borderRadius: 4,
    fontFamily: 'Montserrat, Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'auto',
    '--b': '2px',
    '--w': '14px',
    border: 'var(--b) solid transparent',
    '--_g': '#0000 90deg, var(--accent) 0',
    '--_p': 'var(--w) var(--w) border-box no-repeat',
    background:
      'conic-gradient(from 90deg at top var(--b) left var(--b), var(--_g)) 0 0 / var(--_p),' +
      'conic-gradient(from 180deg at top var(--b) right var(--b), var(--_g)) 100% 0 / var(--_p),' +
      'conic-gradient(from 0deg at bottom var(--b) left var(--b), var(--_g)) 0 100% / var(--_p),' +
      'conic-gradient(from -90deg at bottom var(--b) right var(--b), var(--_g)) 100% 100% / var(--_p),' +
      'linear-gradient(90deg, var(--bgStart), var(--bgEnd))',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.46), 0 0 18px rgba(251, 48, 97, 0.12)',
  },
  icon: {
    width: 22,
    height: 20,
    borderRadius: 0,
    clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#151515',
    background: 'var(--iconBg)',
    boxShadow: '0 0 0 1px rgba(251, 48, 97, 0.26), 0 1px 3px rgba(0, 0, 0, 0.38)',
    position: 'relative',
    zIndex: 1,
  },
  iconGlyph: {
    filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))',
    width: 10,
    height: 10,
    display: 'block',
  },
  body: {
    minWidth: 0,
    position: 'relative',
    zIndex: 1,
  },
  itemError: {
    '--stroke': 'rgba(251, 48, 97, 0.7)',
    '--bgStart': 'rgba(28, 28, 28, 0.97)',
    '--bgEnd': 'rgba(10, 10, 10, 0.97)',
    '--accent': '#ff7fa0',
    '--iconBg': 'linear-gradient(180deg, #ff7fa0 0%, #fb3061 100%)',
  },
  itemInfo: {
    '--stroke': 'rgba(251, 48, 97, 0.52)',
    '--bgStart': 'rgba(28, 28, 28, 0.97)',
    '--bgEnd': 'rgba(10, 10, 10, 0.97)',
    '--accent': '#fb3061',
    '--iconBg': 'linear-gradient(180deg, #fb3061 0%, #8e1232 100%)',
  },
  itemSuccess: {
    '--stroke': 'rgba(251, 48, 97, 0.58)',
    '--bgStart': 'rgba(28, 28, 28, 0.97)',
    '--bgEnd': 'rgba(10, 10, 10, 0.97)',
    '--accent': '#fb3061',
    '--iconBg': 'linear-gradient(180deg, #ff8fae 0%, #fb3061 100%)',
  },
  itemWarning: {
    '--stroke': 'rgba(251, 48, 97, 0.58)',
    '--bgStart': 'rgba(28, 28, 28, 0.97)',
    '--bgEnd': 'rgba(10, 10, 10, 0.97)',
    '--accent': '#fb3061',
    '--iconBg': 'linear-gradient(180deg, #ffb7ca 0%, #fb3061 100%)',
  },
  title: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: 700,
    color: '#d7d7d7',
    opacity: 0.98,
    textShadow: '0 1px 3px #0008',
    letterSpacing: 0.15,
    lineHeight: 'normal',
  },
  description: {
    marginTop: 1,
    fontSize: 11,
    color: '#b8b8b8',
    opacity: 0.94,
    textShadow: '0 1px 4px #000a, 0 0 1px #000',
    letterSpacing: 0.15,
    lineHeight: 'normal',
    fontWeight: 600,
  },
  descriptionOnly: {
    marginTop: 1,
    fontSize: 11,
    color: '#b8b8b8',
    opacity: 0.94,
    textShadow: '0 1px 4px #000a, 0 0 1px #000',
    letterSpacing: 0.15,
    lineHeight: 'normal',
    fontWeight: 600,
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: {
      opacity: visible ? 0 : 1,
      transform: from,
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: to,
    },
  });

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('center-left')
      ? { from: 'translateX(-30px)', to: 'translateX(0px)' }
      : position.includes('center-right')
      ? { from: 'translateX(30px)', to: 'translateX(0px)' }
      : position.includes('bottom')
      ? { from: 'translateY(30px)', to: 'translateY(0px)' }
      : { from: 'translateY(-30px)', to: 'translateY(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'translateX(0px)', to: 'translateX(100%)' };
    } else if (position.includes('left')) {
      animation = { from: 'translateX(0px)', to: 'translateX(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'translateY(0px)', to: 'translateY(-100%)' };
    } else if (position.includes('bottom')) {
      animation = { from: 'translateY(0px)', to: 'translateY(100%)' };
    } else {
      animation = { from: 'translateX(0px)', to: 'translateX(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let position = ((data.position as string | undefined) || 'top-right');
    let toastPosition = position;
    const variant =
      data.type === 'error'
        ? 'error'
        : data.type === 'success'
        ? 'success'
        : data.type === 'warning'
        ? 'warning'
        : 'info';
    const title =
      data.title && data.title.trim().length > 0
        ? data.title
        : variant === 'info'
        ? 'System Info'
        : variant === 'success'
        ? 'Success'
        : variant === 'warning'
        ? 'Warning'
        : 'Error';
    const icon =
      variant === 'success'
        ? faCheck
        : variant === 'warning'
        ? faTriangleExclamation
        : variant === 'error'
        ? faXmark
        : faCircleInfo;

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        toastPosition = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        toastPosition = 'bottom-center';
        break;
      case 'left-bottom':
        position = 'bottom-left';
        toastPosition = 'bottom-left';
        break;
      case 'right-bottom':
        position = 'bottom-right';
        toastPosition = 'bottom-right';
        break;
      case 'center-left':
        toastPosition = 'top-left';
        break;
      case 'center-right':
        toastPosition = 'top-right';
        break;
    }

    const centerSideStyle: React.CSSProperties =
      position === 'center-left'
        ? { marginTop: 'calc(50vh - 30px)', marginLeft: 12 }
        : position === 'center-right'
        ? { marginTop: 'calc(50vh - 30px)', marginRight: 12 }
        : {};

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...(centerSideStyle as any),
            ...(data.style as any),
          }}
          className={`${classes.container} ${
            variant === 'error'
              ? classes.itemError
              : variant === 'success'
              ? classes.itemSuccess
              : variant === 'warning'
              ? classes.itemWarning
              : classes.itemInfo
          }`}
        >
          <Box className={classes.icon}>
            <FontAwesomeIcon icon={icon} className={classes.iconGlyph} fixedWidth />
          </Box>
          <Stack spacing={0} className={classes.body}>
            <Text className={classes.title}>{title}</Text>
            {data.description && (
              <ReactMarkdown
                components={MarkdownComponents}
                className={`${data.description && title ? classes.description : classes.descriptionOnly} description`}
              >
                {data.description}
              </ReactMarkdown>
            )}
          </Stack>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: toastPosition as any,
      }
    );
  });

  return (
    <Toaster
      containerStyle={{
        pointerEvents: 'none',
        zIndex: 200,
        filter: 'drop-shadow(0 0 14px rgba(251, 48, 97, 0.16))',
      }}
      gutter={10}
    />
  );
};

export default Notifications;
