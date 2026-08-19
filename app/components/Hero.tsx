'use client';

import ScrollExpand from '../../components/ScrollExpand';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2069&auto=format&fit=crop';

export default function Hero() {
  return (
    <div style={{ backgroundColor: '#D2C7E5' }}>
      <ScrollExpand
        src={HERO_IMAGE}
        alt="Product hero"
        title="Built to scale"
        scrollHint="Scroll inside the frame"
        useWindowScroll
      >
        <h2>Every pixel, everywhere</h2>
        <p>
          The frame opens up as you scroll and hands the whole stage to your
          media.
        </p>
      </ScrollExpand>
    </div>
  );
}