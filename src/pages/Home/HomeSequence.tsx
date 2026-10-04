import { Hero } from './Hero/Hero';
import { Archive } from './Archive/Archive';
import { HomeBackgrounds } from './HomeBackgrounds';
import { ArchiveCard } from './Archive/ArchiveCard';
import { archiveMemories } from './homeData';
export function HomeSequence() {
  return (
    <section className="story-track" id="home" aria-label="S4DS opening sequence">
      <div className="story-stage">
        <HomeBackgrounds />
        <Archive />
        <div className="deck-position">
          <div className="story-camera">
            <div className="story-carousel">
              <Hero />

              {archiveMemories.map((memory) => (
                <ArchiveCard key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
