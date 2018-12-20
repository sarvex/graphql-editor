import { style } from 'typestyle';

import { sizeSidebar } from './vars';
import { Colors } from './colors';

export const Sidebar = style({
  width: sizeSidebar,
  maxHeight: '100vh',
  flex: 1,
  zIndex: 2,
  transition: 'transform 0.4s, background-color 0.4s',
  display: 'flex',
  flexDirection: 'column',
  background: Colors.grey[8]
});

export const SidebarHidden = style({
  background: 'transparent',
  transform: `translate(${-sizeSidebar + 50}px,0)`
});

export const Pre = style({
  padding: 20,
  paddingBottom: 100,
  fontSize: 12,
  width: '100vw'
});

export const Toolbar = style({
  flex: '0 0 52px',
  padding: 8,
  display: 'flex',
  background: '#00000033',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

export const ToolbarHidden = style({
  borderBottomRightRadius: 16
});

export const CodeContainer = style({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexFlow: 'column'
});

export const CodeContainerHidden = style({
  flex: 1,
  overflowY: 'hidden'
});

export const SidebarControl = style({
  marginLeft: 12
});

export const FlippedButton = style({
  transform: 'rotate(180deg)'
});
export const ClipboardButton = style({
  position: 'absolute',
  padding: 15,
  bottom: 0,
  right: 0,
  textAlign: 'right'
});
