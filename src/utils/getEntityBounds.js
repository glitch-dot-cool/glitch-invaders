export const getEntityBounds = (entity, shape = "square") => {
  switch (shape) {
    case "square":
      return getSquareBounds(entity);
    case "rect":
      return getRectBounds(entity);
  }
};

const getSquareBounds = (entity) => {
  const halfEntitySize = entity.size * 0.5;

  return {
    right: entity.x + halfEntitySize,
    left: entity.x - halfEntitySize,
    top: entity.y - halfEntitySize,
    bottom: entity.y + halfEntitySize,
  };
};

const getRectBounds = (entity) => {
  const halfEntityWidth = entity.width * 0.5;
  const halfEntityHeight = entity.height * 0.5;

  return {
    right: entity.x + halfEntityWidth,
    left: entity.x - halfEntityWidth,
    top: entity.y - halfEntityHeight,
    bottom: entity.y + halfEntityHeight,
  };
};
