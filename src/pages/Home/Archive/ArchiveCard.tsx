import type { ArchiveMemory } from '../homeData';

export function ArchiveCard({ memory }: { memory: ArchiveMemory }) {
  return (
    <article id={memory.anchor ?? undefined} className={memory.className} aria-hidden="true">
      <div className="story-card-face story-card-face--front story-card-face--photo">
        <img className="story-card-photo" src={memory.image} alt={memory.alt} decoding="async" />
      </div>
      <div className="story-card-face story-card-face--back story-card-face--photo">
        <img className="story-card-photo" src={memory.image} alt="" decoding="async" />
      </div>
    </article>
  );
}
