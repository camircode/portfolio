import { Composition } from 'remotion';
import { PortalDemo, portalDemos } from './PortalDemo';

export const RemotionRoot = () => (
  <>
    {portalDemos.map((demo) => (
      <Composition
        key={demo.slug}
        id={`Portal-${demo.slug}`}
        component={PortalDemo}
        durationInFrames={216}
        fps={24}
        width={1280}
        height={720}
        defaultProps={{ demo }}
      />
    ))}
  </>
);
