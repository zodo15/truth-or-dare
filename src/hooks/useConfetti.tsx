import { useCallback, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { FC, ReactElement } from 'react';

interface ConfettiComponentProps {
  width: number;
  height: number;
}

export default function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const startConfetti = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopConfetti = useCallback(() => {
    setIsActive(false);
  }, []);

  const ConfettiComponent: FC = (): ReactElement | null => {
    if (!isActive) return null;
    
    return (
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
        recycle={false}
        colors={['#ff62b2', '#9f7aea', '#4fd1c5']}
        onConfettiComplete={() => setIsActive(false)}
      />
    );
  };

  return { 
    startConfetti, 
    stopConfetti,
    ConfettiComponent 
  };
} 