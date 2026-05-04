export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseResult {
  angle: number;
  correct: boolean;
  feedback: string;
}

export function calculateAngle(
  pointA: PoseLandmark,
  pointB: PoseLandmark,
  pointC: PoseLandmark
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return Math.round(angle);
}

export function analyzePose(
  landmarks: PoseLandmark[],
  targetAngle: number,
  tolerance: number = 10
): PoseResult {
  if (!landmarks || landmarks.length < 3) {
    return {
      angle: 0,
      correct: false,
      feedback: 'Unable to detect pose',
    };
  }

  const angle = calculateAngle(landmarks[0], landmarks[1], landmarks[2]);
  const diff = Math.abs(angle - targetAngle);
  const correct = diff <= tolerance;

  let feedback = 'Good form!';
  if (!correct) {
    if (angle < targetAngle) {
      feedback = 'Extend more';
    } else {
      feedback = 'Reduce extension';
    }
  }

  return {
    angle,
    correct,
    feedback,
  };
}

export function generateMockPoseLandmarks(exerciseType: 'knee' | 'shoulder' | 'hip'): PoseLandmark[] {
  const baseVariation = Math.random() * 0.1 - 0.05;

  switch (exerciseType) {
    case 'knee':
      return [
        { x: 0.5 + baseVariation, y: 0.3, visibility: 0.9 },
        { x: 0.5 + baseVariation, y: 0.5, visibility: 0.95 },
        { x: 0.5 + baseVariation, y: 0.7, visibility: 0.9 },
      ];
    case 'shoulder':
      return [
        { x: 0.3 + baseVariation, y: 0.2, visibility: 0.9 },
        { x: 0.5 + baseVariation, y: 0.25, visibility: 0.95 },
        { x: 0.5 + baseVariation, y: 0.5, visibility: 0.9 },
      ];
    case 'hip':
      return [
        { x: 0.5 + baseVariation, y: 0.4, visibility: 0.9 },
        { x: 0.5 + baseVariation, y: 0.55, visibility: 0.95 },
        { x: 0.5 + baseVariation, y: 0.7, visibility: 0.9 },
      ];
    default:
      return [];
  }
}
