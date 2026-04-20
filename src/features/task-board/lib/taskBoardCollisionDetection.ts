import type {
  ClientRect,
  CollisionDetection,
  DroppableContainer,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { closestCorners } from '@dnd-kit/core';

const COLUMN_ID_PREFIX = 'task-board-column:';

function isColumnDroppableId(id: string): boolean {
  return id.startsWith(COLUMN_ID_PREFIX);
}

function isPointInRect(
  point: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.left + rect.width &&
    point.y >= rect.top &&
    point.y <= rect.top + rect.height
  );
}

function distanceSquaredToRectCenter(
  pointer: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = pointer.x - cx;
  const dy = pointer.y - cy;
  return dx * dx + dy * dy;
}

function verticalDistanceToRect(pointerY: number, rect: { top: number; height: number }): number {
  const bottom = rect.top + rect.height;
  if (pointerY < rect.top) return rect.top - pointerY;
  if (pointerY > bottom) return pointerY - bottom;
  return 0;
}

function getColumnStatusFromData(container: DroppableContainer): string | null {
  const currentData = container.data?.current as Record<string, unknown> | undefined;
  return typeof currentData?.columnStatus === 'string' ? currentData.columnStatus : null;
}

type Entry = { id: UniqueIdentifier; rect: ClientRect };

export const taskBoardCollisionDetection: CollisionDetection = (args) => {
  const { active, droppableContainers, droppableRects, pointerCoordinates } = args;
  const activeId = String(active.id);

  if (!pointerCoordinates) return closestCorners(args);

  type ColumnEntry = Entry & { status: string };
  const columns: ColumnEntry[] = [];
  const cardsByColumnStatus = new Map<string, Entry[]>();
  const cardContainerMap = new Map<string, DroppableContainer>();

  for (const container of droppableContainers) {
    const id = String(container.id);
    const rect = droppableRects.get(container.id);
    if (!rect) continue;

    if (isColumnDroppableId(id)) {
      const colStatus = getColumnStatusFromData(container) ?? id.replace(COLUMN_ID_PREFIX, '');
      columns.push({ id: container.id, rect, status: colStatus });
    } else if (id !== activeId) {
      cardContainerMap.set(id, container);
      const cardColStatus = getColumnStatusFromData(container);
      if (cardColStatus) {
        const list = cardsByColumnStatus.get(cardColStatus) ?? [];
        list.push({ id: container.id, rect });
        cardsByColumnStatus.set(cardColStatus, list);
      }
    }
  }

  let targetColumn = columns.find((col) => isPointInRect(pointerCoordinates, col.rect)) ?? null;

  if (!targetColumn && columns.length > 0) {
    targetColumn = columns.reduce((best, col) => {
      const bestDist = distanceSquaredToRectCenter(pointerCoordinates, best.rect);
      const colDist = distanceSquaredToRectCenter(pointerCoordinates, col.rect);
      return colDist < bestDist ? col : best;
    });
  }

  if (!targetColumn) return closestCorners(args);

  const cardsInColumn = cardsByColumnStatus.get(targetColumn.status) ?? [];

  if (cardsInColumn.length === 0) {
    return [{ id: targetColumn.id }];
  }

  const directHits = cardsInColumn.filter((c) => isPointInRect(pointerCoordinates, c.rect));
  if (directHits.length > 0) {
    directHits.sort(
      (a, b) =>
        distanceSquaredToRectCenter(pointerCoordinates, a.rect) -
        distanceSquaredToRectCenter(pointerCoordinates, b.rect),
    );
    return [{ id: directHits[0].id }];
  }

  const bottomMostEdge = Math.max(...cardsInColumn.map((c) => c.rect.top + c.rect.height));
  if (pointerCoordinates.y > bottomMostEdge) {
    return [{ id: targetColumn.id }];
  }

  const nearest = cardsInColumn.reduce((best, card) => {
    const d = verticalDistanceToRect(pointerCoordinates.y, card.rect);
    const bd = verticalDistanceToRect(pointerCoordinates.y, best.rect);
    return d < bd ? card : best;
  });

  return [{ id: nearest.id }];
};
