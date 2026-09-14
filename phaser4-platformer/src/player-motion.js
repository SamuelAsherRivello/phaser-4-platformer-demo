export function moveHorizontalVelocityTowardsInput(currentVelocity, horizontalInput, maximumSpeed, maximumVelocityChange) {
  const targetVelocity = horizontalInput * maximumSpeed;

  return Math.min(
    Math.max(targetVelocity, currentVelocity - maximumVelocityChange),
    currentVelocity + maximumVelocityChange,
  );
}
