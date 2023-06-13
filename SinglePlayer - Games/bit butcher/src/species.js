const size = 24;
const ri = randInt;
const MUTANT_CHANCE = 20; // 1 out of 20

function fixPoint(n) {
	return Math.max(Math.min(Math.round(n), size), 0);
}

function addMid(obj) {
	obj.midX = fixPoint(obj.x + (obj.sizeX / 2));
	obj.midY = fixPoint(obj.y + (obj.sizeY / 2));
	obj.endX = fixPoint(obj.x + obj.sizeX);
	obj.endY = fixPoint(obj.y + obj.sizeY);
}

function getSpecies(color) {
	let r = color ? color.r * 255 : ri(180) + 20,
		g = color ? color.g * 255 : ri(180) + 20,
		b = color ? color.b * 255 : ri(180) + 20;
	const bodyW = ri(6, size * .6),
		bodyL = ri(6, size * .6),
		bodyH = ri(5, size * .6);
	const bodyLevel = ri(0, size - bodyH - 2); // leave space for feet
	const headH = ri(6, size * .5); // size / 3 + rand(size / 5);
	const headW = ri(8, size * .6);
	const headLevel = ri(0, size - headH - size * .2);
	const eyeLevel = ri(2, headH - 4);
	const eyeGap = ri(1, headW * .5)
	const mouthW = ri(3, headW - 4);
	const mouthH = ri(1, 2);
	return {
		baseColor: [r-20,g-20,b-10],
		backColor: [r-40,g-40,b-20],
		forwardColor: [r,g,b],
		eyeColor: (ri(2) === 0) ? [0,0,0] : [200,200,200],
		headW, headH, headLevel,
		bodyW, bodyL, bodyH, bodyLevel,
		eyeW: ri(1, 3),
		eyeH: ri(1, 3),
		eyeLevel,
		eyeGap,
		mouthW,
		mouthH,
		mouthLevel: ri(2, headH - eyeLevel - mouthH),
		frontKneeBend: ri(-4, -1),
		backKneeBend: ri(-4, 3),
		kneeWidth: 2,
		legWidth: Math.min(bodyW / 2, ri(1, 6)),
	};
}

function breedRandomValue(bioParents, key) {
	// First parent in array is considered the dominant parent
	const dominantParentValue = bioParents[0][key];
	// If it's a number value, then determine randomly
	if (typeof dominantParentValue === 'number') {
		const range = bioParents.reduce((rangeArr, species) => {
			const value = species[key];
			if (value < rangeArr[0]) rangeArr[0] = value;
			if (value > rangeArr[1]) rangeArr[1] = value;
			return rangeArr;
		}, [Infinity, -Infinity]); // index 0 is min, index 1 is max
		return ri(range[0], range[1]);
	}
	// Otherwise just use the dom parent's value e.g. for colors
	return dominantParentValue;
}

function breedSpecies(bioParents) {
	if (!bioParents) return;
	const newDna = getSpecies();
	Object.keys(newDna).forEach((key) => {
		if (ri(MUTANT_CHANCE) > 0) newDna[key] = breedRandomValue(bioParents, key);
	});
	return newDna;
}

function getLegPoints(x, y, kneeY, legWidth, kneeBend, kneeWidth, lift) {
	const len = size - y;
	const liftAmount = Math.floor((len / 2) * lift);
	const footY = size - liftAmount;
	const liftKneeY = kneeY - (liftAmount / 2);
	// TODO: This is not symmmetric, doesn't look correct when leg is pointing right
	const kneeX = Math.max(0, x + kneeBend + (kneeBend * lift));
		return [
		x, y, // hip - top left
		x + legWidth, y, // hip - top right
		kneeX + kneeWidth, liftKneeY, // right side of knee (back if left)
		x + legWidth, footY, // foot (heel if left)
		x, footY, // foot - toe
		kneeX, liftKneeY, // knee
	];
}

function drawSpecies(ctx, pos, species, direction = 4, t = 0) {
	// const { x, y } = worldToScreen(pos);
	const {
		baseColor, backColor, forwardColor, eyeColor,
		bodyW, bodyL, bodyH, bodyLevel,
		headW, headH, headLevel,
		eyeW, eyeH, eyeLevel, eyeGap,
		mouthW, mouthH, mouthLevel,
		frontKneeBend, backKneeBend, kneeWidth, legWidth,
	} = species;
	const showEyes = (direction >= 2 && direction <= 6);
	const kneeDirectionMultipliers = [0, -.5, -1, -.5, 0, .5, 1, .5];
	const kneeDirectionMultiplier = kneeDirectionMultipliers[direction];
	const xMultipliers = [.5, .75, 1, .75, .5, .25, 0, .25];
	const xMultiplier = xMultipliers[direction];
	const head = {
		x: (size - headW) * xMultiplier,
		y: headLevel,
		sizeX: headW, sizeY: headH,
	};
	const bodyActualW = (bodyW + bodyL) / 2;
	const bodyXMult = ((1 - xMultiplier) + 1) / 3; // once we get body actualW working we can decrease this effect and make it .5
	const body = {
		x: (size - bodyActualW) * bodyXMult,
		y: bodyLevel,
		sizeX: bodyActualW, sizeY: bodyH,
	};
	addMid(head);
	addMid(body);
	const legLength = (size - body.endY) / 2;
	const kneeY = fixPoint(body.endY + legLength);
	const lift = (Math.sin(t) + 1) / 2;
	const kneeBend = frontKneeBend * kneeDirectionMultiplier;
	const frontLegPoints = getLegPoints(body.x, body.endY, kneeY, legWidth, kneeBend, kneeWidth, 1 - lift);
	const backLegPoints = getLegPoints(body.endX - legWidth, body.endY, kneeY, legWidth, kneeBend, kneeWidth, lift);
	const neckPoints = [
		head.midX - (headW / 4), head.midY,
		head.midX + (headW / 4), head.midY,
		body.midX + (bodyActualW / 4), body.midY - 1,
		body.midX - (bodyActualW / 4), body.midY - 1,
	];
	const headCenterX = head.x + (headW * xMultiplier);
	const eyeOffset = Math.max(1, eyeGap / 2);
	const eye1 = {
		x: headCenterX - eyeOffset - eyeW,
		y: head.y + eyeLevel,
		sizeX: eyeW, sizeY: eyeH,
	};
	const eye2 = {
		x: headCenterX + eyeOffset,
		y: eye1.y,
		sizeX: eyeW, sizeY: eyeH,
	};
	const mouthX = Math.max(headCenterX - (mouthW / 2), head.x);
	const mouthEndX = Math.min(mouthX + mouthW, head.endX);
	const mouth = {
		x: mouthX,
		y: head.y + eyeLevel + mouthLevel,
		sizeX: mouthEndX - mouthX,
		sizeY: mouthH,
	};

	// TODO: Fix this?
	const offsetX = -.5; // -12;
	const offsetY = -.5; // -12;
	const offsetScale = 0.055;
  	const drawMyPolygon = (p, c) => {
		drawCanvas2D(pos, vec2(offsetScale), 0, 0, (ctx) => drawPolygon(ctx, offsetX, offsetY, p, c));
	};
	const drawMyPart = (p, c) => {
		drawCanvas2D(pos, vec2(offsetScale), 0, 0, (ctx) => drawPart(ctx, offsetX, offsetY, p, c));
	};
	if (!showEyes) {
		drawMyPart(head, backColor);
		drawMyPolygon(neckPoints, baseColor);
		drawMyPolygon(frontLegPoints, baseColor);
		drawMyPolygon(backLegPoints, baseColor);
		drawMyPart(body, baseColor);
	} else {
		drawMyPart(body, baseColor);
		drawMyPolygon(neckPoints, baseColor);
		drawMyPolygon(frontLegPoints, baseColor);
		drawMyPolygon(backLegPoints, baseColor);
		drawMyPart(head, forwardColor);
		if (eye1.x >= head.x) {
			drawMyPart(eye1, eyeColor);
		}
		if (eye2.x <= head.x + headW) {
			drawMyPart(eye2, eyeColor);
		}
		drawMyPart(mouth, [0,0,0]);
	}
}

function getColorStyle(color) {
	if (!color) return '#fff';
  const c = (i) => Math.max(0, Math.min(255, color[i]));
  return `rgb(${c(0)},${c(1)},${c(2)}`;
}

function drawPolygon(ctx, x, y, points, color) {
	ctx.fillStyle = getColorStyle(color);
	ctx.beginPath();
	points.forEach((n, i) => {
		if (i % 2 === 1) return; // skip odd indices
		const fn = i === 0 ? 'moveTo' : 'lineTo';
		ctx[fn](
			Math.round(x * size + n),
			Math.round(y * size + points[i + 1])
		);
	});
	ctx.closePath();
	ctx.fill();
}

function drawPart(ctx, x, y, part, color) {
	ctx.fillStyle = getColorStyle(color);
	ctx.fillRect(
		Math.round(x * size + part.x),
		Math.round(y * size + part.y),
		Math.round(part.sizeX),
		Math.round(part.sizeY),
	);
}

export { getSpecies, breedSpecies, drawSpecies };
