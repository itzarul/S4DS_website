import { useLayoutEffect, useRef } from 'react';
import { StoryExperience } from './StoryExperience';
import { Footer } from './Footer/Footer';
import { mountHomeExperience } from './homeExperience';

export function Home({ skipIntro }: { skipIntro: boolean }) {
  const initialSkipIntro = useRef(skipIntro).current;
  useLayoutEffect(() => mountHomeExperience(initialSkipIntro), [initialSkipIntro]);
  return (
    <>
      <StoryExperience />
      <Footer />
    </>
  );
}
