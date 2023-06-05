"use strict"
var gMonKindPackage
var w = this,
	d = document,
	gGameName = 'World of Emojis',
	gYou = {mons:[]},
	gGold,
	gQuest,
	gCameraX = 1,
	gCameraY = 1,
	gCameraZ = 100,
	gMouseMoved,
	gBattleMon,
	gBattleMonYou,
	gBattleMonSwitch,
	gRival,
	gOak,
	gHouseLab,
	gYouX = 1,
	gYouTileX,
	gYouTileX0,
	gYouSpeedY = 0,
	gYouY = 0,
	gYouY0 = 0,
	gGroundY = 53,
	gHour = 9,
	gHourOld = 1,
	gKeyDown = [],
	gKeyHit = [],
	gKeyReleased = [],
	gMobile=1,
	gTapNow,
	gTapDiv,
	gSelDiv,
	gMonDragging,
	gMonDraggedId,
	gTapHitDiv,
	s,
	s2,
	gTime,
	gPi = Math.PI,
	gRem = 1,
	gSizeX = 1,
	gSizeXRem = 1,
	gSizeY = 1,
	gState,
	gStateBeforeSceneEnter = 1,
	gStateTime = 0,
	gScene,
	gPressObjs = [],
	gPressCanObj,
	gSpeakOnClose,
	gTalkObj,
	gMonKinds = [
		{emoji: '🐡', offsetY: 1, name: 'Pufferfish', t: ['poison','water'], pow: '7☠', hp: 50},
		{emoji: '🦣', name: 'Mammoth', t: ['beast','ice'], pow: '11❄', hp: 80, reload: 1.4, repel: .8},
		{emoji: '🐓', name: 'Rooster', t: ['bird','ground'], pow: 6, hp: 40, reload: .5, repel: 1.2},
		{emoji: '🐇', name: 'Rabbit', pow: 4, hp: 30, reload: .5},
		{emoji: '🐿', name: 'Squirrel', pow: 5, hp: 20},
		{emoji: '🦗', name: 'Cricket', pow: 2, hp: 15},
		{emoji: '🐀', name: 'Rat', pow: '2☠', hp: 4},
		
		{emoji: '🐌', name: 'Snail', pow: 2, hp: 70, reload: 1.5},
		{emoji: '🦨', name: 'Skunk', pow: '4☠', hp: 50, repel: .6},
		{emoji: '🦆', name: 'Duck', pow: 5, hp: 20},
		
		{emoji: '🦖', name: 'T-Rex', pow: 30, hp: 200, repel: .5},
		{emoji: '🐉', name: 'Dragon', pow: 25, hp: 230},
		this.gMonKindCure = {emoji: '❤', name: 'Heart', pow: 1, hp: 10, flip: 1},
		{emoji: '🩹', name: 'Bandage', pow: 2, hp: 7},
		gMonKindPackage = {emoji: '📦', name: 'Package', pow: 1, hp: 10},
	],
gObjDelete = obj => {
	obj.div.remove()
	obj.shadowDiv?.remove()
	obj.hpObj && gObjDelete(obj.hpObj)
},
gBattleStart = _ => {
	gYouGo(.001)
	gButR.style.display = gButL.style.display = 'none'
	gStateSet(10)
	d.body.style.filter = 'brightness(1.5)'
	gCameraYSet(42)
	gCameraZSet(72)
	d.body.classList.add('zoom')
	setTimeout(_=>d.body.classList.add('zoom2'),501)
	setTimeout(_=>d.body.style.filter = 'none',101)
	
	var i = 3, day = gAbs(gHour - 12) < 7, len = gMonKinds.length
	if(gYouX < 444 && gRandom(1)<.5) {
		i = day ? 4 : 5
		if(gRandom() < .02) {
			i = 6
		}
	}
	if(gScene == gSceneForest) {
		i = gRandom(len-5)|0
		if(gRandom() < .01) {
			i = day ? len-5 : len-4
		}
	}
	var kind = gMonKinds[i]
	var mon = gBattleMon = gObjMake(kind, gYouX+6, .4, 55, 4, 0, .05, 2)
	gObjTransitionDurationSet(mon, .5)
	
	gBattleMonYou = gYou.mons[0]
	
	
	setTimeout(_=>{
		var mons0 = gYou.mons[0]
		gObjTransitionDurationSet(mons0, .5)
		gGuySpeak(gYou,`Zombie ${kind.name} appeared!`, _=>{
			mons0.x += 3.2
			for(var mon of gYou.mons) {
				mon.x += 4
				gObjMoved(mon)
			}
			gGuySpeak(gYou,`Go ${mons0.monKind.name}!`, _=>{
				gObjTransitionDurationSet(mons0, .1)
				gStateSet(11)
			})
			gSongMake(gBattleSong, 2)
		})
		gSoundEffectPlay(gSoundBattleStart)
	}, 500)
},
gMonHpBarMake = mon => {
	var x = gYou.mons.includes(mon) ? -3:6
	var o = mon.hpObj = gObjMake("<div style='width:3.5rem;height:.5rem;background:#000;margin:.05rem;position:relative'><div style='height:100%'></div></div>❤<span style='font-family:comic sans ms'></span>", gYouX+x, 1, 55, 1.6, 1)
	mon.hpDiv = o.div.lastChild
	mon.hpBarDiv = o.div.firstChild.firstChild
},
gMonHitSoundPlay = mon => {
	var pitch = 30-mon.reloadMax/5
	gSoundEffectPlay(mon.hS ||= gSoundEffectMake([pitch, pitch, mon.monKind.pow/100, 2, 2]))
},
gMonDamageGet = mon => mon.monKind.pow*(gRandom(.6)+.7)|0,
gMonHpSet = (mon,hp) => {
	if(hp<0)hp=0
	if(hp && !mon.hp) {
		gClassAdd(mon.div, 'dead')
	}
	if(!hp && mon.hp) {
		gClassAdd(mon.div, 'dead', 1)
		gSoundEffectPlay(gSoundMonDie)
	}
	mon.hp = hp
	var p = mon.hp/mon.hpMax
	if(mon.hpDiv) {
		mon.hpDiv.innerHTML = hp|0
		mon.hpBarDiv.style.width = p*100+'%'
		mon.hpBarDiv.style.background = `rgb(${255*(1-p)|0},${255*p|0},0)`
	} else {
		mon.div.lastChild.lastChild.lastChild.lastChild.style.width= (1-p)*100+'%'
	}
},
gBattleEnd = _ => {
	gButR.style.display = gButL.style.display = 'block'
	gCameraYSet(gScene.cameraY)
	gCameraZSet(gScene.cameraZ)
	d.body.classList.remove('zoom')
	d.body.classList.remove('zoom2')
	gBattleMon = 0
	gStateSet(1)
	gYouGo(-.001)
	gSongMake(gScene.song, 2)
	gGameSave()
	gGoldSet(gGold+1)
},
gBattleSwitchNext = _ => {
	for(var mon of gYou.mons) {
		if(mon.hp) {
			gBattleMonSwitch = mon
			break
		}
	}
	gStateSet(11)
	if(!gBattleMonSwitch) {
		d.body.style.filter = 'grayscale(1)'
		gDead.style.display = 'flex'
		gStateSet(16)
	}
},
gYouMonGet = (kind) => {
	var o = gObjMake(kind, 0, 0, 55, 4-(kind==gMonKindCure), 0, 0, 4)
	gYou.mons.push(o)
	setTimeout(gYouMonsRender,44)
	gSoundEffectPlay(gSoundItemGet)
	if(gScene)gGameSave()
	return o
},
//kind 0=regular, 1=you, 2=zombienpc, 3=nonzombienpc, 4=yours
gObjMake = (emoji, x, y, z, sizeY, shadowNo, offsetY, kind, speech, sceneGo) => {
	if(!offsetY)offsetY = .07
	var monKind
	if(emoji.name) {
		monKind = emoji
		emoji = emoji.emoji
	}
	var obj = {emoji, x, y, z, sizeY, offsetY, kind, monKind, speech, scene:gScene, sceneGo, shadowNo}
	
	if(speech || sceneGo) gPressObjs.push(obj)
	
	if(speech) {
		obj.onPress = _ => {
			gGuySpeak(obj)
		}
		obj.onLeave = gSpeakNo
	}
	if(sceneGo) {
		obj.onPress = _ => {
			gCameraYSet(sceneGo.cameraY)
			gCameraZSet(sceneGo.cameraZ)
			gStateBeforeSceneEnter = gState
			gStateSet(2)
			gYou.div.style.transition = 'translate .4s ease'
			if(gScene == gSceneWorld || sceneGo == gSceneBedroom) {
				gYou.div.style.translate = '0 0 -5rem'
			} else if(gScene == gSceneBedroom) {
				gYou.div.style.translate = '0 1rem 2rem'
			} else {
				gYou.div.style.translate = '-2rem 0 2rem'
			}
			gSoundEffectPlay(gSoundDoor)
			setTimeout(_=>{
				gSceneEnter(sceneGo)
			},200)
		}
	}
	obj.div = d.createElement('div')
	obj.div.className = 'obj obj'+gScene.i+(z>55?' near':'')+(kind==4?' mon':'')+(kind==2?' zombie':'')
	s = obj.div.style
	s.fontSize = s.height = sizeY+'rem'
	s.zIndex = z+(shadowNo==3?0:2000)|0
	var h = emoji
	if(kind) {
		
		//var hpBar = kind==4?`<div style='position:absolute;width:80%;left:10%;top:.6rem;height:.4rem;background:#000'><div style='height:100%'></div></div>`:''
		var zombie = kind==4?`<div style="position:absolute;top:0;width:0;overflow:hidden" class="zombie">${emoji}</div>`:''
		h = `<div><div class=flipper><div class=walker>${emoji}${zombie}</div></div></div>`
	}
	obj.div.innerHTML = h
	var container = z>1 ? gLayer2 : gLayer1
	
	if(!shadowNo || shadowNo == 2) {
		obj.shadowDiv = d.createElement('div')
		obj.shadowDiv.className = 'shadow0 obj obj'+gScene.i+(z>55?' near':'')+(kind==4?' mon':'')
		s2 = obj.shadowDiv.style
		s2.fontSize = s2.height = sizeY+'rem'
		s2.zIndex = ~~z+100
		var height = z>52&&z<60 ? ";height:"+sizeY+"rem" : ''
		if(kind)
			h = "<div><div class=shadow"+(shadowNo==2?'OnWall':'')+"><div class=flipper><div class=walker>"+emoji+"</div></div></div></div>"
		else
			h = `<div class=shadow${shadowNo==2?'OnWall':''}>${emoji}</div>`
		obj.shadowDiv.innerHTML = h
		container.appendChild(obj.shadowDiv)
	}
	
	container.appendChild(obj.div)
	
	gObjMoved(obj)
	
	if(monKind) {
		if(gState == 10) {
			gMonHpBarMake(obj)
		}
		gMonHpSet(obj, obj.hpMax=monKind.hp)
		obj.reloadMax = monKind.reload*50
		obj.reload = 5
	}
	
	return obj
},
gObjZSet = (obj,z) => {
	obj.z = z
	obj.div.style.zIndex = ~~z+2000
},
gObjMoved = obj => {
	var x=obj.x, y=obj.y, z=obj.z
	var y2 = y + obj.offsetY*4
	var s = obj.div.style
	var s2 = obj.shadowDiv?.style, st, t=_=>`translate3d(calc(var(--youX) + ${x}rem - var(--cameraX)),calc(${_}rem - 100%),${z}rem)`,
	u=_=>`translate3d(calc(var(--youX) - var(--cameraX) - 3.5rem),calc(${_}rem - 100%),${z}rem)`
	
	if(z > 1){
		y += gGroundY
		y2 += gGroundY
		if(obj.kind == 1) {
			s.transform = u(y2)
			st          = u(y)
		} else if(obj.kind == 4) {
			s.transform = t(y2)
			st          = t(y)
		} else {
			s.transform = `translate3d(calc(${x}rem - var(--cameraX)),calc(${y2}rem - 100%),${z}rem)`
			st = `translate3d(calc(${x}rem - var(--cameraX)),calc(${y}rem - 100%),${z}rem)`
			if(obj.shadowNo == 3) {
				s.transform += 'rotateX(90deg)'
			}
			if(obj.shadowNo == 4) {
				s.transform += 'rotateY(90deg)'
			}
		}
	} else {
		s.transform = `translate3d(${x}rem,${y2}rem,${z}rem)`
		st = `translate3d(${x}rem,${y}rem,${z}rem)`
	}
	if(s2)s2.transform = st
},
gSpeakNo = _ => {
	if(gTalkObj)
		gSoundEffectPlay(gSoundSpeakNo)
	gSpeech.style.opacity = 0
	gSpeech.firstChild.style.transform = 'scale(0)'
	gTalkObj = 0
	gSpeakOnClose && setTimeout(gSpeakOnClose,300)
	if(gState != 1)
		gButGo.style.display = 'none'
	gbns.style.display = 'none'
},
gGuySpeak = (obj, speech, onClose) => {
	var text = speech || obj.speech
	var fs = 1.9
	if(text.length > 45)
		fs /= 1+(text.length-45)/99
	gSpeechText.style.fontSize = fs+`rem`
	gSpeechText.innerHTML = text
	
	if(obj == gYou) {
		gYou.x = gYouX-50
	}
	var x = obj.x-12.5+(gYou.mons.includes(obj)?gYouX:0)
	var offset = obj==gYou?0:23
	var min = gYouX-((offset+(gSizeXRem/100)/10)*gCameraZ/100)//166=38 100=23 100,80=16
	var left = obj.x<gCameraX+50
	if(left)x+=14
	if(x < min)x=min
	gSpeech.style.opacity = 1
	gSpeech.firstChild.firstChild.style.transform = `scaleX(${left?-1:1})`
	gSpeech.firstChild.style.transformOrigin = `${left?0:100}% 100%`
	gSpeech.firstChild.style.transform = 'scale('+(gCameraZ>99?1:.7)+')'
	gSpeech.style.transform = `translate3d(calc(${x}rem - var(--cameraX)),calc(${obj.y+55-obj.sizeY}rem - 100%),`+(obj.z+1)+`rem)`
	gSpeech.style.zIndex=~~obj.z+2001
	gTalkObj = obj
	gTalkObj.talkTime = gTime
	gSpeakOnClose = onClose
	if(gMobile && gState!=4)
		setTimeout(_=>gButGo.style.display = 'block', 400)
	gSoundEffectPlay(gSoundSpeak)
},
gGuyWalkSet = (obj, walk) => {
	gClassAdd(obj.div, 'walking', walk)
	gClassAdd(obj.shadowDiv, 'walking', walk)
},
gGuyGo = (obj, way) => {
	obj.going = 1
	obj.x += way
	var goRight = way>=0
	var did
	if(obj.goRight != goRight) {
		obj.goRight = goRight
		did = 1
		gClassAdd(obj.shadowDiv, 'flipped', goRight)
		gClassAdd(obj.div, 'flipped', goRight)
	}
	if(obj != gYou) {
		gObjMoved(obj)
	}
	return did
},
gClassAdd = (div, className, add) => {
	if(add)
		div.classList.add(className)
	else
		div.classList.remove(className)
},
gYouMonXGet = i=> {
	var space = 4
	if(gYou.mons.length > gSizeXRem/33) {
		space /=  gYou.mons.length/(gSizeXRem/33)
	}
	return i*-space*(gYou.goRight?1:-1) - 2
},
gObjTransitionDurationSet = (obj, s) => {
	obj.div.style.transitionDuration = obj.shadowDiv.style.transitionDuration = s+'s'
},
gYouMonsRender = _=> {
	var i=1
	for(var obj of gYou.mons) {
		if(obj != gMonDragging) {
			gClassAdd(obj.div, 'flipped', gYou.goRight == !obj.monKind?.flip)
			gClassAdd(obj.shadowDiv, 'flipped', gYou.goRight == !obj.monKind?.flip)
			var x = obj.x
			obj.x = gYouMonXGet(i)
			var dist = gAbs(x-obj.x)
			gObjTransitionDurationSet(obj, dist/20)
			gObjMoved(obj)
		}
		i++
	}
},
gYouGo = way => {
	
	if(gTalkObj && gYou.mons.includes(gTalkObj)) {
		gSpeakNo()
	}
	if(gGuyGo(gYou, way)) {
		gYouMonsRender()
	}
	gYouX += way*1
	var min = gScene.startX || 4
	if(gState == 1 && gScene == gSceneLab && gOak.x < 888 && !gYou.mons[0])min=20
	if(gYouX > gScene.endX) {
		gYouX = gScene.endX
	} else if(gYouX < min) {
		gYouX = min
	}
	
	min -= gSizeXRem/2*.7
	var max = Math.max(min, gScene.endX-gSizeXRem/2*1.23-(gCameraZ-80)/2)
	gCameraX = gYouX-gSizeXRem/2
	if(gCameraX > max) {
		gCameraX = max
	} else if(gCameraX < min) {
		gCameraX = min
	}
	
	var youX = gYouX, pressCanObj
	if(gState == 1) {
		for(var obj of gPressObjs) {
			if(obj.scene == gScene && youX > obj.x-1 && youX < obj.x+obj.sizeY+1) {
				pressCanObj = obj
			}
		}
		if(gPressCanObj != pressCanObj) {
			if(gPressCanObj) {
				var div = gPressCanObj.div
				if(gPressCanObj.kind)div = div.firstChild
				div.style.filter = 'unset'
				if(gTalkObj == gPressCanObj || gTalkObj == gYou)
					gPressCanObj.onLeave?.()
			}
			gPressCanObj = pressCanObj
			if(gPressCanObj) {
				var div = gPressCanObj.div
				if(gPressCanObj.kind)div = div.firstChild
				div.style.filter = 'brightness(1.1) contrast(1.2) drop-shadow(0 0 .5rem #9F0)'
			}
			
			if(gMobile) {
				gButGo.style.display = gPressCanObj ? 'block':'none'
			}
		}
	}
	
	if(gYouY > -4) {
		gYouTileX = (gYouX-2)/5|0
		if(gYouTileX != gYouTileX0) {
			gYouTileX0 = gYouTileX
			var grass = gScene.grass[gYouTileX]
			if(grass) {
				gSoundEffectPlay(gSoundGrass)
				grass.div.firstChild.classList.add('sway')
				grass.shadowDiv.firstChild.firstChild.classList.add('sway')
				setTimeout(_=> {
					grass.div.firstChild.classList.remove('sway')
					grass.shadowDiv.firstChild.firstChild.classList.remove('sway')
				}, 501)
				
				if(!gYou.mons[0] && gState==1) {
					gStateSet(5)
					gGuyGo(gOak,100-gOak.x)
					gObjSceneSet(gOak,gScene)
					gOak.div.style.transition = gOak.shadowDiv.style.transition = 'all 1s ease'
					setTimeout(_=> {
						gGuyGo(gOak,25)
						setTimeout(_=>{
							gGuySpeak(gOak, "Hey! Wait! Don't go out!", _=>{
								gGuyGo(gOak,10)
								setTimeout(_=>{
									gGuySpeak(gOak, "It's unsafe! Zombie emojis live in tall grass!", _=>{
										gGuySpeak(gOak, "You need your own emojis for your protection. I know! Here, come with me!", _=>{
											gStateSet(7)
										})
									})
								},999)
							})
						},999)
					},33)
				} else {
					if(gRandom(1) < .15 * gYou.mons[0].monKind.repel) {
						gBattleStart()
					}
				}
			}
		}
	}
	
	gLayer2.style.setProperty('--youX', gYouX+'rem')
	gLayer2.style.setProperty('--cameraX', gCameraX+'rem')
	
	if(gScene == gSceneLab) {
		if(gYouX > gOak.x+4)
			gGuyGo(gOak,.001)
		else
			gGuyGo(gOak,-.001)
	}
},
gRenderShadows = hour => {
	var skew = 0, opacity = 0, skewMax = 65
	hour ||= gHour
	if(gScene != gSceneWorld && gScene != gSceneForest)hour = 14
	
	if(hour > 5 && hour <= 19) {
		skew = skewMax*2*(.5-(hour-5)/14)
		opacity = 1
		if(hour <= 6)opacity = hour-6
		if(hour > 18)opacity = 19-hour
	}
	if(hour >= 20) {
		skew = skewMax-(hour-20)*(skewMax/5)
		opacity = 1
		if(hour < 21)opacity = hour-20
	}
	if(hour <= 5) {
		skew = -hour*(skewMax/5)
		opacity = 1
		if(hour > 4)opacity = 5-hour
	}
	
	if(gScene != gSceneWorld && gScene != gSceneForest)opacity = 1
	gLayer2.style.setProperty('--shadowSkew', skew+'deg')
	gLayer2.style.setProperty('--shadowOpacity', opacity*.4)
},
gLoop=_=>{
	gTime = Date.now()
	gYou.going = 0
	var actionInput = gKeyHit[32] || gKeyHit[13] || gKeyHit[40] || gKeyHit[83] || gTapHitDiv == gButGo
	
	if(actionInput) {
		if(gTalkObj && gState != 3 && gTime-gTalkObj.talkTime > 400) {
			gSpeakNo()
			actionInput = 0
			gKeyHit = []
			gButGo.style.display = 'none'
		}
	}
	
	if(gState == 1) {
		if(gKeyDown[87] || gKeyDown[38]) {
			if(!gYouSpeedY) {
				gYouSpeedY = -.8
			}
		}
		if(actionInput) {
			if(gPressCanObj && gTalkObj != gPressCanObj) {
				gButGo.style.display = 'none'
				gPressCanObj.onPress()
			}
		}
	} else if(gState == 3) {
		if(gKeyHit[27] || gTapHitDiv == gButNo) {
			gYesNoOnNo()
			gStateSet(1)
			gButGo.style.display = gButNo.style.display = 'none'
		}
		if(actionInput) {
			gYesNoOnYes()
			gButGo.style.display = gButNo.style.display = 'none'
		}
	} else if(gState == 7) {
		gYouGo(-.8)
		if(gOak.scene == gScene) {
			gGuyGo(gOak,-.8)
			if(gYouX < 110) {
				gOak.div.style.transition = gOak.shadowDiv.style.transition = 'none'
				gGuyGo(gOak, -.8)
				gObjSceneSet(gOak,gSceneLab)
				gGuyGo(gOak, 61-gOak.x)
			}
		}
		if(gYouX < 106) {
			gStateSet(8)
			gHouseLab.onPress()
			gRival.speech = "You have to pick one, there's an invisible wall."
		}
	} else if(gState == 11) {
		var mon = gBattleMonSwitch
		if(mon) {
			gYou.mons.splice(gYou.mons.indexOf(mon),1)
			gYou.mons.unshift(mon)
			gYouMonsRender()
			gBattleMonYou = mon
			mon.x = 1.2
			gObjMoved(mon)
			mon.reload = -5
			mon.div.style.filter = ''
			if(gBattleMonSwitch.monKind == gMonKindCure) {
				gStateSet(19)
				setTimeout(_=> {
					gObjDelete(gYou.mons.shift())
					if(gRandom(1) > gBattleMon.hp / gBattleMon.hpMax) {
						gObjDelete(gBattleMon)
						var mon = gYouMonGet(gBattleMon.monKind)
						gMonHpSet(mon, gBattleMon.hp)
						gStateSet(18)
						gGuySpeak(mon, "🥰", gBattleEnd)
					} else {
						gGuySpeak(gYou, "Failed! The zombie is too strong!", gBattleSwitchNext)
						gStateSet(17)
					}
				}, 500)
				gBattleMonSwitch = 0
				return
			}
			gBattleMonSwitch = 0
		}
		gBattleMonYou.reload++
		if(gBattleMonYou.reload >= gBattleMonYou.reloadMax) {
			gStateSet(14)
			gBattleMonYou.reload = 0
			gBattleMonYou.x++
			gObjMoved(gBattleMonYou)
			setTimeout(_=>{
				gBattleMon.x += .3
				gObjMoved(gBattleMon)
				gMonHitSoundPlay(gBattleMonYou)
				gMonHpSet(gBattleMon, gBattleMon.hp-gMonDamageGet(gBattleMonYou))
				if(gBattleMon.hp <= 0) {
					gStateSet(15)
					setTimeout(_=> {
						gObjMake('🪦', gBattleMon.x, 0, 53, 4)
						gObjDelete(gBattleMon)
						gBattleEnd()
					}, 999)
				} else {
					setTimeout(_=>{
						if(gState == 14) {
							gBattleMonYou.x--
							gObjMoved(gBattleMonYou)
							gBattleMon.x -= .3
							gObjMoved(gBattleMon)
							gStateSet(11)
						}
					}, 111)
				}
			}, 111)
		} else {
			gBattleMon.reload++
			if(gBattleMon.reload >= gBattleMon.reloadMax) {
				gStateSet(15)
				gBattleMon.reload = 0
				gBattleMon.x--
				gObjTransitionDurationSet(gBattleMon, .1)
				gObjMoved(gBattleMon)
				setTimeout(_=>{
					gBattleMonYou.x -= .3
					gObjMoved(gBattleMonYou)
					gMonHitSoundPlay(gBattleMon)
					gMonHpSet(gBattleMonYou, gBattleMonYou.hp-gMonDamageGet(gBattleMon))
					if(gBattleMonYou.hp <= 0) {
						gStateSet(15)
						setTimeout(_=> {
							gBattleSwitchNext()
						}, 999)
					} else {
						setTimeout(_=>{
							if(gState == 15) {
								gBattleMon.x++
								gObjMoved(gBattleMon)
								gBattleMonYou.x += .3
								gObjMoved(gBattleMonYou)
								gStateSet(11)
							}
						}, 111)
					}
				}, 111)
			}
		}
	} else if(gState == 8) {
		if(gTime - gStateTime > 999) {
			gYouGo(1)
			if(gYouX > gRival.x + 7) {
				gStateSet(9)
				gGuySpeak(gRival, "Gramps! I'm fed up with waiting!", _=>{
					gGuySpeak(gOak, "Rival? Let me think...", _=>{
						gGuySpeak(gOak, "Oh that's right I told you to come! Just wait!", _=>{
							gGuySpeak(gOak, "There are three zombies here. Haha!", _=>{
								gGuySpeak(gOak, "A heart will cure a zombie, then it will be yours!", _=>{
									gYouMonGet(gMonKindCure)
									gGuySpeak(gOak, "Use this heart "+gMonKindCure.emoji+" on one. Go on, choose!")
									gStateSet(1)
									gYouGo(.01)
									gScene.startX = 39
									gMom.speech = "I see you got your first emoji! Tap it to rename it."
								})
							})
						})
					})
				})
			}
		}
	} else if(gState == 4) {
		if(gYou.targetX) {
			if(gYouX > gYou.targetX) {
				gYouGo(-1)
			}
			else {
				gYouGo(.1)
				gYou.targetX = 0
			}
		}
	}
	gYouY += gYouSpeedY
	gYouSpeedY += .08
	if(gYouY > 0) {
		gYouY = 0
		gYouSpeedY = 0
	}
	if(gState == 1) {
		if(gKeyDown[65] || gKeyDown[37] || (gTapNow && gTapDiv == gButL)) {
			gYouGo(-1)
		}
		if(gKeyDown[68] || gKeyDown[39] || (gTapNow && gTapDiv == gButR)) {
			gYouGo(1)
		}
	}
	if(gYou.going0 != gYou.going) {
		gYou.going0 = gYou.going
		gGuyWalkSet(gYou, gYou.going)
		for(var obj of gYou.mons) {
			gGuyWalkSet(obj, gYou.going)
		}
	}
	if(gYouY0 != gYouY) {
		gYou.div.style.top = gYouY+'rem'
		gYouY0 = gYouY
		gYou.shadowDiv.style.transform = 'translate3d(calc(var(--youX) - var(--cameraX) - 3.5rem),calc('+(gYou.y+gGroundY)+'rem - 100%),'+(gYou.z-gYouY/2)+'rem)'
	}
	
	gHour += .01
	//gHour = gAbs(gYouX)/44 % 24
	gHour = gHour%24
	if(~~gHour != gHourOld){
		gClock.innerHTML = '&#'+(128336+~~(gHour-1)%12)+';'
		gHourOld = ~~gHour
		gRenderShadows()
		gRenderSky()
	}
	
	
	scrollTo(0,0)
	gKeyHit = []
	gKeyReleased = []
	gTapHitDiv = 0
},
gRenderSky=_=>{
	if(gScene != gSceneWorld && gScene != gSceneForest) {
		gLayer1.style.background = '#DDD'
		gLayer2.style.filter = gGround.style.filter = 'brightness(1)'
		return
	}
	var angle = gHour/24*gPi*2+gPi*1.5
	gSun.div.style.left = (Math.cos(angle)+1)/2*100+'%'
	gSun.div.style.top = 44*(1-Math.sin(angle))-10+'rem'
	angle += gPi
	gMoon.div.style.left = (Math.cos(angle)+1)/2*100+'%'
	gMoon.div.style.top = 44*(1-Math.sin(angle))-10+'rem'
	
	var b = 1
	if((gHour > 5 && gHour < 9) || (gHour > 16 && gHour < 19)) {
		var far = gHour < 9 ? (gHour-5)/4 : 1-(gHour-16)/3
		gLayer1.style.background = 'linear-gradient(rgb('+(200-far*60)+','+(204)+','+(222+far*33)+') '+(14+far*10)+'rem, rgb(255,'+(70+far*180)+','+(20+far*230)+') 54rem)'
		b = 1-(1-far**2)*.4
	} else if(gHour <= 5 || gHour >= 19) {
		var far = 0
		if(gHour <= 5 && gHour > 3)far=(gHour-3)/2
		if(gHour >= 19 && gHour < 21)far=1-(gHour-19)/2
		
		gLayer1.style.background = 'linear-gradient(rgb('+(10+far*190)+','+(24+far*180)+','+(42+far*180)+') '+(24-far*10)+'rem, rgb('+(65+far*190)+','+(110-far*40)+','+(150-far*130)+') 54rem)'
		b = .6
	} else {
		gLayer1.style.background = 'linear-gradient(#9cf 24rem, #FFF 54rem)'
	}
	gLayer2.style.filter = gGround.style.filter = `brightness(${b})`
},
gGoldSet = gold => {
	gGoldDiv.innerHTML = gGold = gold
},
gStateSet = state => {
	console.log("gStateSet from",gState,'to',state)
	gState = state
	gStateTime = gTime
	if(state==11 &&!gBattleMon)debugger
},
gObjSceneSet = (obj,scene) => {
	var divs = [obj.div, obj.shadowDiv]
	obj.scene = scene
	for(var div of divs) {
		if(div) {
			div.classList.remove('obj'+gScene.i)
			div.classList.add('obj'+scene.i)
		}
	}
},
gSceneEnter = scene => {
	var mons = [...gYou.mons,gYou]
	for(var obj of mons) {
		gObjSceneSet(obj, scene)
	}
	
	var scene0 = gScene
	if(gScene)gScene.youX = gYouX
	gYouX = 11
	if(gScene != gSceneWorld) {
		for(var obj of gPressObjs) {
			if(obj.scene == scene && obj.sceneGo == gScene) {
				gYouX = obj.x + obj.sizeY/2
			}
		}
	}
	gScene = scene
	gYou.div.style.transition = 'none'
	gYou.div.style.translate = 'none'
	gGround.style.background = scene.bgColor
	gLayer1.style.height = (scene!=gSceneWorld && scene!=gSceneForest?70:44)+'rem'

	d.body.className = 'scene'+scene.i
	gStateSet(gStateBeforeSceneEnter)
	gYouGo(.1)
	gRenderSky()
	gRenderShadows()
	
	gSongMake(gScene.song, 2)
	
	if(scene0)
		gGameSave()
},
gCameraZSet = zoom => {
	gLayer2.style.perspective = (gCameraZ = zoom)+'rem'
},
gCameraYSet = y => {
	gCameraY = y
	if(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
		// for some reason on safari the perspectiveOrigin is wrong.
		y -= 50
	}
	gLayer2.style.perspectiveOrigin = `center ${y}rem`
},
gScenes = [],
gSceneMake = bgColor => {
	var scene = {i: gScenes.length+1, bgColor, song: gIndoorSong, cameraY: 40, cameraZ: 80, grass:[]}
	gScenes.push(scene)
	return gScene = scene
},
gYesNoOnYes = 0,
gYesNoOnNo = 0,
gMenuYesNoShow = (onYes, onNo) => {
	gStateSet(3)
	gButGo.style.display = gButNo.style.display = 'block'
	gYesNoOnYes = onYes
	gYesNoOnNo = onNo
},
gMonKindGet = emoji => {
	for(var kind of gMonKinds) {
		if(kind.emoji == emoji)return kind
	}
},
gSelDivSet=div=>{
	gSelDiv && gClassAdd(gSelDiv,'sel')
	;(gSelDiv = div) && gClassAdd(div,'sel',1)
},
gMouseUp=_=>{
	if(gMonDragging) {
		if(!gMouseMoved) {
			gGuySpeak(gMonDragging, gMonDragging.monKind.name+`<br>❤${gMonDragging.hp}/${gMonDragging.hpMax} 🗡${gMonDragging.monKind.pow}`)
			gbns.style.display = 'block'
			gMonDraggedId = gMonDragging.monKind.id
		}
		gMonDragging.div.style.filter = 'unset'
		gObjZSet(gMonDragging, gYou.z)
		gMonDragging.y = 0
		gObjMoved(gMonDragging)
		gMonDragging = 0
		gYouMonsRender()
	}
	gTapNow = 0
	gSelDivSet()
},
gMouseDown = e => {
	gMouseMoved = 0
	gTapNow = 1
	gTapDiv = gTapHitDiv = e.target
	gSelDivSet(gTapDiv)
	if(gState == 1 || gState == 4 || gBattleMon) {
		if(!gTapDiv?.classList.contains('but')) {
			for(var mon of gYou.mons) {
				if(gMonRectOn(mon, e.clientX, e.clientY)) {
					//console.log(mon)
					if(gBattleMon) {
						if(mon != gBattleMonYou && mon.hp) {
							gBattleMonSwitch = mon
							mon.div.style.filter = 'brightness(1.1) contrast(1.2) drop-shadow(0 0 .1rem #0F0)'
						}
					} else {
						gMonDragging = mon
						gObjTransitionDurationSet(mon, 0)
						mon.div.style.filter = 'brightness(1.1) contrast(1.2) drop-shadow(0 0 .1rem #000)'
						gObjZSet(mon, gYou.z+2)
						mon.y = -2
						gObjMoved(mon)
					}
					break
				}
			}
		}
	}
	if(gTapDiv == gMuteBut) {
		gMute()
	}
	if(gTapDiv.id == 'gbns') {
		gMonNameSet(gMonDraggedId)
	}
	if(gTapDiv == gNearBut) {
		gNearLogin()
	}
	
	if(!gAudioContexts[0]){
		for(var i=11;i--;){
			gAudioContexts[i] = new AudioContext
		}
		gSongMake(gScene.song, 2)
		if(gStorageGet('mute')!=1)
			gMute()
	}
	
	for(var c of gAudioContexts){
		if(c.state == 'suspended')
			c.resume()
	}
	gSoundEffectContext.resume()
},
gMouseDrag = e=> {
	gMouseMoved = 1
	gTapDiv = d.elementFromPoint(e.clientX, e.clientY)
	if(gMonDragging) {
		gSpeakNo()
		gTapDiv = 0
		gMonDragging.x = gScreenToWorld(e.clientX,0,gMonDragging.z)[0]-2-gYouX
		var after, at, at0 = gYou.mons.indexOf(gMonDragging)
		for(var mon,i=-1;mon=gYou.mons[++i];) {
			if(i > at0) {
				if(gAbs(gMonDragging.x) > gAbs(mon.x)) {
					at = i
				}
			}
			if(i < at0) {
				if(gAbs(gMonDragging.x) < gAbs(mon.x)) {
					at = i
					break
				}
			}
		}
		if(at>=0) {
			gYou.mons.splice(at0, 1)
			gYou.mons.splice(at,0,gMonDragging)
			gYouMonsRender()
		}
		//console.log(gYouX, gCameraX, gMonDragging.x)
		gObjMoved(gMonDragging)
		
		if(e.clientY < gSizeY/3 && gYou.mons.length > 1) {
			if(confirm("Set Free?")) {
				gYou.mons.splice(gYou.mons.indexOf(gMonDragging),1)
				gMonDragging.kind = 3
				gMonDragging.x = gYouX
				gMonDragging.y = 0
				gObjZSet(gMonDragging, 52)
				gObjMoved(gMonDragging)
			}
			gMouseUp()
		}
	}
	if(gTapDiv != gSelDiv) {
		gSelDivSet(gTapDiv)
	}
},
gScreenToWorld = (x,y,z) => {
	var x2 = gCameraX+gSizeXRem/2+(x-gSizeX/2)/gRem*(1-z/gCameraZ)
	var y2 = (y-gSizeY/2)/gRem*(1-z/gCameraZ)
	y2 += gSizeY/gRem/4.3 - 28
	y2 += (gCameraY-30)*-1.5 * (gSizeY/gRem-100)/150
	y2 += (gCameraY-42)/2
	return [x2,y2]
},
gMonRectOn = (mon,x,y) => {
	var xy = gScreenToWorld(x,y,mon.z)
	return gAbs(xy[0]-gYouX-2-mon.x)<2 && gAbs(xy[1]-2-mon.y)<3
},
gAbs = Math.abs,
gTilesMake = (x,z,e='',r='') => {
	for(;x--;)e+=z>1?'💠':'🔷'
	for(;z--;)r+=e+'<br>'
	return r
},
gMuted=-1,
gMute = _=> {
	gMuted = !gMuted
	gMuteBut.innerHTML = gMuted ? '🔇' : '🔊'
	gStorageSet('mute', +gMuted)
},
gGameSave = _=> {
	gStorageSet('monIds', gYou.mons.map(mon=>mon.monKind.id))
	gStorageSet('monHps', gYou.mons.map(mon=>mon.hp))
	gStorageSet('x', gYouX)
	gStorageSet('scene', gScene.i)
	gStorageSet('gold', gGold)
	gStorageSet('quest', gQuest)
	gStorageSet('hour', gHour)
},
gContractName = 'pets.vertfromage.testnet',
gContract,
gWalletConnection,
gNearApi = nearApi,
gNearStatusCheck = _=> {
	gNearBut.style.textShadow = '0 0 5px '+(gWalletConnection.isSignedIn()?'#0f0':'red')
	gNearMonNamesGet()
},
gNearConnect = async a => {
	// Connect to nearApi
	let near = await gNearApi.connect({
		nodeUrl: "https://rpc.testnet.near.org",
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		explorerUrl: "https://explorer.testnet.near.org",
		networkId: 'testnet',
		keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(localStorage, gGameName)
	})

	gWalletConnection = new gNearApi.WalletConnection(near)
	if(gWalletConnection.isSignedIn()) {
		a = gWalletConnection.account()
	} else {
		a = new gNearApi.Account(near.connection, gContractName)
	}
	
	gContract = new gNearApi.Contract(a, gContractName, {
		viewMethods: ['get_all_pets'],
		changeMethods: ['change_pet_name']
	})
},
gNearLogin = _=> {
	gGameSave()
	if(gWalletConnection.getAccountId()) {
		gWalletConnection.signOut()
	} else {
		gWalletConnection.requestSignIn(gContractName, gGameName)
	}
},
gMonNameSet = id => {
	for(var monKind of gMonKinds) {
		if(monKind.id == id)
			break
	}
	var t = prompt(`Enter new name for ${monKind.name} (max 20 letters)`)
	gSpeakNo()
	if(t) {
		monKind.name = t.substr(0,20)
		if(gWalletConnection.getAccountId()) {
			gNearMonNameSet(monKind, monKind.name)
		} else {
			alert("Name set, but you aren't logged into NEAR, so the name won't be set online for everyone.")
		}
	}
},
gNearMonNameSet = (monKind, name) => {
    const amountInYocto = '10000000000000000000000'
    const gas = '70000000000000'
	gContract.change_pet_name({pet_id: monKind.id, pet_name: monKind.name = name}, gas, amountInYocto)
},
gNearMonNamesGet = _ => {
	gContract.get_all_pets({}).then(names => {
		for(var row of names) {
			for(var mon of gMonKinds) {
				if(mon.id == row[0]) {
					mon.name = row[1]
				}
			}
		}
	})
},
gSoundEffectContext = new AudioContext,
gSoundEffectMake = notes => {
	// Calculate total duration, adding up duration of each note.
	var seconds = 0
	for(var i=0; i<notes.length; i+=5) {
		seconds += notes[i+2]
	}
	
	// Make the array buffer.
	var bytesPerSecond = gSoundEffectContext.sampleRate;
	var songLength = Math.round(bytesPerSecond * seconds)
	var audioBuffer = gSoundEffectContext.createBuffer(1, songLength, bytesPerSecond)
	
	// Make 2 buffers so that notes can overlap a bit without overwriting part of eachother.
	var bytes = audioBuffer.getChannelData(0)
	var bytes2 = new Float32Array(songLength)
	
	var songByteI = 0
	var fadeIn = 0, fadeOut = 0
	var pi2 = Math.PI*2
	
	// Each note uses 5 slots in the passed in array.
	for(var i=0; i<notes.length; i+=5) {
		// Calculate how many buffer array slots will be used for fade in / fade out of this note.
		fadeIn = bytesPerSecond * notes[i+3]/100 | 0
		// Overlap the fades of the notes.
		songByteI -= Math.min(fadeOut, fadeIn)
		fadeOut = bytesPerSecond * notes[i+4]/100 | 0
		
		// Calculate sine wave multiplier for start/end frequency.
		var multiplier = pi2 * notes[i]*10 / bytesPerSecond
		var multiplier2 = pi2 * notes[i+1]*10 / bytesPerSecond
		
		var noteLen = bytesPerSecond * notes[i+2] | 0
		
		// Alternate which buffer we are writing to.
		var bytesForNote = i/5%2 ? bytes2 : bytes
		
		for(var byteI=0; byteI<noteLen; byteI++) {
			// Smoothly transition from start frequency to end frequency of this note.
			var far = byteI/noteLen
			var angle = byteI * (multiplier2*far + multiplier*(1-far))
			var v = Math.sin(angle)
			
			// Apply fade in / fade out by adjusting the volume.
			if(byteI < fadeIn) {
				v *= byteI / fadeIn
			} else if(byteI > noteLen-fadeOut) {
				v *= (noteLen-byteI) / fadeOut
			}
			
			bytesForNote[songByteI++] = v
		}
	}
	
	// Combine the 2 channels into 1. Average them together for when note's fades slightly overlap.
	for(var i=0; i<songLength; i++) {
		bytes[i] = (bytes[i]+bytes2[i])/2
	}
	
	return audioBuffer
},
gSoundEffectPlay = audioBuffer => {
	if(!gMuted) {
		var source = gSoundEffectContext.createBufferSource()
		if(!source) {
			return
		}
		
		source.buffer = audioBuffer
		
		var gainNode = gSoundEffectContext.createGain()
		source.connect(gainNode)
		gainNode.connect(gSoundEffectContext.destination)
		
		source.start(0)
	}
},
gSoundItemGet,
gSoundSpeak,
gSoundDoor,
gSoundSpeakNo,
gSoundBattleStart,
gSoundMonDie,
gSoundGrass,
gStorageSet = (key, val) => {
	localStorage[gGameName+key] = val
},
gStorageGet = (key) => localStorage[gGameName+key],
gRandom = max => Math.random()*max,
gHeal = _=> {
	for(var mon of gYou.mons) {
		gMonHpSet(mon, mon.hpMax)
	}
	gStateSet(1)
},
u

onmousedown = gMouseDown

onmouseup = gMouseUp

onmousemove = e => gTapNow && gMouseDrag(e)

addEventListener("touchstart", e => {
	gMobile = 1
	var touch = e.changedTouches[0]
	if(touch) {
		gMouseDown(touch)
	}
	gButL.style.display = gButR.style.display = 'block'
	e.preventDefault()
	return false
}, {passive:false})

addEventListener("touchend", e=>{
	gMouseUp()
	e.preventDefault()
	return false
}, {passive:false})

addEventListener("touchmove", e=>{
	var touch = e.changedTouches[0]
	if(touch) {
		gMouseDrag(touch)
	}
	e.preventDefault()
	return false
}, {passive:false})

addEventListener("keydown", e => {
	var c = e.keyCode
	if(!gKeyDown[c]) {
		gKeyHit[c] = gKeyDown[c] = 1
	}
})

addEventListener("keyup", e => {
	var c = e.keyCode
	gKeyDown[c] = 0
	gKeyReleased[c] = 1
})

onresize=_=>{
	gSizeX = innerWidth
	gSizeY = innerHeight
	gRem = Math.min(gSizeX,gSizeY) / 100
	gSizeXRem = gSizeX/gRem
	gYou.div && gYouGo(0)
}

onload=_=>{
	gGoldSet(1)
	gSoundDoor = gSoundEffectMake([
		15, 16, .1, .2, .1,
		15, 18, .1, 2, 1,
	])
	gSoundSpeak = gSoundEffectMake([18, 26, .1, .04, .04])
	gSoundSpeakNo = gSoundEffectMake([24, 19, .05, .02, .02])
	gSoundItemGet = gSoundEffectMake([
		17, 17, .08, .2, 2,
		21, 21, .08, .2, 2,
		25, 27, .1, .2, 2,
	])
	gSoundMonDie = gSoundEffectMake([
		25, 24, .1, 2, 2,
		17, 17, .1, 2, 2,
		14, 12, .3, 3, 9,
	])
	gSoundBattleStart = gSoundEffectMake([
		25, 25, .1, 2, 2,
		22, 22, .1, 2, 2,
		35, 35, .2, 3, 9,
	])
	gSoundGrass = gSoundEffectMake([
		15, 17, .03, .1, .1,
		16, 16, .03, .1, .1,
		15, 15, .03, .1, .1,
	])
	
	gNearApi.nearInitPromise = gNearConnect().then(gNearStatusCheck)

	for(var k of gMonKinds) {
		k.id = k.name
		k.reload ||= 1
		k.repel ||= 1
		if(k.pow.sub) {
			var pow = parseInt(k.pow)
			k.powKind = k.pow.substr(`${pow}`.length)
			k.pow = pow
		}
	}
	onresize()
	w.gSceneWorld = gSceneMake('#583')
	w.gSceneHouseYou = gSceneMake('#822')
	w.gSceneBedroom = gSceneMake('#822')
	w.gSceneHouseRival = gSceneMake('#822')
	w.gSceneLab = gSceneMake('#def')
	w.gSceneCenter1 = gSceneMake('#def')
	w.gSceneMart1 = gSceneMake('#def')
	w.gSceneIntro = gSceneMake('#fff')
	var oak=gObjMake('👨‍🦼',20,0,53,9,0,0,3,'!')
	var mon0=gObjMake('🐒',-20,0,48,6,0,0,3)
	gObjTransitionDurationSet(mon0, .5)
	
	
	
	w.gSceneForest = gSceneMake('#583')
	gScene.endX = 277
	
	gObjMake('🧍‍♂️',16,0,53,7,0,.03,3,"The Final Forest. I once saw a dragon in the moonlight.")
	
	gObjMake('🔷',0,0,58,6,3,0,0,'',gSceneWorld)
	
	var m='🏔'
	for(x=4;x--;)
		m+=m
	gObjMake(m, -100, 0, 20, 42, 1)
	s.whiteSpace = 'nowrap'
	s.letterSpacing = '-15rem'
	
	
	for(x=0; x<33; x++) {
		var z=36
		if(x<5)z+=6
		gObjMake('🌲', -22+11*(x+.5+gRandom(.03)), 0, 25+gRandom(15), 15+gRandom(2))
		gObjMake('🌲', -22+11*(x+gRandom(.03)), 0, z+gRandom(10), 15+gRandom(2))
		gObjMake('🌲', 33+11*(x+gRandom(.03)), 0, 64+gRandom(10), 15+gRandom(2))
	}
	
	for(x=55;x-->5;) {
		var x2 = x*5
		obj = gObjMake("<div>🌾</div>", x2+gRandom(3), 0, 55.5, 6)
		gScene.grass[x2/5|0] = obj
	}
	
	gSceneForest.cameraY = 30
	gSceneForest.cameraZ = 100
	gSceneWorld.cameraY = 30
	gSceneWorld.cameraZ = 100
	
	
	gScene = gSceneWorld
	gScene.endX = 531
	
	gScene.song = [
		6,,9,,
		12,,9,,
		14,,9,,
		16,,9,,
		14,,9,,
		14,,9,,
		14,,16,,
		18,,16,,
		14,,12,,
		14,,9,,
		16,,9,,
		14,,9,,
		18,,9,,
		14,,9,,
		18,19,18,,
		16,,9,,
		14,,9,,
		18,19,18,,
		21,,9,,
		18,,9,,
		16,,9,,
		18,,16,,
		14,,9,
	]

	
	for(var i=20; i--;){
		w.gStar = gObjMake('&bull;',gRandom(gSizeXRem),gRandom(30),0,1.5,1)
		s.color = '#9cf'
	}
	
	w.gSun = gObjMake("<div style='transform:translateX(-50%)'>🌞</div>",0,0,0,20,1)
	s.textShadow = '0 0 2rem #FA4'
	s.transition = 'all 1s ease'
	
	w.gMoon = gObjMake("<div style='transform:translateX(-50%)'>🌕</div>",0,0,0,15,1)
	s.textShadow = '0 0 2rem #FFF'
	s.transition = 'all 1s ease'
	
	gObjMake(gTilesMake(23,1),-11,0,58,6,3)
	s.filter = 'grayscale(.9) brightness(1.3)'
	
	var x = -122,z=20
	while(x < 533) {
		var obj = gObjMake('🏔', x, 0, z, 42, 1)
		var scaleX = 1+gRandom(.2)
		var scaleY = 1+gRandom(.2)
		x += gRandom(16)+22
		if(x>-50 && z>4) {
			z -= 4
			x -= 15
		}
	}
	gObjMake('🌲',35,0,40,16)
	gObjMake('🌲',40,0,30,16)
	gObjMake('🌲',60,0,40,16)
	for(x=0; x<23; x++) {
		var z=36
		if(x<5)z+=6
		gObjMake('🌲', 122+11*(x+.5+gRandom(.03)), 0, 25+gRandom(15), 18+gRandom(2))
		gObjMake('🌲', 122+11*(x+gRandom(.03)), 0, z+gRandom(10), 18+gRandom(2))
	}
	
	for(var patch=0; patch<4; patch++) {
		var max = 4
		if(patch==0)max=6
		if(patch==1)max=2
		for(x=0; x<max; x++) {
			var x2 = patch*66+x*5+145
			var far = -2
			if(patch==0)far=0
			for(var z=far;z<=2;z++) {
				obj = gObjMake("<div>🌾</div>", x2+gRandom(3), 0, 55.5+z*5, 6)
				if(z==0)
					gScene.grass[x2/5|0] = obj
			}
		}
	}
	for(x=0; x<2; x++) {
		for(z=0; z<2; z++) {
			gObjMake('🌼🌼🌼🌼', -10+x*71, 0, 47+z*3, 3)
		}
	}
	
	gObjMake('',-194,0,71,70,3)
	gScene.startX = -42
	s.width = '150rem'
	s.background = '#69D'
	
	gObjMake('🏡',3,0,50,27,0,.2,0,'',gSceneHouseYou)
	
	gObjMake('📫',3,0,50,5)
	gObjMake('🪧',184,0,53,6,0,.07,0,"Route 1:<br>To Green-Blue City")
	gObjMake('🪧',75,0,52,6,0,.07,0,"Color Palette Town:<br>Shades of your journey are belong to us!")

	gObjMake('🏠',34,0,50,27,0,.2,0,'',gSceneHouseRival)
	gHouseLab = gObjMake('🏢',87,-1,50,38,0,0,0,'',gSceneLab)
	
	gYou = gObjMake('🚶',0,0,55,7,0,.04,1)
	gYou.shadowDiv.className = 'shadow0'
	gYou.mons = []
	
	gObjMake('🏥',400,0,50,30,0,.2,0,'',gSceneCenter1)
	gObjMake('🏪',436,0,50,30,0,.2,0,'',gSceneMart1)
	gObjMake('🚛',468,0,50,15,0,.2)
	var o=gObjMake('🏯',485,0,50,33,0,.1,'',' ')
	o.onPress = _=> {
		gGuySpeak(gYou,'The door is locked.')
		gYouGo(-1)
	}
	o.onLeave = gSpeakNo
	//gObjMake("<div style='rotate:90deg;transform-origin:center'>🪜</div><div style='rotate:90deg;transform-origin:center'>🪜</div>",385,0,53,6)
	//gObjMake("<div style='rotate:135deg;transform-origin:center'>🖋</div>",385,0,53,6)
	//gObjMake("⛓⛓⛓⛓",385,0,53,6);s.width=s.height;s.height='auto';s.transform+="rotate(90deg)"
	//gObjMake("🚧🚧🚧🚧",385,0,53,6)
	
	gObjMake('🌳',525,0,50,20,0,.2,0,'',gSceneForest)
	
	gObjMake('🪧',380,0,53,6,0,.07,0,"Green-Blue City: The Greenish Blue Paradise")
	
	gObjMake(gTilesMake(23,1),380,0,58,6,3)
	
	
	gScene = gSceneLab
	
	gObjMake(gTilesMake(18,3),9,0,51,6,3)
	s.opacity = .5
	
	gObjMake('🚪',0,0,54,11,0,0,0,'',gSceneWorld)
	gObjMake('🗄',22-4-.9,0,53,6,0,.03)
	gObjMake('👨‍🔬',22,-5.7,52.5,3.5,1,0,3,"I study emojis as professor X's AIDE.")
	gObjMake('🗄',22-.9,0,53,6,0,.03)
	gObjMake('🗄',22+4-.9,0,53,6,0,.03)
	gObjMake('👩‍🔬',22+4*2,-5.7,52.5,3.5,1,0,3,"Professor X is the authority on emoji. Many emoji trainers hold him in high regard.")
	gObjMake('🗄',22+4*2-.9,0,53,6,0,.03)
	gObjMake('🗄',22+4*3-.9,0,53,6,0,.03)
	
	gObjMake('📊',110,-6,45,6,2)
	
	gObjMake('📠',114, -6, 55, 3.5,1)
	gObjMake('🗄',gScene.endX=114-1.1 ,0, 54, 6,0,.03)
	
	for(i=8;i--;) {
		gObjMake('🪟',9+i*12,-7,45,12,2)
	}
	
	gRival = gObjMake('🧍‍♂️',52,0,53,7,0,.03,3,"Yo! Gramps isn't around!")
	gOak = gObjMake('👨‍🦼',999,0,53,9,0,0,3,"Which emoji do you want?")
	
	var i=0
	var kinds = ['🐡','🦣','🐓'].map(gMonKindGet)
	for(var kind of kinds) {
		var x = 73+i*7.5
		var mon = gObjMake(kind.emoji, x, .4, 52.5, 4, 0, .05, 3, "Brains?")
		mon.div.classList.add('zombie')
		mon.monKind = kind
		!function(mon){
			mon.onPress = _ => {
				if(gOak.x > 888 || gYou.mons[0].monKind != gMonKindCure)
					gGuySpeak(mon)
				else {
					gGuySpeak(gOak, `You want the `+mon.monKind.t.join('/')+` emoji, ${mon.monKind.name}?`)
					gMenuYesNoShow(_ => {
						gStateSet(4)
						mon.cage.div.style.opacity = mon.cage.shadowDiv.style.opacity = 0
						setTimeout(_ => {
							gObjDelete(gYou.mons[0])
							gYou.mons = []
							gObjDelete(mon)
							gYouMonGet(mon.monKind)
							setTimeout(_ => 
								gGuySpeak(gYou.mons[0], '😍')
							,111)
							setTimeout(_ => {
								gSpeakNo()
								gStateSet(1)
								gOak.speech = "To save every type of emoji in the world... That was my dream!"
								gRival.speech = "Alright gramps! Leave it all to me!"
								gScene.startX = 0
							}, 999)
						}, 333)
					}, gSpeakNo)
				}
			}
		}(mon)
		mon.cage = gObjMake('🌐',x-1.6,0,53,6.5,0,.04)
		s2.transition = s.transition = 'opacity 1s ease'
		s.opacity = .7
		i++
	}
	
	gScene = gSceneHouseRival
	gObjMake('🚪',0,0,50,11,0,0,0,'',gSceneWorld)
	gObjMake('🧘',38,0,53,4.5,0,.02,3,"Hi! Rival is out at grandpa's lab.")
	gObjMake('🔲',35,0,57,11,3)
	gObjMake('🪑',33,0,51,5)
	gObjMake('🫕',45,0,52,4)
	gObjMake('🗾',15,-8,45,8,2)
	gObjMake('🧭',30,-8,45,8,2)
	gObjMake('🌎',45,-8,45,8,2)
	gObjMake('📺',1+(gScene.endX=55),0,55,5)
	
	gScene = gSceneBedroom
	gObjMake('🪟',1,-7,45,12,2)
	o = gObjMake('🛏',1,0,50,11,0,0,0,'!')
	o.onPress = _=> {
		if(!gYou.mons.length) {
			gGuySpeak(gYou, "I've slept enough!")
		}
		gHeal()
	}
	gObjMake('☮',20,-8,45,8,2)
	gObjMake('🌉',30,-8,45,8,2)
	var tv=gObjMake('📺',20,0,47,6,0,0,0,'!')
	tv.onPress = _=> {
		gGuySpeak(tv, "Dragon Warrior II", _=> {
			gGuySpeak(gYou,"Would be cool if you could catch any monster and add it to your party.")
		})
	}
	gObjMake('🎮',21,0,51,3)
	gObjMake('🕳',45,2,54.5,5,1)
	gObjMake('🪜',45,0,54.6,5,0,0,0,'',gSceneHouseYou)
	gScene.endX = 50
	
	gScene = gSceneHouseYou
	gObjMake('🧻',89,-3.5,52,2.4,1)
	gObjMake('🚽',gScene.endX=88,0,53,6)
	w.gMom = gObjMake('🧍',41,0,53,8,0,0,3,"Right!<br>All boys leave home some day.")
	gObjMake('📺',48,0,50,5,0,0,0,"There's a movie on TV. Four boys are walking on railroad tracks.")
	o = gObjMake('🪜🪜🪜',gScene.youX=75,-8,46,5,2,0,0,"",gSceneBedroom)
	s2.width = s.width = s.height
	s2.lineHeight = s.lineHeight = .9
	
	gObjMake('🛋',32,0,50,12)
	gObjMake('🖼',22,-10,45,6,2)
	gObjMake('🖼',32,-10,45,6,2)
	gObjMake('🪟',62,-7,45,8,2)
	gObjMake('🚪',0,0,50,11,0,0,0,'',gSceneWorld)
	gObjMake('🪴',13,0,50,5)
	
	
	gScene = gSceneCenter1
	gObjMake('🚪',0,0,50,11,0,0,0,'',gSceneWorld)
	gObjMake('🪴',13,0,50,5)
	gObjMake('🪴',19,0,50,5)
	gObjMake('🪑',25,0,51,5)
	gObjMake('🪑',30,0,51,5)
	gObjMake('🧘',30,0,51.1,5,0,-.35,3,"Emoji Centers heal your emojis.")
	//gObjMake('🛋',25,0,50,12)
	var x = 54
	gObjMake('🗄',x-4*2-.9,0,53,6,0,.03)
	gObjMake('🗄',x-4-.9,0,53,6,0,.03)
	var healer = gObjMake('👩‍⚕️',x,-5.7,52,3.5,1,0,3,'!')
	healer.onPress = _=> {
		gStateSet(12)
		gGuySpeak(healer,"Welcome to our Emoji Center!", _=> {
			gGuySpeak(healer,"Heal your emojis back to perfect health?")
			gMenuYesNoShow(_=>{
				gHeal()
				gGuySpeak(healer,"Healed! We hope to see you again.")
			}, _=> {
				gSpeakNo()
				gStateSet(1)
			})
		})
	}
	
	gObjMake('🗄',x-.9,0,53,6,0,.03)
	gObjMake('🗄',x+4-.9,0,53,6,0,.03)
	gObjMake('🗄',x+4*2-.9,0,53,6,0,.03)
	gObjMake('💻',75,0,53,6)
	
	for(i=4;i--;) {
		gObjMake('🪟',9+i*18,-7,45,12,2)
	}
	gObjMake(gTilesMake(12,3),9,0,51,6,3)
	
	gObjMake('🧍‍♂️',70,0,53,7,0,.03,3,"No need for the computer. To drop an emoji, just swipe it upwards!")
	
	gScene.endX = 77

	
	gScene = gSceneMart1
	gObjMake('🚪',0,0,50,11,0,0,0,'',gSceneWorld)
	gObjMake('🧾',40,-6,45,3,2)
	//gObjMake('🛋',25,0,50,12)
	var x = 30
	var clerk = gObjMake('👨‍💼',x,-5.5,51,3.5,1,0,3,'!')
	clerk.onPress = _=> {
		if(!gQuest) {
			gStateSet(13)
			gGuySpeak(clerk,"Hey! You came from Color Palette Town?", _=> {
				gGuySpeak(clerk,"You know professor X right? His order came in. Will you take it to him?")
				gMenuYesNoShow(_=>{
					gQuest = 1
					gOak.speech = "My package! Too bad the emojidex doesn't fit into 13KB."
					gStateSet(1)
					gGuySpeak(clerk, gMonKindPackage.emoji)
					gYouMonGet(gMonKindPackage)
				}, _=> {
					gGuySpeak(clerk,"You're not supposed to say no! Get out of my shop!")
					gStateSet(1)
				})
			})
		} else {
			gGuySpeak(clerk,"That's all I have?")
		}
	}
	
	for(var y=3;y--;) {d
		for(z=3;z--;) {
			gObjMake('📦', x+1.8*z, -2-.8*z+y*1.6, 53-z-y*.1, 4, 1)
			z>0 && gObjMake('📦', x-z*1.4, -2-.8*z+y*1.6, 53-z-y*.1, 4, 1)
		}
	}
	var cure = gObjMake(gMonKindCure.emoji, x-10+.2, 0, 51-.5, 4, 0, 0, 3, '!')
	cure.onPress = _=> {
		gGuySpeak(clerk,"Buy for 1 coin?")
		gMenuYesNoShow(_=>{
			if(gGold > 0) {
				gGoldSet(gGold-1)
				gYouMonGet(gMonKindCure)
			}
			gSpeakNo()
			gStateSet(1)
		}, _=> {
			gSpeakNo()
			gStateSet(1)
		})
	}
	
	/*
	var martMon = gObjMake('🩹', x-10+.2, 0, 51-.5, 4, 0, 0, 3, '!')
	martMon.onPress = _=> {
		gGuySpeak(clerk,"Buy for $1?")
		gMenuYesNoShow(_=>{
			if(gGold > 0) {
				gGoldSet(gGold-1)
				gYouMonGet(gMonKindCure)
			}
			gSpeakNo()
			gStateSet(1)
		}, _=> {
			gSpeakNo()
			gStateSet(1)
		})
	}
	*/
	
	for(i=3;i--;) {
		gObjMake('🪟',9+i*18,-7,45,12,2)
	}
	gObjMake(gTilesMake(8,3),9,0,51,6,3)
	s.filter = 'hue-rotate(133deg)'
	
	gScene.endX = 55

	
	
	gScene=0
	if(!gStorageGet('scene')) {
		gCameraYSet(gSceneIntro.cameraY)
		gCameraZSet(gSceneIntro.cameraZ)
		gSceneEnter(gSceneIntro)
		gButR.style.display = gButL.style.display = 'none'
		gStateSet(0)
		setTimeout(_=> {
			gGuySpeak(oak, `Welcome to the ${gGameName}!`, _=> {
				gGuySpeak(oak, "My name is X, people call me the Emoji Professor!", _=> {
					mon0.x = 17
					gObjMoved(mon0)
					gGuySpeak(oak, "This world is inhabited by creatures called emojis!", _=> {
						gGuySpeak(oak, "Most of them are zombies. But we have a cure!", _=> {
							gGuySpeak(oak, "Turns out you need to smack them with a non-zombie emoji, then throw a heart.", _=> {
								gGuySpeak(oak, "A world of dreams and adventures with emojis awaits! Lets go!", _=> {
									d.body.style.filter = 'brightness(0)'
									setTimeout(_=> {
										d.body.style.filter = 'brightness(1)'
										gButR.style.display = gButL.style.display = 'block'
										gSceneEnter(gSceneBedroom)
									}, 999)
								})
							})
						})
					})
				})
			})
		}, 888)
	} else {
		gQuest = gStorageGet('gQuest')*1
		gHour = gStorageGet('gHour')*1||0
		var ids = gStorageGet('monIds').split(',')
		var hps = gStorageGet('monHps').split(',')
		var i = 0
		for(var id of ids) {
			for(var monKind of gMonKinds) {
				if(monKind.id==id) {
					gMonHpSet(gYouMonGet(monKind), hps[i++]*1)
				}
			}
		}
		gGoldSet(gStorageGet('gold')*1)
		
		var sceneGo = gScenes[gStorageGet('scene')-1]
		gCameraYSet(sceneGo.cameraY)
		gCameraZSet(sceneGo.cameraZ)
		gSceneEnter(sceneGo)
		gYouX = gStorageGet('x')*1
		gYouGo(0)
	}
	setInterval(gLoop,33)
}


var gIndoorSong = [5,,,, 6,,,, 8,,,, 9,,,, 10,,9,, 10,,1,1, 8,,6,, 8,,1,1, 6,,5,, 6,,5,, 6,,8,, 10,,,],
	gBattleSong = [5,5,11,, 6,6,11,, 7,7,11,, 8,8,11,, 8,3,11,3, 7,3,11,3, 6,3,11,],
	gSongI = 0,
	gBuiltSong,
	gSongInterval = setInterval(_ => {
		if(gBuiltSong && !gMuted) {
			//console.log("song interval", gSongI)
			if(gSongI >= gBuiltSong.length){
				//console.log("song reached end")
				gSongI = 0
			}else{
				gNotePlay(gSongI)
				gSongI++;
			}
		}
	}, 200),
	gBuiltSong,
	gAudioContexts = [],
	gSongMake = (song, len) => {
		if(gAudioContexts[0]) {
			gBuiltSong = []
			//console.log("gSongMake()")
			for(var i=0;i<song.length;i++) {
				if(!song[i]) {
					gBuiltSong.push(0)
				} else {
					gBuiltSong.push(gAudioContexts[i%10].createBuffer(1, 1e6, 44100))
					gBuiltSong[i].getChannelData(0).set(gGetD(song[i], len))
				}
			}
		}
	},
	gNotePlay = note => {
		if(gBuiltSong[note]) {
			var j = note%10
			var source = gAudioContexts[j].createBufferSource()
			source.buffer = gBuiltSong[note]
			source.connect(gAudioContexts[j].destination)
			source.start()
		}
	},
	gGetD = (note, len) => {
		note = 130.81 * 1.06 ** note
		for(

			// V: note length in seconds
			var V = len,
			
			// Temp vars for guitar synthesis
			vv = [],
			pp = 0, ch = 0,
			
			// Modulation
			// This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
			b = (note, tt, aa, tick) => Math.sin(note / tt * 6.28 * aa + tick),
			
			// Instrument synthesis
			w = (note, tt) =>
			
			  // Piano
			  Math.sin(note / 44100 * tt * 6.28 + b(note, 44100, tt, 0) ** 2 + .75 * b(note, 44100, tt, .25) + .1 * b(note, 44100, tt, .5)) * .1
			,
			// Sound samples
			D = [],
			
			// Loop on all the samples
			tick = 0;
			tick < 44100 * V;
			tick++
			){
			
			// Fill the samples array
			D[tick] =
			
			  // The first 88 samples represent the note's attack
			  tick < 88 
			  ? tick / 88.2 * w(tick, note)
			  
			  // The other samples represent the rest of the note
			  : (1 - (tick - 88.2) / (44100 * (V - .002))) ** ((.5 * Math.log(1e4 * note / 44100)) ** 2) * w(tick, note);
			}
			return D;
	}


