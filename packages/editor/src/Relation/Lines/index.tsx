import { Draw } from './Draw';
import { getTypeName, ParserField } from 'graphql-js-tree';
import React from 'react';
import { useTheme, useTreesState } from '@/state/containers';
import styled from '@emotion/styled';
import { NumberNode } from 'graphql-editor-worker';

const RelationsContainer = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  stroke: ${({ theme }) => theme.neutral[500]};
  fill: transparent;
  stroke-width: 2px;
  transform: translatez(0);
  margin: -20px;
  overflow: visible;
`;

export interface RelationPath {
  field: NumberNode;
  index: number;
  connectingField: ParserField;
}
interface LinesProps {
  relations:
    | { to: RelationPath; from: RelationPath[]; fromLength: number }[]
    | undefined;
}

export const Lines: React.FC<LinesProps> = ({ relations }) => {
  const { theme } = useTheme();
  const { selectedNodeId } = useTreesState();

  return (
    <RelationsContainer>
      {relations?.map((r, index) => {
        return r.from?.map((rf, relationNumber) => {
          const relationType = rf.connectingField.type.fieldType;
          if (selectedNodeId?.value) {
            if (
              rf.field.id !== selectedNodeId.value.id &&
              r.to.field.id !== selectedNodeId.value.id
            ) {
              return null;
            }
          }
          return (
            <Draw
              relationType={relationType}
              color={
                (theme.colors as any)[
                  getTypeName(rf.field.parserField.type.fieldType)
                ]
              }
              key={`${index}-${rf.index}-${relationNumber}-${rf.field.parserField.name}-${rf.connectingField.name}`}
              from={rf.field}
              to={r.to.field}
            />
          );
        });
      })}
    </RelationsContainer>
  );
};
