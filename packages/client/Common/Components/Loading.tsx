import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { FC, ReactElement } from 'react';

const dotsKeyframes = keyframes`
  0% {
    top: 6px;
    height: 51px;
  }
  50%, 100% {
    top: 19px;
    height: 26px;
  }
`;

const gridKeyframes = keyframes`
  0%,70%,100% {
    transform: scale3d(1,1,1)
  }
  35% {
    transform: scale3d(0,0,1)
  }
`;

const Grid = styled.div<{ absolute?: boolean }>(
  ({ theme }) => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '35vmin',
    height: '35vmin',
    margin: 'auto',
    '& > div': {
      width: '33%',
      height: '33%',
      backgroundColor: theme.palette.text.primary,
      float: 'left',
      animation: `${gridKeyframes} 1.3s infinite ease-in-out`,
    },
    '& > div:nth-of-type(1)': { animationDelay: '0.2s' },
    '& > div:nth-of-type(2)': { animationDelay: '0.3s' },
    '& > div:nth-of-type(3)': { animationDelay: '0.4s' },
    '& > div:nth-of-type(4)': { animationDelay: '0.1s' },
    '& > div:nth-of-type(5)': { animationDelay: '0.2s' },
    '& > div:nth-of-type(6)': { animationDelay: '0.3s' },
    '& > div:nth-of-type(7)': { animationDelay: '0s' },
    '& > div:nth-of-type(8)': { animationDelay: '0.1s' },
    '& > div:nth-of-type(9)': { animationDelay: '0.2s' },
  }),
  ({ absolute }) =>
    absolute && {
      position: 'absolute',
    },
);

const Dots = styled.div(({ theme }) => ({
  display: 'inline-block',
  position: 'relative',
  width: 64,
  height: 64,
  '& > div': {
    display: 'inline-block',
    position: 'absolute',
    left: 6,
    width: 13,
    background: theme.palette.text.primary,
    animation: `${dotsKeyframes} 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite`,
  },
  '& > div:nth-of-type(1)': {
    left: 6,
    animationDelay: '-0.24s',
  },
  '& > div:nth-of-type(2)': {
    left: 26,
    animationDelay: '-0.12s',
  },
  '& > div:nth-of-type(3)': {
    left: 45,
    animationDelay: '0',
  },
}));

interface Props {
  isLoading?: boolean;
  className?: string;
  type?: LoadingType;
  relative?: boolean;
  children?: ReactElement;
}

export const enum LoadingType {
  grid,
  dots,
}

const InnerLoading = ({ type, relative }: Pick<Props, 'type' | 'relative'>) => {
  switch (type) {
    default:
    case LoadingType.grid:
      return (
        <Grid absolute={!relative} data-testid="grid">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </Grid>
      );
    case LoadingType.dots:
      return (
        <Dots data-testid="dots">
          <div />
          <div />
          <div />
        </Dots>
      );
  }
};

export const Loading: FC<Props> = ({
  isLoading,
  className,
  children,
  relative = false,
  type = LoadingType.grid,
}) => {
  if (isLoading || !children) {
    return (
      <div data-testid="loading" className={className}>
        <InnerLoading type={type} relative={relative} />
      </div>
    );
  }

  return children;
};
