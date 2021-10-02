export const rectCollisionDetect = (entityA, entityB) => {
  if (
    entityA.right > entityB.left &&
    entityA.left < entityB.right &&
    entityA.bottom > entityB.top &&
    entityA.top < entityB.bottom
  ) {
    return true;
  }
  return false;
};
