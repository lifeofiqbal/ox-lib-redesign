import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

const useStyles = createStyles((_, params: { difficultyOffset: number }) => ({
  root: {
    position: 'fixed',
    bottom: '10%',
    left: '50%',
    width: 430,
    padding: '12px 14px',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    borderRadius: 12,
    background: 'linear-gradient(165deg, rgba(28, 28, 28, 0.98), rgba(10, 10, 10, 0.98))',
    border: '1px solid rgba(251, 48, 97, 0.24)',
    boxShadow: '0 14px 34px rgba(251, 48, 97, 0.18), 0 10px 34px rgba(0, 0, 0, 0.5)',
  },
  track: {
    position: 'relative',
    width: '100%',
    height: 16,
    borderRadius: 999,
    background: 'rgba(0, 0, 0, 0.58)',
    border: '1px solid rgba(251, 48, 97, 0.2)',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
  },
  skillArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    background: 'linear-gradient(90deg, rgba(251, 48, 97, 0.72), rgba(255, 122, 160, 0.86))',
    boxShadow: '0 0 14px rgba(251, 48, 97, 0.36)',
  },
  indicator: {
    position: 'absolute',
    top: -5,
    width: 5,
    height: 26,
    borderRadius: 999,
    background: '#d7d7d7',
    transform: 'translateX(-50%)',
    boxShadow: '0 0 12px rgba(215, 215, 215, 0.45), 0 0 18px rgba(251, 48, 97, 0.28)',
    zIndex: 3,
  },
  button: {
    width: 42,
    height: 32,
    textAlign: 'center',
    borderRadius: 6,
    fontSize: 18,
    fontWeight: 900,
    color: '#d7d7d7',
    background: 'rgba(251, 48, 97, 0.12)',
    border: '1px solid rgba(251, 48, 97, 0.42)',
    boxShadow: '0 0 14px rgba(251, 48, 97, 0.16)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 9,
  },
  title: {
    fontSize: 13,
    fontWeight: 800,
    color: '#d7d7d7',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(215, 215, 215, 0.58)',
  },
}));

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });
  const { classes } = useStyles({ difficultyOffset: skillCheck.difficultyOffset });
  const skillStart = ((skillCheck.angle + 90) / 360) * 100;
  const skillWidth = (skillCheck.difficultyOffset / 360) * 100;

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  return (
    <>
      {visible && (
        <Box className={classes.root}>
          <Box className={classes.header}>
            <Box>
              <Box className={classes.title}>Skill Check</Box>
              <Box className={classes.hint}>Press the key inside the pink zone</Box>
            </Box>
            <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>
          </Box>
          <Box className={classes.track}>
            <Box className={classes.skillArea} style={{ left: `${skillStart}%`, width: `${skillWidth}%` }} />
            <Indicator
              angle={skillCheck.angle}
              offset={skillCheck.difficultyOffset}
              multiplier={
                skillCheck.difficulty === 'easy'
                  ? 1
                  : skillCheck.difficulty === 'medium'
                  ? 1.5
                  : skillCheck.difficulty === 'hard'
                  ? 1.75
                  : skillCheck.difficulty.speedMultiplier
              }
              handleComplete={handleComplete}
              className={classes.indicator}
              skillCheck={skillCheck}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default SkillCheck;
