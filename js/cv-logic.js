function drawIndexCardBoundingBox(src, gray, blurred, edges, output) {
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
  cv.Canny(blurred, edges, 50, 150);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE,
  );

  let maxArea = 0;
  let maxContour = null;

  for (let i = 0; i < contours.size(); i++) {
    let contour = contours.get(i);
    let area = cv.contourArea(contour);

    if (area > maxArea) {
      let approx = new cv.Mat();
      cv.approxPolyDP(
        contour,
        approx,
        0.02 * cv.arcLength(contour, true),
        true,
      );

      if (approx.rows >= 3 && area > 10000) {
        maxArea = area;
        if (maxContour !== null) {
          maxContour.delete();
        }
        maxContour = approx.clone();
      }
      approx.delete();
    }
  }

  let finalContour = null;
  if (maxContour && maxContour.rows >= 3) {
    if (previousContour !== null) previousContour.delete();
    previousContour = maxContour.clone();
    finalContour = maxContour;
    stabilityCounter = 0;
  } else if (previousContour !== null && stabilityCounter < 15) {
    finalContour = previousContour;
    stabilityCounter++;
  }

  if (finalContour && finalContour.rows >= 3) {
    let points = [];
    for (let i = 0; i < finalContour.rows; i++) {
      points.push(
        new cv.Point(
          finalContour.data32S[i * 2],
          finalContour.data32S[i * 2 + 1],
        ),
      );
    }

    // Ensure points are sorted in the correct order: top-left, top-right, bottom-right, bottom-left
    if (points.length === 4) {
      points = sortPoints(points);
    }

    for (let i = 0; i < points.length; i++) {
      cv.line(
        output,
        points[i],
        points[(i + 1) % points.length],
        [0, 255, 0, 255],
        3,
      );
    }
  }

  cleanupMats([contours, hierarchy]);
  if (maxContour && maxContour !== previousContour) maxContour.delete();
}

function sortPoints(points) {
  // Sort points based on their x + y sum and differences
  points.sort((a, b) => a.y - b.y || a.x - b.x);

  let topPoints = points.slice(0, 2).sort((a, b) => a.x - b.x);
  let bottomPoints = points.slice(2, 4).sort((a, b) => a.x - b.x);

  return [topPoints[0], topPoints[1], bottomPoints[1], bottomPoints[0]];
}
