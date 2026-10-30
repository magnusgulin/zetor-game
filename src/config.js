// Logical resolution. Everything is drawn at this size and scaled up
// with nearest-neighbour filtering for the 8-bit look.
export const WIDTH = 240;
export const HEIGHT = 400;

// Body text needs å, ä and ö in capitals too; the logo font does not have them.
export const FONT = 'Jersey 10';
export const LOGO_FONT = 'Press Start 2P';

// A small NES-like palette. Sprites and backgrounds pick from this.
export const PAL = {
  k: '#000000',
  w: '#fcfcfc',
  r: '#d82800',
  R: '#881400',
  y: '#f8b800',
  Y: '#fce0a8',
  g: '#00a800',
  G: '#005800',
  h: '#58d854',
  b: '#0058f8',
  B: '#0000bc',
  s: '#fcbcb0',
  S: '#c84c0c',
  n: '#7c7c7c',
  N: '#bcbcbc',
  o: '#ac7c00',
  O: '#503000',
  c: '#3cbcfc',
  t: '#a4e4fc',
  p: '#6844fc',
  // Zetor 25A paint: pale green body, yellow wheel rims.
  z: '#b8e0a0',
  Z: '#80b878',
  x: '#4a7c48',
  q: '#c88c00',
};
