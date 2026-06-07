import { profile } from './data/profile';
import { projects } from './data/projects';
import { timeline } from './data/timeline';
import { prompts } from './data/prompts';
import { insights } from './data/insights';
import { reading } from './data/reading';

import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Timeline } from './sections/Timeline';
import { Prompts } from './sections/Prompts';
import { Insights } from './sections/Insights';
import { Reading } from './sections/Reading';
import { Contact } from './sections/Contact';

export default function App() {
  return (
    <div className="page">
      <main>
        <Hero profile={profile} />
        <Projects projects={projects} />
        <Timeline items={timeline} />
        <Prompts prompts={prompts} />
        <Insights insights={insights} />
        <Reading reading={reading} />
      </main>
      <Contact profile={profile} />
    </div>
  );
}
