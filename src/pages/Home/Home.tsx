import { useLayoutEffect, useRef } from 'react';
import { HomeSequence } from './HomeSequence';
import { Footer } from './Footer/Footer';
import { mountHomeAnimations } from './homeAnimations';

export function Home({ skipIntro }: { skipIntro: boolean }) {
  const initialSkipIntro = useRef(skipIntro).current;
  useLayoutEffect(() => mountHomeAnimations(initialSkipIntro), [initialSkipIntro]);
  return (
    <>
      <HomeSequence />
      <Footer />
    </>
  );
}
