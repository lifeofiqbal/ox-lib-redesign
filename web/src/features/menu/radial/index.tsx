import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    filter: 'none',
    pointerEvents: 'none',
  },
  radialContainer: {
    position: 'relative',
    width: 390,
    height: 390,
    pointerEvents: 'auto',
    background: 'transparent',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    filter: 'none',
    overflow: 'visible',
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },
  menuItem: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 96,
    height: 86,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: 'pointer',
    transform: 'var(--item-transform) scale(1)',
    transformOrigin: 'center',
    animation: 'radial-pop 0.22s cubic-bezier(0.2, 0.9, 0.2, 1) both',
    animationDelay: 'var(--item-delay)',
    transition: 'transform 0.14s ease, background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease',
    borderRadius: 8,
    background:
      'radial-gradient(circle at 50% 0%, rgba(251, 48, 97, 0.26), transparent 58%), linear-gradient(180deg, rgba(55, 7, 23, 0.78) 0%, rgba(16, 4, 9, 0.68) 100%)',
    border: '1px solid rgba(251, 48, 97, 0.42)',
    boxShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.04), inset 0 -1px 0 rgba(251, 48, 97, 0.16), 0 0 18px rgba(251, 48, 97, 0.12)',
    zIndex: 1,
    overflow: 'hidden',
    '@keyframes radial-pop': {
      from: {
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.2) rotate(-18deg)',
      },
      to: {
        opacity: 1,
        transform: 'var(--item-transform) scale(1)',
      },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(251,48,97,0.18) 0%, transparent 45%)',
      opacity: 0.8,
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 8,
      height: 2,
      borderRadius: 999,
      background: 'rgba(251, 48, 97, 0.62)',
      pointerEvents: 'none',
    },
    '&:hover': {
      transform: 'var(--item-transform) scale(1.08)',
      background:
        'radial-gradient(circle at 50% 0%, rgba(251, 48, 97, 0.4), transparent 62%), linear-gradient(180deg, rgba(72, 9, 29, 0.82) 0%, rgba(24, 5, 12, 0.74) 100%)',
      borderColor: '#fb3061',
      boxShadow: '0 0 24px rgba(251, 48, 97, 0.28)',
      '&::after': {
        background: '#fb3061',
      },
      '& svg': {
        color: '#fb3061',
      },
      '& p': {
        color: '#d7d7d7',
        textShadow: 'none',
      },
    },
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    color: '#fb3061',
    background: 'rgba(251, 48, 97, 0.12)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 12px rgba(251, 48, 97, 0.12)',
    zIndex: 1,
    '& svg': {
      display: 'block',
      margin: '0 auto',
    },
    '& img': {
      display: 'block',
      margin: '0 auto',
      objectFit: 'contain',
    },
  },
  menuLabel: {
    fontSize: 10.5,
    fontWeight: 800,
    color: '#d7d7d7',
    textAlign: 'center',
    lineHeight: 1.15,
    maxWidth: '92%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.38)',
    letterSpacing: 0,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  centerButton: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 66,
    height: 66,
    borderRadius: 999,
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(180deg, rgba(55, 7, 23, 0.82), rgba(16, 4, 9, 0.72))',
    border: '1px solid rgba(251, 48, 97, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease',
    boxShadow: '0 0 18px rgba(251, 48, 97, 0.2)',
    zIndex: 2,
    '&:hover': {
      transform: 'translate(-50%, -50%) scale(1.06)',
      borderColor: '#fb3061',
      boxShadow: '0 0 22px rgba(251, 48, 97, 0.3)',
    },
  },
  closeIcon: {
    fontSize: 18,
    color: '#fb3061',
  },
  paginationIndicator: {
    position: 'absolute',
    top: 'calc(50% + 46px)',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 7,
    zIndex: 2,
  },
  paginationDot: {
    width: 18,
    height: 5,
    borderRadius: 999,
    background: 'rgba(251, 48, 97, 0.24)',
    transition: 'all 0.16s ease',
  },
  paginationDotActive: {
    background: '#fb3061',
    transform: 'scaleX(1.25)',
    boxShadow: '0 0 10px rgba(251, 48, 97, 0.65)',
  },
}));

const ITEMS_PER_PAGE = 8;
const ITEM_RADIUS = 142;

const getPageItems = (items: RadialMenuItem[], page: number, moreLabel: string) => {
  if (!items || items.length <= ITEMS_PER_PAGE) return items || [];

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  let pageItems = items.slice(startIndex, endIndex);

  if (endIndex < items.length) {
    pageItems = pageItems.slice(0, ITEMS_PER_PAGE - 1);
    pageItems.push({ icon: 'ellipsis-h', label: moreLabel, isMore: true });
  }

  return pageItems;
};

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [radialMenu, setRadialMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const closeRadial = () => {
    setVisible(false);
    setMenuItems([]);
    fetchNui('radialClose');
  };

  const changePage = async (increment?: boolean) => {
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setRadialMenu((prev) => {
      const nextPage = increment ? prev.page + 1 : prev.page - 1;
      setMenuItems(getPageItems(prev.items, nextPage, locale.ui.more));
      return { ...prev, page: nextPage };
    });
  };

  const handleBackButton = () => {
    if (radialMenu.page > 1) changePage(false);
    else if (radialMenu.sub) fetchNui('radialBack');
    else closeRadial();
  };

  const totalPages = Math.ceil((radialMenu.items?.length || 0) / ITEMS_PER_PAGE);

  const getItemStyle = (index: number, count: number): React.CSSProperties => {
    const angle = -90 + (360 / Math.max(count, 1)) * index;
    const transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${ITEM_RADIUS}px) rotate(${-angle}deg)`;

    return {
      '--item-transform': transform,
      '--item-delay': `${index * 28}ms`,
    } as React.CSSProperties;
  };

  useEffect(() => {
    setMenuItems(getPageItems(radialMenu.items, radialMenu.page, locale.ui.more));
  }, [radialMenu.items, radialMenu.page, locale.ui.more]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) {
      setVisible(false);
      setMenuItems([]);
      return;
    }

    let initialPage = 1;
    if (data.option) {
      const optionIndex = data.items.findIndex((item) => item.menu === data.option);
      if (optionIndex !== -1) initialPage = Math.floor(optionIndex / ITEMS_PER_PAGE) + 1;
    }

    setMenuItems(getPageItems(data.items, initialPage, locale.ui.more));
    setRadialMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setRadialMenu((prev) => ({ ...prev, items: data }));
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        event.preventDefault();
        closeRadial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleItemClick = async (item: RadialMenuItem, index: number) => {
    if (item.isMore) {
      await changePage(true);
      return;
    }

    const clickIndex = radialMenu.page === 1 ? index : (radialMenu.page - 1) * ITEMS_PER_PAGE + index;
    fetchNui('radialClick', clickIndex);
  };

  const handleRightClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (radialMenu.page > 1) await changePage(false);
    else if (radialMenu.sub) fetchNui('radialBack');
  };

  return (
    <>
      {visible && (
        <Box className={classes.wrapper} onContextMenu={handleRightClick}>
          <Box className={classes.radialContainer}>
            {menuItems.map((item, index) => (
                <Box
                  key={`radial-item-${index}`}
                  className={classes.menuItem}
                  style={getItemStyle(index, menuItems.length)}
                  onClick={() => handleItemClick(item, index)}
                >
                  <Box className={classes.menuIcon}>
                    {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                      <img
                        src={item.icon}
                        width={Math.min(Math.max(item.iconWidth || 24, 16), 32)}
                        height={Math.min(Math.max(item.iconHeight || 24, 16), 32)}
                        alt={item.label}
                      />
                    ) : (
                      <LibIcon icon={item.icon as IconProp} fontSize={24} fixedWidth />
                    )}
                  </Box>
                  <Text className={classes.menuLabel}>{item.label}</Text>
                </Box>
              ))}

            <Box className={classes.centerButton} onClick={handleBackButton}>
              <LibIcon
                icon={radialMenu.page > 1 || radialMenu.sub ? 'arrow-left' : 'xmark'}
                className={classes.closeIcon}
              />
            </Box>

            {totalPages > 1 && (
              <Box className={classes.paginationIndicator}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Box
                    key={i}
                    className={`${classes.paginationDot} ${
                      i + 1 === radialMenu.page ? classes.paginationDotActive : ''
                    }`}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default RadialMenu;
