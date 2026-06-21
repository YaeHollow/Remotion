import React from 'react';
import { Series, Composition } from 'remotion';
import { Hook } from './scenes/Hook';
import { MapOverlay } from './scenes/MapOverlay';
import { TriangleDiagram } from './scenes/TriangleDiagram';
import { SpacecraftCemetery } from './scenes/SpacecraftCemetery';
import { SparseOcean } from './scenes/SparseOcean';
import { Closer } from './scenes/Closer';

export const Main: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={150}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <MapOverlay />
      </Series.Sequence>
      <Series.Sequence durationInFrames={450}>
        <TriangleDiagram />
      </Series.Sequence>
      <Series.Sequence durationInFrames={450}>
        <SpacecraftCemetery />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <SparseOcean />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <Closer />
      </Series.Sequence>
    </Series>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={1950}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
