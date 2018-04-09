void setup() {
	size(1300, 600);
	frameRate(60);
}

//Sound effects
var conflictAlert = new Audio('Materials/sounds/conflict.mp3');
conflictAlert.volume = 0.8;
var runwayChangeSound = new Audio('Materials/sounds/runwaychange.mp3');
runwayChangeSound.volume = 1;

//Update timings
var timeElapsed = 0;
var updateTime = 0;
var trailTime = 0;

//Reset
var confirmReset = false;

//Pause
var paused = false;

//Pilot speech (text)
var pilotSpeechNo = 0;
var pilotSpeech = [];
var displaySpeech = "";

//Save & load parameters
var loaded = false;
var aircraftType = [];
var aircraftWake = [];
var aircraftIcao = [];
var aircraftFlightNo = [];
var aircraftPosX = [];
var aircraftPosY = [];
var aircraftHdg = [];
var aircraftAlt = [];
var trailXName = "";
var trailYName = "";
var aircraftTrailLength = [];
var aircraftClearedHdg = [];
var aircraftClearedAlt = [];
var aircraftLeftHdg = [];
var aircraftIas = [];
var aircraftClearedIas = [];
var decreaseSpd0 = [];
var decreaseSpd1 = [];
var decreaseSpd2 = [];
var decreaseSpd3 = [];
var aircraftAltChng = [];
var aircraftHdgChng = [];
var aircraftIasChng = [];
var aircraftDrag = [];
var aircraftFinalAppSpd = [];
var aircraftIlsIndex = [];
var aircraftLoc = [];
var aircraftGs = [];
var aircraftWakeTimer = [];
var gaTimer = [];
var gaState = [];
var uncontrolToControl = [];
var controlToUncontrol = [];
var aboveGS = [];
var wakeTurb = [];
var cannotLoc = [];
var crossLoc = [];
var leaveAirspace = [];
var aircraftUncontrolTimer = [];
var manualHandover = [];
var delayTimingName = "";
var delayHdgName = "";
var delayAltName = "";
var delaySpdName = "";
var delayHdgChngName = "";
var aircraftDelayLength = [];
var aircraftCollided = [];
var aircraftCollidedHdgChng = [];
var aircraftCollidedAltChng = [];

//Unit conversions
//1 pixel = 200 feet
//1 nautical mile = 6076.12 feet
const px_to_ft = 400;
const nm_to_ft = 6076.12;
const nm_to_px = nm_to_ft / px_to_ft;

//Score
var score = 4.0;
var highScore = score;

//EGLL information
const egllIlsRwy09L = [700, 281, 90];
const egllIlsRwy09R = [700.84, 288, 90];
const egllIlsRwy27L = [700.84 + 12008 / px_to_ft, 288, 270];
const egllIlsRwy27R = [700 + 12802 / px_to_ft, 281, 270];
const egllElevation = 83;
var egllRwy09Lx27R = [];
var egllRwy09Rx27L = [];
var egllSpawn1 = [];
var egllSpawn2 = [];
var egllSpawn3 = [];
var egllSpawn4 = [];

//Selected parameters in ATC panel
var imported = false;
var selectedAlt = 10000;
var selectedSpd = 250;
var selectedHdg = 360;
var selectedHdgDigits = [3, 6, 0];
var selectedChangeHdg = 0;
var selectedChanged = false;

//Selected aircraft
var selectedAircrafts = [];
var selectedAircraftsNo = selectedAircrafts.length;

//Aircraft array storage
var aircrafts = [];
var aircraftsNo = 0;

//Active airport & runway(s)
var airportChosen = "EGLL";
var runwayChosen = false;
var activeRunways = [];

//Aircraft type array storage (not required once airline fleet info added)
const aircraftsTypes = [
					//Airbus A3X0 series
					"A306", 
					"A310", 
					"A318", "A319", "A320", "A321", "A20N", "A21N", //Add A19N in future
					"A332", "A333", //Add A338, A339 in future
					"A342", "A343", "A344", "A345", "A346", 
					"A359", //Add A35K in future
					"A388", 
					//Boeing 7X7 series
					"B703", 
					"B712", 
					"B720", "B721", "B722", 
					"B732", "B733", "B734", "B735", "B736", "B737", "B738", "B739", "B38M", //Add B37M, B39M, B737-10MAX in future
					"B741", "B742", "B743", "B744", "B74S", "B748", 
					"B752", "B753", 
					"B762", "B763", "B764", 
					"B772", "B77L", "B773", "B77W", //Add B778, B779 in future
					"B788", "B789", //Add B78X in future
					//Bombardier CSeries
					"BCS1", "BCS3",
					//McDonnell Douglas MD-XX series
					"DC10", "MD10", "MD11", "MD81", "MD82", "MD83", "MD87", "MD88", "MD90"
					//Will add more aircraft types soon
					];
const aircraftsTypesNo = aircraftsTypes.length;

//Aircraft wake turbulence category
const wakeHeavy = [
				//Airbus A3X0 series
				"A306",
				"A310",
				"A332", "A333",
				"A342", "A343", "A344", "A345", "A346",
				"A359",
				//Boeing 7X7 series
				"B741", "B742", "B743", "B744", "B74S", "B748",
				"B762", "B763", "B764",
				"B772", "B77L", "B773", "B77W",
				"B788", "B789",
				//McDonnell Douglas MD-XX series
				"DC10", "MD10", "MD11"
				];
const wakeHeavyNo = wakeHeavy.length;

//ICAO code & aircraft types array storage					
var egllIcao = []; //Only airlines & aircraft types serving EGLL
egllIcao[0] = ["AEE", "A321"];
egllIcao[1] = ["EIN", "A320"];
egllIcao[2] = ["AFL", "A321", "A333"];
egllIcao[3] = ["AMX", "B788"];
egllIcao[4] = ["DAH", "B738"];
egllIcao[5] = ["KZR", "B752"];
egllIcao[6] = ["ACA", "A333", "B763", "B77W", "B789"];
egllIcao[7] = ["CCA", "A333", "B77W"];
egllIcao[8] = ["AFR", "A318", "A319", "A320", "A321"];
egllIcao[9] = ["AIC", "B788"];
egllIcao[10] = ["AMC", "A320"];
egllIcao[11] = ["MAU", "A343"];
egllIcao[12] = ["ANZ", "B77W"];
egllIcao[13] = ["ASL", "A319"];
egllIcao[14] = ["AZA", "A320", "A321"];
egllIcao[15] = ["ANA", "B77W"];
egllIcao[16] = ["AAL", "A333", "B772", "B77W", "B788"];
egllIcao[17] = ["AAR", "A359", "B77L"];
egllIcao[18] = ["AUA", "A320", "A321"];
egllIcao[19] = ["AVA", "B788"];
egllIcao[20] = ["AHY", "B763"];
egllIcao[21] = ["CBJ", "A332"];
egllIcao[22] = ["BBC", "B77W"];
egllIcao[23] = ["BAW", "A318", "A319", "A320", "A321", "A388", "B744", "B763", "B772", "B77W", "B788", "B789"];
egllIcao[24] = ["BEL", "A319", "A320"];
egllIcao[25] = ["LZB", "A319"];
egllIcao[26] = ["CPA", "B77W"];
egllIcao[27] = ["CES", "B77W"];
egllIcao[28] = ["CSN", "B788"];
egllIcao[29] = ["CTN", "A319"];
egllIcao[30] = ["DAL", "B752", "B763", "B764"];
egllIcao[31] = ["MSR", "A333", "B738"];
egllIcao[32] = ["ELY", "B772", "B789"];
egllIcao[33] = ["UAE", "A388"];
egllIcao[34] = ["ETH", "A359"];
egllIcao[35] = ["ETD", "A388"];
egllIcao[36] = ["EVA", "B77W"];
egllIcao[37] = ["EWG", "A320"];
egllIcao[38] = ["EWE", "A320"];
egllIcao[39] = ["GWI", "A319", "A320"];
egllIcao[40] = ["BER", "A320"];
egllIcao[41] = ["FIN", "A319", "A320", "A321"];
egllIcao[42] = ["BEE", "DH8D"];
egllIcao[43] = ["GIA", "B77W"];
egllIcao[44] = ["GFA", "A332"];
egllIcao[45] = ["IBE", "A319", "A320", "A321", "A346"];
egllIcao[46] = ["IBS", "A320"];
egllIcao[47] = ["ICE", "B752", "B763"];
egllIcao[48] = ["IRA", "A332"];
egllIcao[49] = ["JAL", "B77W", "B788"];
egllIcao[50] = ["JAI", "B77W"];
egllIcao[51] = ["KQA", "B788"];
egllIcao[52] = ["KLM", "B738", "B739", "E190"];
egllIcao[53] = ["KAL", "B772", "B77W"];
egllIcao[54] = ["KAC", "B77W"];
egllIcao[55] = ["TAM", "B77W"];
egllIcao[56] = ["LOT", "B734", "B738", "B38M"];
egllIcao[57] = ["DLH", "A320", "A321"];
egllIcao[58] = ["MAS", "A388"];
egllIcao[59] = ["MEA", "A320", "A332"];
egllIcao[60] = ["OMA", "A332", "A333"];
egllIcao[61] = ["PIA", "B772", "B77W"];
egllIcao[62] = ["PAL", "B77W"];
egllIcao[63] = ["QFA", "A388"];
egllIcao[64] = ["QTR", "A359", "A388", "B77W", "B788"];
egllIcao[65] = ["RAM", "B737", "B738"];
egllIcao[66] = ["RBA", "B788"];
egllIcao[67] = ["RJA", "B788"];
egllIcao[68] = ["SVA", "B77W"];
egllIcao[69] = ["SAS", "A320", "B736", "B737", "B738"];
egllIcao[70] = ["SIA", "A388", "B77W"];
egllIcao[71] = ["SAA", "A332"];
egllIcao[72] = ["ALK", "A333"];
egllIcao[73] = ["SWR", "A320", "A321", "BCS3"];
egllIcao[74] = ["TAP", "A319", "A320"];
egllIcao[75] = ["ROT", "A318"];
egllIcao[76] = ["THA", "A359", "A388"];
egllIcao[77] = ["TAR", "A319", "A320"];
egllIcao[78] = ["THY", "A321", "A333", "B738", "B77W"];
egllIcao[79] = ["TUA", "B752"];
egllIcao[80] = ["UAL", "B752", "B763", "B764", "B772", "B77L", "B788", "B789"];
egllIcao[81] = ["UZB", "B752"];
egllIcao[82] = ["HVN", "B789"];
egllIcao[83] = ["VIR", "A333", "A346", "B744", "B789"];
egllIcao[84] = ["VGI", "A333"];
egllIcao[85] = ["VLG", "A320"];

void mouseClicked() {
	//redraw();
	//Select aircraft when clicked
	if (selectedAircraftsNo == 0) { //If no aircrafts selected
		for (var i = 0; i < aircraftsNo; i++) { //Test for all aircraft
			if (sqrt(sq(mouseX - aircrafts[i].radarPos[0]) + sq(mouseY - aircrafts[i].radarPos[1])) <= 1.5 * nm_to_px && aircrafts[i].control) { //Test click prox to all aircraft icons
				if (!aircrafts[i].selected) { //If aircraft(s) not selected, select it/them
					selectedAircrafts[selectedAircraftsNo] = aircrafts[i].number;
					aircrafts[i].selected = true;
					selectedAircraftsNo = selectedAircrafts.length;
				}
			}
		}
		if (selectedAircraftsNo == 1) {
			for (var j = 0; j < pilotSpeech.length; j++) {
				if (pilotSpeech[j].indexOf(aircrafts[selectedAircrafts[0]].icao + aircrafts[selectedAircrafts[0]].flightNo) != -1) {
					pilotSpeech.splice(j, 1);
					j--
				}
			}
		}
	} else { //If aircraft(s) selected
		if (mouseX > 0 && mouseX < 70 && mouseY > 0 && mouseY < 40) { //Cancel button
			if (selectedAircraftsNo == 1) {
				for (var j = 0; j < pilotSpeech.length; j++) {
					if (pilotSpeech[j].indexOf(aircrafts[selectedAircrafts[0]].icao + aircrafts[selectedAircrafts[0]].flightNo) != -1) {
						pilotSpeech.splice(j, 1);
						j--
					}
				}
			}
			for (var i = 0; i < selectedAircraftsNo; i++) { //Deselect all aircraft(s)
				aircrafts[selectedAircrafts[i]].selected = false;
				imported = false;
				selectedChanged = false;
				selectedChangeHdg = 0;
			}
			selectedAircrafts = [];
			selectedAircraftsNo = selectedAircrafts.length;
		}
		if (selectedAircraftsNo > 1) { //If >1 aircrafts selected; aircraft selection panel
			var someNumber = 0;
			for (var i = 0; i < selectedAircraftsNo; i++) {
				if (mouseX > 10 && mouseX < 230 && mouseY > 70 + 50 * i && mouseY < 110 + 50 * i) {
					someNumber++;
				} else { //Deselect other aircrafts
					aircrafts[selectedAircrafts[i]].selected = false;
				}
			}
			if (someNumber == 0) {
				for (var i = 0; i < selectedAircraftsNo; i++) {
					aircrafts[selectedAircrafts[i]].selected = true;
				}
			} else {
				selectedAircrafts = [];
				for (var i = 0; i < aircraftsNo; i++) { //Add selected aircraft back to selectedAircrafts[] array
					if (aircrafts[i].selected) {
						selectedAircrafts[0] = i;
						for (var j = 0; j < pilotSpeech.length; j++) {
							if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo) != -1) {
								pilotSpeech.splice(j, 1);
								j--
							}
						}
					}
				}
			}
		} else if (selectedAircraftsNo == 1) { //If 1 aircraft selected; ATC panel
			if (mouseX > 15 && mouseX < 55) { //- button of altitude, speed
				if (mouseY > 110 && mouseY < 150) { //- button of altitude
					if (!aircrafts[selectedAircrafts[0]].gs) {
						if (selectedAlt > 2000) {
							selectedAlt -= 1000;
							selectedChanged = true;
						} else if (selectedAlt == 2000 && aircrafts[selectedAircrafts[0]].pos[3] <= 3800) {
							selectedAlt = 1800;
							selectedChanged = true;
						}
					}
				} else if (mouseY > 190 && mouseY < 230) { //- button of speed
					if (selectedSpd > 160) {
						selectedSpd -= 10;
						selectedChanged = true;
					} else if (selectedSpd == 160 && aircrafts[selectedAircrafts[0]].loc) {
						selectedSpd = aircrafts[selectedAircrafts[0]].finalAppSpd;
						selectedChanged = true;
					}
				}
			} else if (mouseX > 185 && mouseX < 225) { //+ button of altitude, speed
				if (mouseY > 110 && mouseY < 150) { //+ button of altitude
					if (!aircrafts[selectedAircrafts[0]].gs) {
						if (selectedAlt < 10000 && selectedAlt >= 2000) {
							selectedAlt += 1000;
							selectedChanged = true;
						} else if (selectedAlt == 1800) {
							selectedAlt = 2000;
							selectedChanged = true;
						}
					}
				} else if (mouseY > 190 && mouseY < 230) { //+ button of speed
					if (selectedSpd < 250 && selectedSpd >= 160) {
						selectedSpd += 10;
						selectedChanged = true;
					} else if (selectedSpd < 160) {
						selectedSpd = 160;
						selectedChanged = true;
					}
				}
			}
			if (mouseY > 270 && mouseY < 300) { //+ buttons of heading
				if (!aircrafts[selectedAircrafts[0]].loc) {
					if (mouseX > 60 && mouseX < 100) { //+ button of 100 heading
						selectedHdgDigits[0]++;
						selectedChangeHdg += 100;
						selectedChanged = true;
					} else if (mouseX > 100 & mouseX < 140) { //+ button of 10 heading
						selectedHdgDigits[1]++;
						selectedChangeHdg += 10;
						selectedChanged = true;
					} else if (mouseX > 140 && mouseX < 220) { //+ button of 5 heading
						if (selectedHdgDigits[2] < 5) {
							selectedChangeHdg += (5 - selectedHdgDigits[2]);
							selectedHdgDigits[2] = 5;
						} else {
							selectedChangeHdg += (10 - selectedHdgDigits[2]);
							selectedHdgDigits[2] = 0;
							selectedHdgDigits[1]++;
						}
						selectedChanged = true;
					}
				}
			} else if (mouseY > 340 && mouseY < 370) { //- buttons of heading
				if (!aircrafts[selectedAircrafts[0]].loc) {
					if (mouseX > 60 && mouseX < 100) { //- button of 100 heading
						selectedHdgDigits[0]--;
						selectedChangeHdg -= 100;
						selectedChanged = true;
					} else if (mouseX > 100 & mouseX < 140) { //- button of 10 heading
						selectedHdgDigits[1]--;
						selectedChangeHdg -= 10;
						selectedChanged = true;
					} else if (mouseX > 140 && mouseX < 220) { //- button of 5 heading
						if (selectedHdgDigits[2] <= 5 && selectedHdgDigits[2] > 0) {
							selectedChangeHdg -= selectedHdgDigits[2];
							selectedHdgDigits[2] = 0;
						} else if (selectedHdgDigits[2] == 0) {
							selectedChangeHdg -= 5;
							selectedHdgDigits[2] = 5;
							selectedHdgDigits[1]--;
						} else {
							selectedChangeHdg -= (selectedHdgDigits[2] - 5);
							selectedHdgDigits[2] = 5;
						}
						selectedChanged = true;
					}
				}
			} else if (mouseY > 400 && mouseY < 440) { //buttons of ils
				if (mouseX > 60 && mouseX < 90) { //< button of ils
					selectedIlsIndex -= 1;
					if (selectedIlsIndex < 0) {
						selectedIlsIndex += activeRunways.length;
					}
					selectedChanged = true;
				} else if (mouseX > 150 && mouseX < 180) { //> button of ils
					selectedIlsIndex += 1;
					if (selectedIlsIndex > activeRunways.length - 1) {
						selectedIlsIndex -= activeRunways.length;
					}
					selectedChanged = true;
				}
			} else if (mouseY > 450 && mouseY < 490) {
				if (mouseX > 20 && mouseX < 110 && selectedChanged) { //OK button - confirm selected changes
					var delayIndex = aircrafts[selectedAircrafts[0]].delayLength;
					aircrafts[selectedAircrafts[0]].delayTiming[delayIndex] = 0;
					if (!aircrafts[selectedAircrafts[0]].gs) {
						aircrafts[selectedAircrafts[0]].delayClearedAlt[delayIndex] = selectedAlt;
					}
					if (!aircrafts[selectedAircrafts[0]].loc) {
						aircrafts[selectedAircrafts[0]].delayClearedHdg[delayIndex] = selectedHdg;
					}
					aircrafts[selectedAircrafts[0]].delayClearedIas[delayIndex] = selectedSpd;
					aircrafts[selectedAircrafts[0]].ilsIndex = selectedIlsIndex;
					aircrafts[selectedAircrafts[0]].delaySelectedChangeHdg[delayIndex] = selectedChangeHdg;
					aircrafts[selectedAircrafts[0]].delayLength++;
					selectedChangeHdg = 0;
					selectedChanged = false;
					imported = false;
				}
			}
			selectedHdg = selectedHdgDigits[0] * 100 + selectedHdgDigits[1] * 10 + selectedHdgDigits[2]; //Add all digits back
			if (selectedHdg > 360) {
				selectedHdg -= 360;
			} else if (selectedHdg < 1) {
				selectedHdg += 360;
			}
			if (selectedChangeHdg > 180) {
				selectedChangeHdg -= 360;
			} else if (selectedChangeHdg <= -180) {
				selectedChangeHdg += 360;
			}
			selectedHdgDigits[0] = floor(selectedHdg / 100); //Find digit in hundred place
			selectedHdgDigits[1] = floor((selectedHdg - selectedHdgDigits[0] * 100) / 10); //Find digit in ten place
			selectedHdgDigits[2] = selectedHdg  - selectedHdgDigits[0] * 100 - selectedHdgDigits[1] * 10; //Find digit in one place
			//Handover button
			if (mouseX > 130 && mouseX < 220 && mouseY > 450 && mouseY < 490 && aircrafts[selectedAircrafts[0]].loc && aircrafts[selectedAircrafts[0]].control) {
				aircrafts[selectedAircrafts[0]].control = false;
				aircrafts[selectedAircrafts[0]].manualHo = true;
				aircrafts[selectedAircrafts[0]].selected = false;
				selectedAircrafts = [];
				selectedAircraftsNo = selectedAircrafts.length;
				selectedChanged = false;
				imported = false;
				if (score <= 12) {
					score += 0.5;
				} else if (score <= 16) {
					score += 0.3;
				} else {
					score += 0.2;
				}
			}
		}
	}
	selectedAircraftsNo = selectedAircrafts.length;
	if (mouseX > 110 && mouseX < 210 && mouseY > 525 && mouseY < 575) {
		if (!paused) {
			paused = true;
			pauseText();
			noLoop();
		} else {
			paused = false;
			loop();
		}
	}
	if (mouseX < 100 && mouseY > 525 && mouseY < 575 && !confirmReset) {
		confirmReset = true;
		noLoop();
		confirmResetBox();
	} else if (mouseX > 645 && mouseX < 765 && mouseY > 275 && mouseY < 315 && confirmReset) {
		void resetData();
		paused = false;
		confirmReset = false;
		loop();
	} else if (mouseX > 785 && mouseX < 1005 && mouseY > 275 && mouseY < 315 && confirmReset) {
		confirmReset = false;
		loop();
	}
}

//Reset confirmation box
void confirmResetBox() {
	if (confirmReset) {
		fill(0, 150, 0);
		rect(625, 205, 300, 120);
		fill(255, 255, 255);
		rect(645, 275, 120, 40);
		rect(785, 275, 120, 40);
		fill(255, 0, 0);
		textSize(15);
		text("Are you sure you want to restart and clear all existing data? This cannot be undone!", 640, 215, 280, 50);
		fill(0, 0, 0);
		textSize(30);
		text("YES", 675, 307);
		text("NO", 823, 307);
	}
}

//Pause text
void pauseText() {
	noStroke();
	fill(0, 150, 0);
	rect(110, 525, 100, 50);
	fill(255, 255, 255);
	textSize(20);
	text("RESUME", 117, 557);
	fill(255, 0, 0);
	textSize(40);
	text("PAUSED", 680, 200);
}

//Reset all data
void resetData() {
	localStorage.clear();
	
	timeElapsed = 0;
	updateTime = 0;
	trailTime = 0;

	confirmReset = false;
	
	pilotSpeechNo = 0;
	pilotSpeech = [];
	displaySpeech = "";

	loaded = false;
	aircraftType = [];
	aircraftWake = [];
	aircraftIcao = [];
	aircraftFlightNo = [];
	aircraftPosX = [];
	aircraftPosY = [];
	aircraftHdg = [];
	aircraftAlt = [];
	trailXName = "";
	trailYName = "";
	aircraftTrailLength = [];
	aircraftClearedHdg = [];
	aircraftClearedAlt = [];
	aircraftLeftHdg = [];
	aircraftIas = [];
	aircraftClearedIas = [];
	decreaseSpd0 = [];
	decreaseSpd1 = [];
	decreaseSpd2 = [];
	decreaseSpd3 = [];
	aircraftAltChng = [];
	aircraftHdgChng = [];
	aircraftIasChng = [];
	aircraftDrag = [];
	aircraftFinalAppSpd = [];
	aircraftIlsIndex = [];
	aircraftLoc = [];
	aircraftGs = [];
	aircraftWakeTimer = [];
	gaTimer = [];
	gaState = [];
	controlToUncontrol = [];
	uncontrolToControl = [];
	aboveGS = [];
	wakeTurb = [];
	cannotLoc = [];
	crossLoc = [];
	leaveAirspace = [];
	aircraftUncontrolTimer = [];
	manualHandover = [];
	delayTimingName = "";
	delayHdgName = "";
	delayAltName = "";
	delaySpdName = "";
	delayHdgChngName = "";
	aircraftDelayLength = [];
	aircraftCollided = [];
	aircraftCollidedHdgChng = [];
	aircraftCollidedAltChng = [];

	imported = false;
	selectedAlt = 10000;
	selectedSpd = 250;
	selectedHdg = 360;
	selectedHdgDigits = [3, 6, 0];
	selectedChangeHdg = 0;
	selectedChanged = false;

	selectedAircrafts = [];
	selectedAircraftsNo = selectedAircrafts.length;

	aircrafts = [];
	aircraftsNo = 0;

	runwayChosen = false;
	activeRunways = [];

	egllRwy09Lx27R = [];
	egllRwy09Rx27L = [];
	egllSpawn1 = [];
	egllSpawn2 = [];
	egllSpawn3 = [];
	egllSpawn4 = [];
	
	score = 4.0;
}

//Draw ILS wake arcs
void drawWake(i, ilsPosX, ilsPosY) {
	stroke(0, 175, 0);
	noFill();
	var arcDeg1 = 285;
	var arcDeg2 = 255;
	if (!aircrafts[i].selected || selectedAircraftsNo != 1) {
		arcDeg1 = 280;
		arcDeg2 = 260;
	}
	var ilsDegree = 270 - aircrafts[i].ilsHeading;
	if (aircrafts[i].loc && !aircrafts[i].landed) {
		if (aircrafts[i].wake == 1) {
			arc(ilsPosX + aircrafts[i].ilsDist * cos(radians(ilsDegree)), ilsPosY + aircrafts[i].ilsDist * sin(radians(ilsDegree)), 8 * nm_to_px, 8 * nm_to_px, radians(aircrafts[i].ilsHeading - arcDeg1), radians(aircrafts[i].ilsHeading - arcDeg2));
			arc(ilsPosX + aircrafts[i].ilsDist * cos(radians(ilsDegree)), ilsPosY + aircrafts[i].ilsDist * sin(radians(ilsDegree)), 10 * nm_to_px, 10 * nm_to_px, radians(aircrafts[i].ilsHeading - arcDeg1), radians(aircrafts[i].ilsHeading - arcDeg2));
		} else if (aircrafts[i].wake == 2) {
			arc(ilsPosX + aircrafts[i].ilsDist * cos(radians(ilsDegree)), ilsPosY + aircrafts[i].ilsDist * sin(radians(ilsDegree)), 12 * nm_to_px, 12 * nm_to_px, radians(aircrafts[i].ilsHeading - arcDeg1), radians(aircrafts[i].ilsHeading - arcDeg2));
			arc(ilsPosX + aircrafts[i].ilsDist * cos(radians(ilsDegree)), ilsPosY + aircrafts[i].ilsDist * sin(radians(ilsDegree)), 14 * nm_to_px, 14 * nm_to_px, radians(aircrafts[i].ilsHeading - arcDeg1), radians(aircrafts[i].ilsHeading - arcDeg2));
		}
	}
}

//Display separation rings
void displayRings(i) {
	stroke(0, 175, 0);
	for (var j = 0; j < aircraftsNo; j++) {
		//Check proximity (within 6nm & 2000 feet)
		if (j != i && aircrafts[j].radarPos[3] >= 1800 && aircrafts[i].radarPos[3] >= 1800 && (!aircrafts[i].loc || !aircrafts[j].loc || (aircrafts[i].loc && aircrafts[j].loc && aircrafts[i].ilsIndex == aircrafts[j].ilsIndex)) && sqrt(sq(aircrafts[i].radarPos[0] - aircrafts[j].radarPos[0]) + sq(aircrafts[i].radarPos[1] - aircrafts[j].radarPos[1])) <= 6 * nm_to_px && abs(aircrafts[i].radarPos[3] - aircrafts[j].radarPos[3]) <= 1900) {
			//Check separation (within 3nm & 1000 feet)
			if (!aircrafts[i].goAroundState && !aircrafts[j].goAroundState) {
				var separationDistPx = sqrt(sq(aircrafts[i].radarPos[0] - aircrafts[j].radarPos[0]) + sq(aircrafts[i].radarPos[1] - aircrafts[j].radarPos[1]));
				var separationAlt = abs(aircrafts[i].radarPos[3] - aircrafts[j].radarPos[3]);
				if (aircrafts[i].loc && aircrafts[i].ilsDist <= 10 * nm_to_px) {
					if (aircrafts[j].loc && aircrafts[j].ilsDist <= 10 * nm_to_px) {
						if (separationDistPx < 2.5 * nm_to_px && separationAlt <= 900) {
							stroke(255, 0, 0);
							conflictAlert.play();
							score -= 0.0005;
						}
					} else if (separationDistPx < 2.75 * nm_to_px && separationAlt <= 900) {
						stroke(255, 0, 0);
						conflictAlert.play();
						score -= 0.0005;
					}
				} else {
					if (aircrafts[j].loc && aircrafts[j].ilsDist <= 10 * nm_to_px) {
						if (separationDistPx < 2.75 * nm_to_px && separationAlt <= 900) {
							stroke(255, 0, 0);
							conflictAlert.play();
							score -= 0.0005;
						}
					} else if (separationDistPx < 3 * nm_to_px && separationAlt <= 900) {
						stroke(255, 0, 0);
						conflictAlert.play();
						score -= 0.0005;
					}
				}
			} else {
				stroke(100, 100, 100);
			}
			noFill();
			if (aircrafts[i].loc && aircrafts[i].ilsDist <= 10 * nm_to_px) {
				ellipse(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], 2.5 * nm_to_px, 2.5 * nm_to_px);
			} else {
				ellipse(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], 3 * nm_to_px, 3 * nm_to_px);
			}
		}
	}
}

//Check for collision
void checkCollision(i) {
	for (var j = 0; j < aircraftsNo; j++) {
		if (j != i && abs(aircrafts[i].pos[0] - aircrafts[j].pos[0]) <= 3 && abs(aircrafts[i].pos[1] - aircrafts[j].pos[1]) <= 3 && abs(aircrafts[i].pos[3] - aircrafts[j].pos[3]) <= 50) {
			aircrafts[i].collided = true;
			aircrafts[j].collided = true;
		}
	}
}

//Display aircraft radar label
void displayLabel(i) {
	fill(0, 255, 0);
	textSize(10);
	if (aircrafts[i].control) {
		if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
			text(aircrafts[i].icao + aircrafts[i].flightNo, aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] + 14);
			text(floor(aircrafts[i].radarPos[3] / 100), aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] + 24);
			if (aircrafts[i].radarAltChng > 0 && !aircrafts[i].gs) {
				translate(aircrafts[i].radarPos[0] - 4, aircrafts[i].radarPos[1] + 24);
				rotate(PI);
				text("V", -7, 7);
				rotate(-PI);
				translate(-aircrafts[i].radarPos[0] + 4, -aircrafts[i].radarPos[1] - 24);
			} else if (aircrafts[i].radarAltChng < 0 || aircrafts[i].gs) {
				text("V", aircrafts[i].radarPos[0] - 4, aircrafts[i].radarPos[1] + 24);
			} else {
				text("=", aircrafts[i].radarPos[0] - 2, aircrafts[i].radarPos[1] + 24);
			}
			if (!aircrafts[i].gs) {
				if (aircrafts[i].delayLength <= 0) {
					text(aircrafts[i].clearedPos[1] / 100, aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] + 24);
				} else {
					text(aircrafts[i].delayClearedAlt[aircrafts[i].delayLength - 1] / 100, aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] + 24);
				}
			} else {
				text("G/S", aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] + 24);
			}
			if (aircrafts[i].wake == 1) {
				text(floor(aircrafts[i].radarTas) + "H", aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] + 34);
			} else if (aircrafts[i].wake == 2) {
				text(floor(aircrafts[i].radarTas) + "J", aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] + 34);
			} else {
				text(floor(aircrafts[i].radarTas), aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] + 34);
			}
			if (aircrafts[i].loc) {
				text("LOC", aircrafts[i].radarPos[0] + 9, aircrafts[i].radarPos[1] + 34);
			} else if (!aircrafts[i].loc && aircrafts[i].ilsIndex != 0) {
				text("ILS" + aircrafts[i].ils[aircrafts[i].ilsIndex], aircrafts[i].radarPos[0] + 9, aircrafts[i].radarPos[1] + 34);
			}
		} else {
			text(aircrafts[i].icao + aircrafts[i].flightNo, aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] - 26);
			text(floor(aircrafts[i].radarPos[3] / 100), aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] - 16);
			if (aircrafts[i].radarAltChng > 0) {
				translate(aircrafts[i].radarPos[0] - 4, aircrafts[i].radarPos[1] - 16);
				rotate(PI);
				text("V", -7, 7);
				rotate(-PI);
				translate(-aircrafts[i].radarPos[0] + 4, -aircrafts[i].radarPos[1] + 16);
			} else if (aircrafts[i].radarAltChng < 0 || aircrafts[i].gs) {
				text("V", aircrafts[i].radarPos[0] - 4, aircrafts[i].radarPos[1] - 16);
			} else {
				text("=", aircrafts[i].radarPos[0] - 2, aircrafts[i].radarPos[1] - 16);
			}
			if (!aircrafts[i].gs) {
				if (aircrafts[i].delayLength <= 0) {
					text(aircrafts[i].clearedPos[1] / 100, aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] - 16);
				} else {
					text(aircrafts[i].delayClearedAlt[aircrafts[i].delayLength - 1] / 100, aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] - 16);
				}
			} else {
				text("G/S", aircrafts[i].radarPos[0] + 8, aircrafts[i].radarPos[1] - 16);
			}
			if (aircrafts[i].wake == 1) {
				text(floor(aircrafts[i].radarTas) + "H", aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] - 6);
			} else if (aircrafts[i].wake == 2) {
				text(floor(aircrafts[i].radarTas) + "J", aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] - 6);
			} else {
				text(floor(aircrafts[i].radarTas), aircrafts[i].radarPos[0] - 22, aircrafts[i].radarPos[1] - 6);
			}
			if (aircrafts[i].loc) {
				text("LOC", aircrafts[i].radarPos[0] + 9, aircrafts[i].radarPos[1] - 6);
			} else if (!aircrafts[i].loc && aircrafts[i].ilsIndex != 0) {
				text("ILS" + aircrafts[i].ils[aircrafts[i].ilsIndex], aircrafts[i].radarPos[0] + 9, aircrafts[i].radarPos[1] - 6);
			}
		}
	} else {
		if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
			text(floor(aircrafts[i].radarPos[3] / 100), aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] + 14);
			
			if (aircrafts[i].wake == 1) {
				text(floor(aircrafts[i].radarTas) + "H", aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] + 24);
			} else if (aircrafts[i].wake == 2) {
				text(floor(aircrafts[i].radarTas) + "J", aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] + 24);
			} else {
				text(floor(aircrafts[i].radarTas), aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] + 24);
			}
			
		} else {
			text(floor(aircrafts[i].radarPos[3] / 100), aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] - 16);
			
			if (aircrafts[i].wake == 1) {
				text(floor(aircrafts[i].radarTas) + "H", aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] - 6);
			} else if (aircrafts[i].wake == 2) {
				text(floor(aircrafts[i].radarTas) + "J", aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] - 6);
			} else {
				text(floor(aircrafts[i].radarTas), aircrafts[i].radarPos[0] - 10, aircrafts[i].radarPos[1] - 6);
			}
			
		}
	}
	textSize(12);
}

void displayFuture(i) {
	stroke(255, 255, 0);
	line(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], aircrafts[i].radarPos[0] + aircrafts[i].radarXChng * 3000, aircrafts[i].radarPos[1] - aircrafts[i].radarYChng * 3000);
}

void displayClearedLine(i) {
	line(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], aircrafts[i].radarPos[0] + (1220 * cos(radians(450 - selectedHdg))), aircrafts[i].radarPos[1] - (1220 * sin(radians(450 - selectedHdg))));
}

void updateRunwayArray(i, runwayArray) {
	if (aircrafts[i].loc && !aircrafts[i].ilsArray) {
		if (runwayArray.length == 0) {
			runwayArray[0] = i;
		} else {
			for (var j = 0; j < runwayArray.length + 1; j++) {
				if (j == 0) {
					if (aircrafts[i].ilsDist <= aircrafts[runwayArray[j]].ilsDist) {
						runwayArray.unshift(i);
						break;
					}
				} else if (j > 0 && j < runwayArray.length) {
					if (aircrafts[i].ilsDist <= aircrafts[runwayArray[j]].ilsDist && aircrafts[i].ilsDist > aircrafts[runwayArray[j - 1]].ilsDist) {
						runwayArray.splice(j, 0, i);
						break;
					}
				} else if (j == runwayArray.length) {
					if (aircrafts[i].ilsDist > aircrafts[runwayArray[j - 1]].ilsDist) {
						runwayArray.push(i);
						break;
					}
				}
			}
		}
		aircrafts[i].ilsArray = true;
	}
}

void removeRunwayArray(i, runwayArray) {
	for (var j = 0; j < runwayArray.length; j++) {
		if (aircrafts[runwayArray[j]] == i) {
			runwayArray.splice(j, 1);
			aircrafts[i].runwayArray = false;
			break;
		}
	}
}

//Wake turbulence timer
void wakeTurbTimer(i, runwayArray) {
	if (runwayArray.length > 1 && runwayArray[0] != i) {
		for (var j = 1; j < runwayArray.length; j++) {
			var wakeSeparation = aircrafts[i].ilsDist - aircrafts[runwayArray[j - 1]].ilsDist;
			if (!aircrafts[runwayArray[j - 1]].landed && runwayArray[j] == i && abs(aircrafts[i].pos[3] - aircrafts[runwayArray[j - 1]].pos[3] - 500) <= 1000) {
				if (aircrafts[runwayArray[j - 1]].wake == 1) { //Heavy in front
					if (aircrafts[i].wake == 0 && wakeSeparation < 5 * nm_to_px) { //Require 5 nm separation for medium, 1 nm window
						aircrafts[i].wakeStatus = true;
						if (wakeSeparation < 4 * nm_to_px) {
							aircrafts[i].wakeTimer++;
						}
					} else if (aircrafts[i].wake == 1 && wakeSeparation < 4 * nm_to_px) { //Require 4 nm separation for heavy, 1 nm window
						aircrafts[i].wakeStatus = true;
						if (wakeSeparation < 3 * nm_to_px) {
							aircrafts[i].wakeTimer++;
						}
					}
				} else if (aircrafts[runwayArray[j - 1]].wake == 2) { //Super in front (controller's nightmare?)
					if (aircrafts[i].wake == 0 && wakeSeparation < 7 * nm_to_px) { //Require 7 nm separation for medium, 1 nm window
						aircrafts[i].wakeStatus = true;
						if (wakeSeparation < 6 * nm_to_px) {
							aircrafts[i].wakeTimer++;
						}
					} else if (aircrafts[i].wake == 1 && wakeSeparation < 6 * nm_to_px) { //Require 6 nm separation for heavy, 1 nm window
						aircrafts[i].wakeStatus = true;
						if (wakeSeparation < 5 * nm_to_px) {
							aircrafts[i].wakeTimer++;
						}
					}
				}
			}
		}
	}
}

//Display ATC panel
void displayAtcPanel(i) {
	//Import current aircraft cleared information only once
	if (!imported && selectedAircraftsNo == 1) {
		var delayIndex1 = aircrafts[i].delayLength - 1;
		imported = true;
		if (delayIndex1 >= 0) {
			selectedAlt = aircrafts[i].delayClearedAlt[delayIndex1];
			selectedHdg = aircrafts[i].delayClearedHdg[delayIndex1];
			selectedSpd = aircrafts[i].delayClearedIas[delayIndex1];
		} else {
			selectedAlt = aircrafts[i].clearedPos[1];
			selectedHdg = aircrafts[i].clearedPos[0];
			selectedSpd = aircrafts[i].clearedIas;
		}
		selectedHdgDigits[0] = floor(selectedHdg / 100);
		selectedHdgDigits[1] = floor((selectedHdg - selectedHdgDigits[0] * 100) / 10);
		selectedHdgDigits[2] = selectedHdg  - selectedHdgDigits[0] * 100 - selectedHdgDigits[1] * 10;
		selectedIlsIndex = aircrafts[i].ilsIndex;
	}
	selectedIls = aircrafts[i].ils[selectedIlsIndex];
	stroke(0, 255, 0);
	//Display cleared heading line
	if (!aircrafts[i].loc) {
		displayClearedLine(i);
	}
	noStroke();
	fill(255, 255, 255);
	rect(0, 0, 250, 500); //Cover-up panel
	fill(150, 150, 150);
	rect(0, 0, 240, 500); //Main panel
	fill(0, 175, 0);
	rect(0, 0, 70, 40); //Cancel button
	//Altitude change buttons
	rect(15, 110, 40, 40);
	rect(185, 110, 40, 40);
	//Speed change buttons
	rect(15, 190, 40, 40);
	rect(185, 190, 40, 40);
	//Heading change buttons
	rect(60, 270, 120, 30);
	rect(60, 340, 120, 30);
	//ILS change buttons
	rect(60, 400, 30, 40);
	rect(150, 400, 30, 40);
	//Ok button
	rect(20, 450, 90, 40);
	//H/O button
	if (aircrafts[i].loc) {
		rect(130, 450, 90, 40);
	}
	stroke(0, 0, 0);
	line(100, 270, 100, 368);
	line(140, 270, 140, 368);
	noStroke();
	fill(0, 0, 0);
	rect(55, 110, 130, 40); //Altitude display screen
	rect(55, 190, 130, 40); //Speed display screen
	rect(60, 300, 120, 40); //Heading display screen
	rect(90, 400, 60, 40); //ILS display screen
	textSize(18);
	text("Cancel", 6, 25); //Cancel button
	text("Altitude", 6, 100); //Altitude label
	text("Speed", 6, 180); //Speed label
	text("Heading", 6, 260); //Heading label
	text("ILS", 6, 390); //ILS label
	textSize(25);
	text(aircrafts[i].icao + aircrafts[i].flightNo, 20, 70); //Display aircraft callsign
	text(aircrafts[i].type, 140, 70); //Display aircraft type
	if (!aircrafts[i].loc) { //Show heading change buttons when LOC not captured
		for (var j = 0; j < 3; j++) {
			text("+", 73 + j * 40, 295);
			text("-", 76 + j * 40, 363);
		}
	}
	if (!aircrafts[i].gs) { //Show altitude change buttons when GS not captured
		if (aircrafts[i].pos[3] <= 3800 && selectedAlt > 1800 || aircrafts[i].pos[3] > 3000 && selectedAlt > 2000) {
			text("-", 31, 138);
		}
		if (selectedAlt < 10000) {
			text("+", 198, 140);
		}
	}
	//Set minimum cleared speed to 160 when LOC not captured or minimum approach speed if LOC captured
	if (selectedSpd > aircrafts[i].finalAppSpd && aircrafts[i].loc || selectedSpd > 160) {
		text("-", 31, 218);
	}
	//Set maximum cleared speed to 250
	if (selectedSpd < 250) {
		text("+", 198, 220);
	}
	text("<", 68, 430);
	text(">", 158, 430);
	if (aircrafts[i].loc) {
		text("H/O", 155, 477);
	}
	//OK button shows different colour if changes made
	if (selectedChanged) {
		fill(255, 255, 0);
	}
	text("OK", 45, 477);
	fill(255, 255, 255);
	//Display current selected parameters
	text(selectedAlt, 90, 140);
	text(selectedSpd, 100, 220);
	text(selectedIls, 100, 430);
	//Display current selected heading if LOC not captured
	if (!aircrafts[i].loc) {
		for (var j = 0; j < 3; j++) {
			text(selectedHdgDigits[j], 73 + 40 * j, 330);
		}
	} else { //Otherwise show LOC
		text("LOC", 95, 330);
	}
	fill(0, 0, 0);
	if (aircrafts[i].control) {
		if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
			rect(aircrafts[i].radarPos[0] - 24, aircrafts[i].radarPos[1] + 4, 64, 32);
		} else {
			rect(aircrafts[i].radarPos[0] - 24, aircrafts[i].radarPos[1] - 36, 64, 32);
		}
	} else {
		if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
			rect(aircrafts[i].radarPos[0] - 24, aircrafts[i].radarPos[1] + 4, 24, 22);
		} else {
			rect(aircrafts[i].radarPos[0] - 24, aircrafts[i].radarPos[1] - 26, 24, 22);
		}
	}
	displayLabel(i);
	//Display leveling off position if glide slope not captured
	stroke(0, 255, 0);
	noFill();
	if (!aircrafts[i].gs) {
		if (selectedAlt > aircrafts[i].radarPos[3] && selectedAlt != aircrafts[i].clearedPos[1]) {
			arc(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - selectedAlt) / 0.7, selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - selectedAlt) / 0.7, radians(selectedHdg - 120), radians(selectedHdg - 60));
		} else if (selectedAlt < aircrafts[i].radarPos[3] && selectedAlt != aircrafts[i].clearedPos[1]) {
			arc(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - selectedAlt) / 0.5, selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - selectedAlt) / 0.5, radians(selectedHdg - 120), radians(selectedHdg - 60));
		} else if (selectedAlt == aircrafts[i].clearedPos[1] && abs(aircrafts[i].clearedPos[1] - aircrafts[i].radarPos[3]) > 200) {
			arc(aircrafts[i].radarPos[0], aircrafts[i].radarPos[1], selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - aircrafts[i].clearedPos[1]) / abs(aircrafts[i].radarAltChng), selectedSpd * nm_to_px / 90000 * abs(aircrafts[i].radarPos[3] - aircrafts[i].clearedPos[1]) / abs(aircrafts[i].radarAltChng), radians(selectedHdg - 120), radians(selectedHdg - 60));
		}
	}
	//Separation incidents & rings
	displayRings(i);
	noStroke();
}

//Display aircraft selection panel
void displayAircraftSel() {
	noStroke();
	fill(150, 150, 150);
	rect(0, 0, 240, 500); //Main panel
	fill(0, 175, 0);
	rect(0, 0, 70, 40); //Cancel button
	for (var i = 0; i < selectedAircraftsNo; i++) {
		fill(0, 175, 0);
		rect(5, 70 + i * 50, 230, 40); //Buttons
		fill(0, 0, 0);
		//Display ICAO, flight number, aircraft type, altitude, cleared altitude (line 1)
		text(aircrafts[selectedAircrafts[i]].icao + aircrafts[selectedAircrafts[i]].flightNo, 10, 85 + 50 * i);
		text(aircrafts[selectedAircrafts[i]].type, 70, 85 + 50 * i);
		if (!aircrafts[selectedAircrafts[i]].gs) {
			text("ALT: " + floor(aircrafts[selectedAircrafts[i]].pos[3] / 100) * 100 + " TO " + aircrafts[selectedAircrafts[i]].clearedPos[1], 110, 85 + 50 * i);
		} else {
			text("ALT: " + floor(aircrafts[selectedAircrafts[i]].pos[3] / 100) * 100 + " TO G/S", 110, 85 + 50 * i);
		}
		
		//Display GS, heading, cleared heading, cleared ILS (line 2)
		text("GS: " + floor(aircrafts[selectedAircrafts[i]].radarTas) + " ", 20, 100 + 50 * i);
		if (!aircrafts[selectedAircrafts[i]].loc) {
			text("HDG: " + floor(aircrafts[selectedAircrafts[i]].pos[2]) + " TO " + aircrafts[selectedAircrafts[i]].clearedPos[0], 70, 100 + 50 * i);
		} else {
			text("HDG: " + floor(aircrafts[selectedAircrafts[i]].pos[2]) + " TO LOC", 70, 100 + 50 * i);
		}
		text("ILS" + aircrafts[selectedAircrafts[i]].ils[aircrafts[selectedAircrafts[i]].ilsIndex], 180, 100 + 50 * i);
	}
	
	fill(0, 0, 0);
	textSize(18);
	text("Cancel", 6, 25);
	text("Choose aircraft:", 50, 60);
}

//Information loading function (from HTML5 local storage)
void loadAircraft() {
	fill(255, 0, 0);
	text("If you see this message, refer to", 60, 360);
	text("the \"clear storage\" section below.", 60, 375);
	trailTime = parseInt(localStorage.getItem("trailTime"));
	pilotSpeechNo = parseInt(localStorage.getItem("pilotSpeechNo"));
	var speechString = localStorage.getItem("pilotSpeech");
	for (var i = 0; i < pilotSpeechNo; i++) {
		pilotSpeech[i] = speechString.split(" ,")[i] + " ";
	}
	//Load pilot speech
	runwayChosen = (localStorage.getItem("runwayChosen") == "true");
	activeRunways = localStorage.getItem("activeRunways").split(",");
	aircraftsNo = parseInt(localStorage.getItem("aircraftArray"));
	score = parseFloat(localStorage.getItem("playerScore"));
	highScore = parseFloat(localStorage.getItem("playerHighScore"));
	egllSpawn1 = parseInt(localStorage.getItem("egllSpawn1").split(","));
	egllSpawn2 = parseInt(localStorage.getItem("egllSpawn2").split(","));
	egllSpawn3 = parseInt(localStorage.getItem("egllSpawn3").split(","));
	egllSpawn4 = parseInt(localStorage.getItem("egllSpawn4").split(","));
	for (var i = 0; i < aircraftsNo; i++) {
		//Load object
		aircrafts[i] = new Object();
		
		//Load aircraft index
		aircrafts[i].number = i;
		
		//Load aircraft type
		aircrafts[i].type = localStorage.getItem("aircraftType").split(",")[i];
		
		//Load wake turbulence category
		aircrafts[i].wake = parseInt(localStorage.getItem("aircraftWake").split(",")[i]);
		
		//Load ICAO code
		aircrafts[i].icao = localStorage.getItem("aircraftIcao").split(",")[i];
		
		//Load flight number
		aircrafts[i].flightNo = parseInt(localStorage.getItem("aircraftFlightNo").split(",")[i]);
		
		//Load position info array
		aircrafts[i].pos = [];
		aircrafts[i].pos[0] = parseFloat(localStorage.getItem("aircraftPosX").split(",")[i]);
		aircrafts[i].pos[1] = parseFloat(localStorage.getItem("aircraftPosY").split(",")[i]);
		aircrafts[i].pos[2] = parseFloat(localStorage.getItem("aircraftHdg").split(",")[i]);
		aircrafts[i].pos[3] = parseFloat(localStorage.getItem("aircraftAlt").split(",")[i]);
		aircrafts[i].radarPos = aircrafts[i].pos;
		
		//Load aircraft trails array
		trailXName = "trailX" + String(i);
		trailYName = "trailY" + String(i);
		aircrafts[i].trailX = parseFloat(localStorage.getItem(trailXName).split(","));
		aircrafts[i].trailY = parseFloat(localStorage.getItem(trailYName).split(","));
		aircrafts[i].trailLength = aircrafts[i].trailX.length;
		
		//Load cleared position array
		aircrafts[i].clearedPos = [];
		aircrafts[i].clearedPos[0] = parseInt(localStorage.getItem("aircraftClearedHdg").split(",")[i]);
		aircrafts[i].clearedPos[1] = parseInt(localStorage.getItem("aircraftClearedAlt").split(",")[i]);
		aircrafts[i].leftChangeHdg = parseFloat(localStorage.getItem("aircraftLeftHdg").split(",")[i]);
		
		//Load delayed cleared positions array
		delayTimingName = "delayTiming" + String(i);
		delayHdgName = "delayHdgName" + String(i);
		delayAltName = "delayAltName" + String(i);
		delaySpdName = "delaySpdName" + String(i);
		delayHdgChngName = "delayHdgChngName" + String(i);
		aircrafts[i].delayTiming = parseInt(localStorage.getItem(delayTimingName).split(","));
		aircrafts[i].delayClearedHdg = parseInt(localStorage.getItem(delayHdgName).split(","));
		aircrafts[i].delayClearedAlt = parseInt(localStorage.getItem(delayAltName).split(","));
		aircrafts[i].delayClearedIas = parseInt(localStorage.getItem(delaySpdName).split(","));
		aircrafts[i].delaySelectedChangeHdg = parseInt(localStorage.getItem(delayHdgChngName).split(","));
		aircrafts[i].delayLength = parseInt(localStorage.getItem("aircraftDelayLength").split(",")[i]);
		
		//Calculate aircraft degrees (typically used in math)
		aircrafts[i].degrees = 450 - aircrafts[i].pos[2];
		
		//Load IAS
		aircrafts[i].ias = parseFloat(localStorage.getItem("aircraftIas").split(",")[i]);
		aircrafts[i].clearedIas = parseInt(localStorage.getItem("aircraftClearedIas").split(",")[i]);
		aircrafts[i].decreaseSpd = [];
		aircrafts[i].decreaseSpd[0] = (localStorage.getItem("decreaseSpd0").split(",")[i] == "true");
		aircrafts[i].decreaseSpd[1] = (localStorage.getItem("decreaseSpd1").split(",")[i] == "true");
		aircrafts[i].decreaseSpd[2] = (localStorage.getItem("decreaseSpd2").split(",")[i] == "true");
		aircrafts[i].decreaseSpd[3] = (localStorage.getItem("decreaseSpd3").split(",")[i] == "true");
		
		//Calculate TAS
		aircrafts[i].tas = aircrafts[i].ias * (1 + aircrafts[i].pos[3] / 1000 * 0.02);
		aircrafts[i].radarTas = aircrafts[i].tas;
		
		//Load & calculate rate of change of x, y, altitude, heading, speed
		aircrafts[i].xChng = aircrafts[i].tas * cos(radians(aircrafts[i].degrees)) * nm_to_px / 180000;
		aircrafts[i].radarXChng = aircrafts[i].xChng;
		aircrafts[i].yChng = aircrafts[i].tas * sin(radians(aircrafts[i].degrees)) * nm_to_px / 180000;
		aircrafts[i].radarYChng = aircrafts[i].yChng;
		aircrafts[i].altChng = parseFloat(localStorage.getItem("aircraftAltChng").split(",")[i]);
		aircrafts[i].radarAltChng = aircrafts[i].altChng;
		aircrafts[i].hdgChng = parseFloat(localStorage.getItem("aircraftHdgChng").split(",")[i]);
		aircrafts[i].iasChng = parseFloat(localStorage.getItem("aircraftIasChng").split(",")[i]);
		aircrafts[i].dragFactor = parseFloat(localStorage.getItem("aircraftDrag").split(",")[i]);
		aircrafts[i].finalAppSpd = parseInt(localStorage.getItem("aircraftFinalAppSpd").split(",")[i]);
		
		//Load ILS properties
		aircrafts[i].ils = localStorage.getItem("activeRunways").split(",");
		aircrafts[i].ilsIndex = parseInt(localStorage.getItem("aircraftIlsIndex").split(",")[i]);
		aircrafts[i].loc = (localStorage.getItem("aircraftLoc").split(",")[i] == "true");
		aircrafts[i].gs = (localStorage.getItem("aircraftGs").split(",")[i] == "true");
		aircrafts[i].wakeTimer = parseInt(localStorage.getItem("aircraftWakeTimer").split(",")[i]);
		aircrafts[i].gsAlt = 0;
		aircrafts[i].ilsOffsetX = 0;
		aircrafts[i].ilsOffsetY = 0;
		aircrafts[i].ilsDist = 0;
		aircrafts[i].ilsHeading = 0;
		aircrafts[i].ilsY = 0;
		aircrafts[i].ilsArray = false;
		aircrafts[i].goAroundTimer = parseInt(localStorage.getItem("gaTimer").split(",")[i]);
		aircrafts[i].goAroundState = (localStorage.getItem("gaState").split(",")[i] == "true");
		
		//Load pilot message status
		aircrafts[i].msgArray = [];
		aircrafts[i].msgArray[0] = (localStorage.getItem("uncontrolToControl").split(",")[i] == "true");
		aircrafts[i].msgArray[1] = (localStorage.getItem("controlToUncontrol").split(",")[i] == "true");
		aircrafts[i].msgArray[2] = (localStorage.getItem("aboveGS").split(",")[i] == "true");
		aircrafts[i].msgArray[3] = (localStorage.getItem("wakeTurb").split(",")[i] == "true");
		aircrafts[i].msgArray[4] = (localStorage.getItem("cannotLoc").split(",")[i] == "true");
		aircrafts[i].msgArray[5] = (localStorage.getItem("crossLoc").split(",")[i] == "true");
		aircrafts[i].msgArray[6] = (localStorage.getItem("leaveAirspace").split(",")[i] == "true");
		
		aircrafts[i].selected = false;
		
		aircrafts[i].control = false;
		aircrafts[i].uncontrolTimer = parseInt(localStorage.getItem("aircraftUncontrolTimer").split(",")[i]);
		aircrafts[i].manualHo = (localStorage.getItem("manualHandover").split(",")[i] == "true");
		
		aircrafts[i].landed = false;
		
		aircrafts[i].collided = (localStorage.getItem("aircraftCollided").split(",")[i] == "true");
		aircrafts[i].collidedHdgChng = (localStorage.getItem("aircraftCollidedHdgChng").split(",")[i] == "true");
		aircrafts[i].collidedAltChng = (localStorage.getItem("aircraftCollidedAltChng").split(",")[i] == "true");
	}
}

//Information saving function (to HTML5 local storage)
void saveAircraft() {
	for (var i = 0; i < aircraftsNo; i++) {
		trailXName = "trailX" + String(i);
		trailYName = "trailY" + String(i);
		delayTimingName = "delayTiming" + String(i);
		delayHdgName = "delayHdgName" + String(i);
		delayAltName = "delayAltName" + String(i);
		delaySpdName = "delaySpdName" + String(i);
		delayHdgChngName = "delayHdgChngName" + String(i);
		aircraftType[i] = aircrafts[i].type;
		aircraftWake[i] = aircrafts[i].wake;
		aircraftIcao[i] = aircrafts[i].icao;
		aircraftFlightNo[i] = aircrafts[i].flightNo;
		aircraftPosX[i] = aircrafts[i].pos[0];
		aircraftPosY[i] = aircrafts[i].pos[1];
		aircraftHdg[i] = aircrafts[i].pos[2];
		aircraftAlt[i] = aircrafts[i].pos[3];
		aircraftClearedHdg[i] = aircrafts[i].clearedPos[0];
		aircraftClearedAlt[i] = aircrafts[i].clearedPos[1];
		aircraftLeftHdg[i] = aircrafts[i].leftChangeHdg;
		aircraftIas[i] = aircrafts[i].ias;
		aircraftClearedIas[i] = aircrafts[i].clearedIas;
		decreaseSpd0[i] = aircrafts[i].decreaseSpd[0];
		decreaseSpd1[i] = aircrafts[i].decreaseSpd[1];
		decreaseSpd2[i] = aircrafts[i].decreaseSpd[2];
		decreaseSpd3[i] = aircrafts[i].decreaseSpd[3];
		aircraftAltChng[i] = aircrafts[i].altChng;
		aircraftHdgChng[i] = aircrafts[i].hdgChng;
		aircraftIasChng[i] = aircrafts[i].iasChng;
		aircraftDrag[i] = aircrafts[i].dragFactor;
		aircraftFinalAppSpd[i] = aircrafts[i].finalAppSpd;
		aircraftIlsIndex[i] = aircrafts[i].ilsIndex;
		aircraftLoc[i] = aircrafts[i].loc;
		aircraftGs[i] = aircrafts[i].gs;
		aircraftWakeTimer[i] = aircrafts[i].wakeTimer;
		gaTimer[i] = aircrafts[i].goAroundTimer;
		uncontrolToControl[i] = aircrafts[i].msgArray[0];
		controlToUncontrol[i] = aircrafts[i].msgArray[1];
		aboveGS[i] = aircrafts[i].msgArray[2];
		wakeTurb[i] = aircrafts[i].msgArray[3];
		cannotLoc[i] = aircrafts[i].msgArray[4];
		crossLoc[i] = aircrafts[i].msgArray[5];
		leaveAirspace[i] = aircrafts[i].msgArray[6];
		aircraftUncontrolTimer[i] = aircrafts[i].uncontrolTimer;
		manualHandover[i] = aircrafts[i].manualHo;
		aircraftDelayLength[i] = aircrafts[i].delayLength;
		aircraftCollided[i] = aircrafts[i].collided;
		aircraftCollidedHdgChng[i] = aircrafts[i].collidedHdgChng;
		aircraftCollidedAltChng[i] = aircrafts[i].collidedAltChng;
		localStorage.setItem(trailXName, aircrafts[i].trailX);
		localStorage.setItem(trailYName, aircrafts[i].trailY);
		localStorage.setItem(delayTimingName, aircrafts[i].delayTiming);
		localStorage.setItem(delayHdgName, aircrafts[i].delayClearedHdg);
		localStorage.setItem(delayAltName, aircrafts[i].delayClearedAlt);
		localStorage.setItem(delaySpdName, aircrafts[i].delayClearedIas);
		localStorage.setItem(delayHdgChngName, aircrafts[i].delaySelectedChangeHdg);
	}
	localStorage.setItem("aircraftArray", aircraftsNo);
	localStorage.setItem("aircraftType", aircraftType);
	localStorage.setItem("aircraftWake", aircraftWake);
	localStorage.setItem("aircraftIcao", aircraftIcao);
	localStorage.setItem("aircraftFlightNo", aircraftFlightNo);
	localStorage.setItem("aircraftPosX", aircraftPosX);
	localStorage.setItem("aircraftPosY", aircraftPosY);
	localStorage.setItem("aircraftHdg", aircraftHdg);
	localStorage.setItem("aircraftAlt", aircraftAlt);
	localStorage.setItem("aircraftClearedHdg", aircraftClearedHdg);
	localStorage.setItem("aircraftClearedAlt", aircraftClearedAlt);
	localStorage.setItem("aircraftLeftHdg", aircraftLeftHdg);
	localStorage.setItem("aircraftIas", aircraftIas);
	localStorage.setItem("decreaseSpd0", decreaseSpd0);
	localStorage.setItem("decreaseSpd1", decreaseSpd1);
	localStorage.setItem("decreaseSpd2", decreaseSpd2);
	localStorage.setItem("decreaseSpd3", decreaseSpd3);
	localStorage.setItem("aircraftClearedIas", aircraftClearedIas);
	localStorage.setItem("aircraftAltChng", aircraftAltChng);
	localStorage.setItem("aircraftHdgChng", aircraftHdgChng);
	localStorage.setItem("aircraftIasChng", aircraftIasChng);
	localStorage.setItem("aircraftDrag", aircraftDrag);
	localStorage.setItem("aircraftFinalAppSpd", aircraftFinalAppSpd);
	localStorage.setItem("aircraftIlsIndex", aircraftIlsIndex);
	localStorage.setItem("aircraftLoc", aircraftLoc);
	localStorage.setItem("aircraftGs", aircraftGs);
	localStorage.setItem("aircraftWakeTimer", aircraftWakeTimer);
	localStorage.setItem("gaTimer", gaTimer);
	localStorage.setItem("gaState", gaState);
	localStorage.setItem("trailTime", trailTime);
	localStorage.setItem("pilotSpeechNo", pilotSpeechNo);
	localStorage.setItem("pilotSpeech", pilotSpeech);
	localStorage.setItem("runwayChosen", runwayChosen);
	localStorage.setItem("activeRunways", activeRunways);
	localStorage.setItem("uncontrolToControl", uncontrolToControl);
	localStorage.setItem("controlToUncontrol", controlToUncontrol);
	localStorage.setItem("aboveGS", aboveGS);
	localStorage.setItem("wakeTurb", wakeTurb);
	localStorage.setItem("cannotLoc", cannotLoc);
	localStorage.setItem("crossLoc", crossLoc);
	localStorage.setItem("leaveAirspace", leaveAirspace);
	localStorage.setItem("aircraftUncontrolTimer", aircraftUncontrolTimer);
	localStorage.setItem("manualHandover", manualHandover);
	localStorage.setItem("aircraftDelayLength", aircraftDelayLength);
	localStorage.setItem("aircraftCollided", aircraftCollided);
	localStorage.setItem("aircraftCollidedHdgChng", aircraftCollidedHdgChng);
	localStorage.setItem("aircraftCollidedAltChng", aircraftCollidedAltChng);
	localStorage.setItem("playerScore", score);
	localStorage.setItem("playerHighScore", highScore);
	localStorage.setItem("egllSpawn1", egllSpawn1);
	localStorage.setItem("egllSpawn2", egllSpawn2);
	localStorage.setItem("egllSpawn3", egllSpawn3);
	localStorage.setItem("egllSpawn4", egllSpawn4);
}

void randomIcao(i, icaoArray) {
	var randomIcaoNo = floor(random(icaoArray.length));
	aircrafts[i].icao = icaoArray[randomIcaoNo][0];
	aircrafts[i].type = icaoArray[randomIcaoNo][floor(random(1, icaoArray[randomIcaoNo].length))];
}

//Aircraft creating function
void createAircraft() {
	//Create object
	aircrafts[aircraftsNo] = new Object();
	
	//Store aircraft index in array
	aircrafts[aircraftsNo].number = aircraftsNo;
	
	//Generate ICAO code, type from ICAO array
	if (airportChosen == "EGLL") {
		randomIcao(aircraftsNo, egllIcao);
	}
	
	//Generate wake turbulence category (B75X special case not accounted for)
	aircrafts[aircraftsNo].wake = 0;
	for (var x = 0; x < wakeHeavyNo; x++) {
		if (aircrafts[aircraftsNo].type == wakeHeavy[x]) {
			aircrafts[aircraftsNo].wake = 1;
		}
	}
	if (aircrafts[aircraftsNo].wake != 1) {
		if (aircrafts[aircraftsNo].type == "A388") {
			aircrafts[aircraftsNo].wake = 2;
		} else {
			aircrafts[aircraftsNo].wake = 0;
		}
	}
	
	//Generate random flight number from 1 to 9999
	aircrafts[aircraftsNo].flightNo = ceil(random(9999));
	
	//Initialise position info array
	aircrafts[aircraftsNo].pos = [];//400, 250, 120, 10000];
	
	//Initialise aircraft trails array
	aircrafts[aircraftsNo].trailX = [];
	aircrafts[aircraftsNo].trailY = [];
	aircrafts[aircraftsNo].trailLength = aircrafts[aircraftsNo].trailX.length;
	
	//Initial IAS
	aircrafts[aircraftsNo].ias = 250;
	aircrafts[aircraftsNo].clearedIas = aircrafts[aircraftsNo].ias;
	aircrafts[aircraftsNo].decreaseSpd = [false, false, false, false];
	
	//Select 1 of 4 entry points , 7000 feet
	if (airportChosen == "EGLL") {
		var selectEntryPos = floor(random(4));
		if (selectEntryPos == 0) {
			aircrafts[aircraftsNo].pos = [270, 20, floor(random(120, 151)), 7000];
			if (egllSpawn1.length > 0) {
				aircrafts[aircraftsNo].pos[3] = egllSpawn1[1] + 1000;
				aircrafts[aircraftsNo].ias = egllSpawn1[2] - 20;
				aircrafts[aircraftsNo].clearedIas = aircrafts[aircraftsNo].ias;
			}
			egllSpawn1 = [3000, aircrafts[aircraftsNo].pos[3], aircrafts[aircraftsNo].clearedIas];
		} else if (selectEntryPos == 1) {
			aircrafts[aircraftsNo].pos = [270, 580, floor(random(30, 60)), 7000];
			if (egllSpawn2.length > 0) {
				aircrafts[aircraftsNo].pos[3] = egllSpawn2[1] + 1000;
				aircrafts[aircraftsNo].ias = egllSpawn2[2] - 20;
				aircrafts[aircraftsNo].clearedIas = aircrafts[aircraftsNo].ias;
			}
			egllSpawn2 = [3000, aircrafts[aircraftsNo].pos[3], aircrafts[aircraftsNo].clearedIas];
		} else if (selectEntryPos == 2) {
			aircrafts[aircraftsNo].pos = [1280, 20, floor(random(210, 240)), 7000];
			if (egllSpawn3.length > 0) {
				aircrafts[aircraftsNo].pos[3] = egllSpawn3[1] + 1000;
				aircrafts[aircraftsNo].ias = egllSpawn3[2] - 20;
				aircrafts[aircraftsNo].clearedIas = aircrafts[aircraftsNo].ias;
			}
			egllSpawn3 = [3000, aircrafts[aircraftsNo].pos[3], aircrafts[aircraftsNo].clearedIas];
		} else {
			aircrafts[aircraftsNo].pos = [1280, 580, floor(random(300, 330)), 7000];
			if (egllSpawn4.length > 0) {
				aircrafts[aircraftsNo].pos[3] = egllSpawn4[1] + 1000;
				aircrafts[aircraftsNo].ias = egllSpawn4[2] - 20;
				aircrafts[aircraftsNo].clearedIas = aircrafts[aircraftsNo].ias;
			}
			egllSpawn4 = [3000, aircrafts[aircraftsNo].pos[3], aircrafts[aircraftsNo].clearedIas];
		}
	}
	
	aircrafts[aircraftsNo].radarPos = aircrafts[aircraftsNo].pos;
	
	//Initialise cleared position array
	aircrafts[aircraftsNo].clearedPos = [];
	aircrafts[aircraftsNo].clearedPos[0] = aircrafts[aircraftsNo].pos[2];
	aircrafts[aircraftsNo].clearedPos[1] = aircrafts[aircraftsNo].pos[3];
	aircrafts[aircraftsNo].leftChangeHdg = 0;
	
	//Initialise pilot response delay storage
	aircrafts[aircraftsNo].delayClearedHdg = [];
	aircrafts[aircraftsNo].delayClearedAlt = [];
	aircrafts[aircraftsNo].delayClearedIas = [];
	aircrafts[aircraftsNo].delaySelectedChangeHdg = [];
	aircrafts[aircraftsNo].delayTiming = [];
	aircrafts[aircraftsNo].delayLength = 0;
	
	//Calculate aircraft degrees (typically used in math)
	aircrafts[aircraftsNo].degrees = 450 - aircrafts[aircraftsNo].pos[2];
	
	//Calculate initial TAS
	aircrafts[aircraftsNo].tas = aircrafts[aircraftsNo].ias * (1 + aircrafts[aircraftsNo].pos[3] / 1000 * 0.02);
	aircrafts[aircraftsNo].radarTas = aircrafts[aircraftsNo].tas;
	
	//Calculate rate of change of x, y, altitude, heading, speed
	aircrafts[aircraftsNo].xChng = aircrafts[aircraftsNo].tas * cos(radians(aircrafts[aircraftsNo].degrees)) * nm_to_px / 180000;
	aircrafts[aircraftsNo].radarXChng = aircrafts[aircraftsNo].xChng;
	aircrafts[aircraftsNo].yChng = aircrafts[aircraftsNo].tas * sin(radians(aircrafts[aircraftsNo].degrees)) * nm_to_px / 180000;
	aircrafts[aircraftsNo].radarYChng = aircrafts[aircraftsNo].yChng;
	aircrafts[aircraftsNo].altChng = 0;
	aircrafts[aircraftsNo].radarAltChng = 0;
	aircrafts[aircraftsNo].hdgChng = 0;
	aircrafts[aircraftsNo].iasChng = 0;
	aircrafts[aircraftsNo].dragFactor = 1;
	aircrafts[aircraftsNo].finalAppSpd = floor(random(137, 160));
	
	//Set ILS properties
	aircrafts[aircraftsNo].ils = activeRunways;
	aircrafts[aircraftsNo].ilsIndex = 0;
	aircrafts[aircraftsNo].loc = false;
	aircrafts[aircraftsNo].gs = false;
	aircrafts[aircraftsNo].gsAlt = 0;
	aircrafts[aircraftsNo].ilsOffsetX = 0;
	aircrafts[aircraftsNo].ilsOffsetY = 0;
	aircrafts[aircraftsNo].ilsDist = 0;
	aircrafts[aircraftsNo].ilsHeading = 0;
	aircrafts[aircraftsNo].ilsY = 0;
	aircrafts[aircraftsNo].ilsArray = false;
	aircrafts[aircraftsNo].wakeTimer = 0;
	aircrafts[aircraftsNo].goAroundTimer = 0;
	aircrafts[aircraftsNo].goAroundState = false;
	
	//Set pilot messages
	aircrafts[aircraftsNo].msgArray = [false, false, false, false, false, false, false];
	
	//Set selected or not
	aircrafts[aircraftsNo].selected = false;
	
	//Set being controlled by you or not
	aircrafts[aircraftsNo].control = false;
	aircrafts[aircraftsNo].uncontrolTimer = 0;
	aircrafts[aircraftsNo].manualHo = false;
	
	//Set whether landed or not
	aircrafts[aircraftsNo].landed = false;
	
	//Aircraft status message
	aircrafts[aircraftsNo].statusMsg = "";
	
	//Aircraft collision
	aircrafts[aircraftsNo].collided = false;
	aircrafts[aircraftsNo].collidedHdgChng = 0;
	aircrafts[aircraftsNo].collidedAltChng = 0;
}

void draw() {
	timeElapsed++;
	trailTime++;
	updateTime++;
	background(255, 255, 255);

	if (!loaded && typeof(Storage) !== "undefined") {
		if (escape(encodeURIComponent(JSON.stringify(localStorage))).length > 100) {
			loadAircraft();
		}
		loaded = true;
	}
	
	//Radar screen
	noStroke();
	fill(0, 0, 0);
	rect(250, 0, 1050, 600);
	
	//Controller range
	stroke(200, 200, 200);
	noFill();
	rect(300, 50, 950, 500);
	noStroke();
	
	//Runways
	fill(0, 50, 255);
	if (airportChosen == "EGLL") {
		if (activeRunways[1] == "09L" || activeRunways[1] == "27R") {
			rect(700, 279.5, 12802 / px_to_ft, 3); //Rwy 09L/27R is 12802 feet long
		}
		if (activeRunways.length > 2) {
			rect(700.84, 286.5, 12008 / px_to_ft, 3); //Rwy 09R/27L is 12008 feet long
		}
	}
	
	//Active runways
	if (!runwayChosen) {
		if (airportChosen == "EGLL") {
			if (floor(random(2)) == 0) {
				activeRunways = ["-----", "09L"];
			} else {
				activeRunways = ["-----", "27R"];
			}
		}
		runwayChosen = true;
	}
	
	if (airportChosen == "EGLL") {
		if (score >= 12.0) {
			if (activeRunways.length == 2) {
				runwayChangeSound.play();
			}
			if (activeRunways[1] == "09L") {
				activeRunways[2] = "09R";
			} else {
				activeRunways[2] = "27L";
			}
		}
	}
	
	//Active runway ILS lines
	stroke(0, 0, 255);
	textSize(6);
	if (activeRunways[1] == "09L") {
		line(700, 281, 700 - 22 * nm_to_px, 281);
		text("09L", 698, 278);
		for (var i = 2; i <= 5; i++) {
			ellipse(700 - (i * 1000 - egllElevation) / tan(radians(3)) / px_to_ft, 281, 3, 3);
		}
	} else if (activeRunways[1] == "27R") {
		line(700 + 12802 / px_to_ft, 281, 700.84 + 12802 / px_to_ft + 22 * nm_to_px, 281);
		text("27R", 726.51, 278);
		for (var i = 2; i <= 5; i++) {
			ellipse(700 + 12802 / px_to_ft + (i * 1000 - egllElevation) / tan(radians(3)) / px_to_ft, 281, 3, 3);
		}
	}
	if (activeRunways.length > 2) {
		if (activeRunways[2] == "09R") {
			line(700.84, 288, 700.84 - 22 * nm_to_px, 288);
			text("09R", 696.84, 295.5);
			for (var i = 2; i <= 5; i++) {
				ellipse(700.84 - (i * 1000 - egllElevation) / tan(radians(3)) / px_to_ft, 288, 3, 3);
			}
		} else if (activeRunways[2] == "27L") {
			line(700.84 + 12008 / px_to_ft, 288, 700.84 + 12008 / px_to_ft + 22 * nm_to_px, 288);
			text("27L", 726.14, 295.5);
			for (var i = 2; i <= 5; i++) {
				ellipse(700.84 + 12008 / px_to_ft + (i * 1000 - egllElevation) / tan(radians(3)) / px_to_ft, 288, 3, 3);
			}
		}
	}
	noStroke();
	
	//Reset data button
	fill(0, 150, 0);
	rect(0, 525, 100, 50);
	rect(110, 525, 100, 50);
	fill(255, 255, 255);
	textSize(20);
	text("PAUSE", 127, 557);
	text("RESET", 17, 557);
	textSize(12);
	fill(0, 0, 0);
	
	//Update array lengths
	aircraftsNo = aircrafts.length;
	selectedAircraftsNo = selectedAircrafts.length;
	
	//Debug
	/*
	text("Length of array: " + aircraftsNo, 140, 580); //Confirm aircraft number
	for (var i = 0; i < selectedAircraftsNo; i++) {
		text(selectedAircrafts[i], 140, 535 - 15 * i); //Confirm selected aircrafts
	}
	for (var i = 0; i < egllRwy09Lx27R.length; i++) {
		text(egllRwy09Lx27R.length, 10, 285);
		text(i + " " + egllRwy09Lx27R[i], 10, 300 + i * 15);
		text(aircrafts[egllRwy09Lx27R[i]].flightNo, 60, 300 + i * 15);
	}
	for (var i = 0; i < egllRwy09Rx27L.length; i++) {
		text(egllRwy09Rx27L.length, 110, 285);
		text(i + " " + egllRwy09Rx27L[i], 110, 300 + i * 15);
		text(aircrafts[egllRwy09Rx27L[i]].flightNo, 160, 300 + i * 15);
	}
	text(updateTime, 10, 420);
	//text(aircrafts[1].leftChangeHdg, 10, 360);
	//text(aircrafts[1].ilsArray, 10, 375);
	for (var i = 0; i < aircraftsNo; i++) {
		//text(aircrafts[i].loc, 10, 535);
		//text(aircrafts[i].gs, 10, 550);
		//text(aircrafts[i].decreaseSpd[3], 90, 535 - 15 * i);
	}
	
	//text(timeElapsed, 140, 595);
	*/
	//Spawn point array
	if (airportChosen == "EGLL") {
		if (egllSpawn1.length > 0) {
			if (egllSpawn1[0] > 0) {
				egllSpawn1[0]--;
			} else {
				egllSpawn1 = [];
			}
		}
		if (egllSpawn2.length > 0) {
			if (egllSpawn2[0] > 0) {
				egllSpawn2[0]--;
			} else {
				egllSpawn2 = [];
			}
		}
		if (egllSpawn3.length > 0) {
			if (egllSpawn3[0] > 0) {
				egllSpawn3[0]--;
			} else {
				egllSpawn3 = [];
			}
		}
		if (egllSpawn4.length > 0) {
			if (egllSpawn4[0] > 0) {
				egllSpawn4[0]--;
			} else {
				egllSpawn4 = [];
			}
		}
	}
	
	//Create aircrafts
	while (aircraftsNo < round(score)) {
		createAircraft();
		aircraftsNo = aircrafts.length;
	}

	//Update position, speed information every 1 second
	if (updateTime >= 50) {
		updateTime -= 50;
		for (var i = 0; i < aircraftsNo; i++) {
			//text("Updated!", 140, 565);
			aircrafts[i].radarPos[0] = aircrafts[i].pos[0];
			aircrafts[i].radarPos[1] = aircrafts[i].pos[1];
			aircrafts[i].radarPos[2] = aircrafts[i].pos[2];
			aircrafts[i].radarPos[3] = aircrafts[i].pos[3];
			aircrafts[i].radarAltChng = aircrafts[i].altChng;
			aircrafts[i].radarXChng = aircrafts[i].xChng;
			aircrafts[i].radarYChng = aircrafts[i].yChng;
			aircrafts[i].radarTas = aircrafts[i].tas;
		}
		if (typeof(Storage) !== "undefined") {
			saveAircraft();
		}
	}
	
	//Add new trail dot every 10 seconds
	if (trailTime >= 500) {
		trailTime -= 500;
		for (var i = 0; i < aircraftsNo; i++) {
			text("Dot created!", 140, 550);
			aircrafts[i].trailX[aircrafts[i].trailLength] = aircrafts[i].pos[0];
			aircrafts[i].trailY[aircrafts[i].trailLength] = aircrafts[i].pos[1];
		}
	}
	
	for (var i = 0; i < aircraftsNo; i++) {
		//Update aircraft index in array
		aircrafts[i].number = i;
		
		//Uncontrol aircraft if out of range
		if (aircrafts[i].pos[0] >= 300 && aircrafts[i].pos[0] <= 1250 && aircrafts[i].pos[1] >= 50 && aircrafts[i].pos[1] <= 550 && aircrafts[i].pos[3] > 1200) {
			if (aircrafts[i].msgArray[1] && !aircrafts[i].manualHo) {
				aircrafts[i].msgArray[1] = false;
				if (aircrafts[i].uncontrolTimer <= 250) {
					for (var j = 0; j < pilotSpeech.length; j++) {
						if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", bye. ") != -1) {
							pilotSpeech.splice(j, 1);
							j--;
						}
					}
				}
				aircrafts[i].uncontrolTimer = 0;
			}
			if (!aircrafts[i].msgArray[0] && !aircrafts[i].manualHo) {
				var randomText = floor(random(4));
				if (randomText == 0) {
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + " with you. "
				} else if (randomText == 1) {
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + " with you, speed " + round(aircrafts[i].ias) + " knots. ";
				} else {
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + " with you at " + floor(aircrafts[i].pos[3] / 100) * 100 + " feet. ";
				}
				aircrafts[i].msgArray[0] = true;
			}
			if (!aircrafts[i].manualHo) {
				aircrafts[i].control = true;
			}
		} else {
			if (aircrafts[i].control) {
				aircrafts[i].selected = false;
				if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
					selectedChanged = false;
					imported = false;
				}
				for (var j = 0; j < selectedAircraftsNo; j++) {
					if (aircrafts[i].number == selectedAircrafts[j]) {
						selectedAircrafts.splice(j, 1);
						aircrafts[i].selected = false;
					}
				}
				selectedAircraftsNo = selectedAircrafts.length;
			}
			aircrafts[i].control = false;
		}
		
		//Remove if out of radar boundry
		if (!aircrafts[i].control && (aircrafts[i].pos[0] < 250 || aircrafts[i].pos[0] > 1300 || aircrafts[i].pos[1] < 0 || aircrafts[i].pos[1] > 600)) {
			aircrafts[i].selected = false;
			aircrafts.splice(i, 1);
			for (var j = 0; j < selectedAircraftsNo; j++) {
				if (selectedAircrafts[j] > i) {
					selectedAircrafts[j]--;
				}
			}
			i--;
			aircraftsNo = aircrafts.length;
			continue;		
		}
		
		//Remove if landed and below 30 knots
		if (aircrafts[i].loc && aircrafts[i].gs && aircrafts[i].pos[3] <= (egllElevation + 20)) {
			aircrafts[i].landed = true;
			if (aircrafts[i].tas <= 30) {
				aircrafts[i].selected = false;
				for (var j = 0; j < egllRwy09Lx27R.length; j++) {
					if (egllRwy09Lx27R[j] > i) {
						egllRwy09Lx27R[j]--;
					} else if (egllRwy09Lx27R[j] == i) {
						egllRwy09Lx27R.splice(j, 1);
						j--;
					}
				}
				for (var j = 0; j < egllRwy09Rx27L.length; j++) {
					if (egllRwy09Rx27L[j] > i) {
						egllRwy09Rx27L[j]--;
					} else if (egllRwy09Rx27L[j] == i) {
						egllRwy09Rx27L.splice(j, 1);
						j--;
					}
				}
				aircrafts.splice(i, 1);
				for (var j = 0; j < selectedAircraftsNo; j++) {
					if (selectedAircrafts[j] > i) {
						selectedAircrafts[j]--;
					}
				}
				i--;
				aircraftsNo = aircrafts.length;
				continue;
			}
		}
		
		//Update cleared position after 2 seconds pilot delay
		for (var j = 0; j < aircrafts[i].delayLength; j++) {
			if (aircrafts[i].delayTiming[j] < 100) {
				aircrafts[i].delayTiming[j]++;
			} else {
				aircrafts[i].clearedPos[0] = aircrafts[i].delayClearedHdg[j];
				aircrafts[i].clearedPos[1] = aircrafts[i].delayClearedAlt[j];
				aircrafts[i].clearedIas = aircrafts[i].delayClearedIas[j];
				aircrafts[i].leftChangeHdg += aircrafts[i].delaySelectedChangeHdg[j];
				aircrafts[i].delayTiming.splice(j, 1);
				aircrafts[i].delayClearedHdg.splice(j, 1);
				aircrafts[i].delayClearedAlt.splice(j, 1);
				aircrafts[i].delayClearedIas.splice(j, 1);
				aircrafts[i].delaySelectedChangeHdg.splice(j, 1);
				j--;
				aircrafts[i].delayLength--;
			}
		}
		
		//Instrument landing system
		if (aircrafts[i].ilsIndex > 0) {
			var rwyPosX;
			var rwyPosY;
			if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09L") {
				aircrafts[i].ilsOffsetX = aircrafts[i].pos[0] - egllIlsRwy09L[0];
				aircrafts[i].ilsOffsetY = aircrafts[i].pos[1] - egllIlsRwy09L[1];
				rwyPosX = egllIlsRwy09L[0];
				rwyPosY = egllIlsRwy09L[1];
				aircrafts[i].ilsHeading = egllIlsRwy09L[2];
				aircrafts[i].ilsY = egllIlsRwy09L[1];
				//Cleared ILS 09L
				aircrafts[i].ilsDist = sqrt(sq(aircrafts[i].ilsOffsetX) + sq(aircrafts[i].ilsOffsetY));
				removeRunwayArray(i, egllRwy09Rx27L);
				updateRunwayArray(i, egllRwy09Lx27R);
				drawWake(i, egllIlsRwy09L[0], egllIlsRwy09L[1]);
			} else if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R") {
				aircrafts[i].ilsOffsetX = aircrafts[i].pos[0] - egllIlsRwy09R[0];
				aircrafts[i].ilsOffsetY = aircrafts[i].pos[1] - egllIlsRwy09R[1];
				rwyPosX = egllIlsRwy09R[0];
				rwyPosY = egllIlsRwy09R[1];
				aircrafts[i].ilsHeading = egllIlsRwy09R[2];
				aircrafts[i].ilsY = egllIlsRwy09R[1];
				//Cleared ILS 09R
				aircrafts[i].ilsDist = sqrt(sq(aircrafts[i].ilsOffsetX) + sq(aircrafts[i].ilsOffsetY));
				removeRunwayArray(i, egllRwy09Lx27R);
				updateRunwayArray(i, egllRwy09Rx27L);
				drawWake(i, egllIlsRwy09R[0], egllIlsRwy09R[1]);
			} else if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
				aircrafts[i].ilsOffsetX = aircrafts[i].pos[0] - egllIlsRwy27L[0];
				aircrafts[i].ilsOffsetY = aircrafts[i].pos[1] - egllIlsRwy27L[1];
				rwyPosX = egllIlsRwy27L[0];
				rwyPosY = egllIlsRwy27L[1];
				aircrafts[i].ilsHeading = egllIlsRwy27L[2];
				aircrafts[i].ilsY = egllIlsRwy27L[1];
				//Cleared ILS 27L
				aircrafts[i].ilsDist = sqrt(sq(aircrafts[i].ilsOffsetX) + sq(aircrafts[i].ilsOffsetY));
				removeRunwayArray(i, egllRwy09Lx27R);
				updateRunwayArray(i, egllRwy09Rx27L);
				drawWake(i, egllIlsRwy27L[0], egllIlsRwy27L[1]);
			} else if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "27R") {
				aircrafts[i].ilsOffsetX = aircrafts[i].pos[0] - egllIlsRwy27R[0];
				aircrafts[i].ilsOffsetY = aircrafts[i].pos[1] - egllIlsRwy27R[1];
				rwyPosX = egllIlsRwy27R[0];
				rwyPosY = egllIlsRwy27R[1];
				aircrafts[i].ilsHeading = egllIlsRwy27R[2];
				aircrafts[i].ilsY = egllIlsRwy27R[1];
				//Cleared ILS 27R
				aircrafts[i].ilsDist = sqrt(sq(aircrafts[i].ilsOffsetX) + sq(aircrafts[i].ilsOffsetY));
				removeRunwayArray(i, egllRwy09Rx27L);
				updateRunwayArray(i, egllRwy09Lx27R);
				drawWake(i, egllIlsRwy27R[0], egllIlsRwy27R[1]);
			}
			var initAngle;
			if (aircrafts[i].ilsOffsetX > 0) {
				initAngle = 270;
			} else if (aircrafts[i].ilsOffsetX < 0) {
				initAngle = 450;
			}
			if (aircrafts[i].ilsOffsetX != 0) {
				var angleToRwy = initAngle - degrees(atan(-aircrafts[i].ilsOffsetY/aircrafts[i].ilsOffsetX));
			} else {
				if (aircrafts[i].ilsOffsetY > 0) {
					angleToRwy = 360;
				} else {
					angleToRwy = 180;
				}
			}
			if (angleToRwy > 360) {
				angleToRwy -= 360;
			} else if (angleToRwy <= 0) {
				angleToRwy += 360;
			}
			var capturePointX = rwyPosX + (aircrafts[i].ilsDist - 1 * nm_to_px) * cos(radians(270 - aircrafts[i].ilsHeading));
			var capturePointY = rwyPosY + (aircrafts[i].ilsDist - 1 * nm_to_px) * sin(radians(270 - aircrafts[i].ilsHeading));
			var angleToCapture = initAngle - degrees(atan(-(aircrafts[i].pos[1] - capturePointY)/(aircrafts[i].pos[0] - capturePointX)));
			if (angleToCapture > 360) {
				angleToCapture -= 360;
			} else if (angleToCapture <= 0) {
				angleToCapture += 360;
			}
			var crsAngleDiff = angleToRwy - aircrafts[i].ilsHeading;
			if (crsAngleDiff > 180) {
				crsAngleDiff -= 360;
			} else if (crsAngleDiff <= -180) {
				crsAngleDiff += 360;
			}
			var apprAngleDiff = aircrafts[i].pos[2] - aircrafts[i].ilsHeading;
			if (apprAngleDiff > 180) {
				apprAngleDiff -= 360;
			} else if (apprAngleDiff <= -180) {
				apprAngleDiff += 360;
			}
			aircrafts[i].msgArray[5] = false;
			if (!aircrafts[i].msgArray[4] && abs(apprAngleDiff) > 60 && abs(crsAngleDiff) <= 7.5 && !aircrafts[i].loc && aircrafts[i].ilsDist <= 25 * nm_to_px) {
				pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", our intercept angle for runway " + aircrafts[i].ils[aircrafts[i].ilsIndex] + " will be very large. ";
				aircrafts[i].msgArray[4] = true;
			} else if (aircrafts[i].msgArray[4] && (abs(apprAngleDiff) <= 60 || abs(crsAngleDiff) > 7.5 || aircrafts[i].loc)) {
				for (var j = 0; j < pilotSpeech.length; j++) {
					if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", our intercept angle for runway ") != -1) {
						pilotSpeech.splice(j, 1);
					}
				}
				aircrafts[i].msgArray[4] = false;
			}
			
			//Localiser
			if (abs(crsAngleDiff) <= 5 && aircrafts[i].ilsDist <= 22 * nm_to_px && (abs(apprAngleDiff) > 2 || abs(aircrafts[i].hdgChng) > 0.005)) {
				aircrafts[i].clearedPos[0] = angleToCapture;
				if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
					selectedHdg = angleToCapture;
				}
				aircrafts[i].leftChangeHdg = aircrafts[i].clearedPos[0] - aircrafts[i].pos[2];
				if (aircrafts[i].leftChangeHdg > 180) {
					aircrafts[i].leftChangeHdg -= 360;
				} else if (aircrafts[i].leftChangeHdg <= -180) {
					aircrafts[i].leftChangeHdg += 360;
				}
				aircrafts[i].loc = true;
			} else if (abs(crsAngleDiff) < 0.5 && abs(aircrafts[i].hdgChng) <= 0.005 && aircrafts[i].ilsDist <= 22 * nm_to_px && abs(apprAngleDiff) <= 2) {
				aircrafts[i].pos[2] = aircrafts[i].ilsHeading;
				aircrafts[i].clearedPos[0] = aircrafts[i].ilsHeading;
				aircrafts[i].hdgChng = 0;
				aircrafts[i].leftChangeHdg = 0;
				aircrafts[i].pos[0] = rwyPosX + aircrafts[i].ilsDist * cos(radians(270 - aircrafts[i].ilsHeading));
				aircrafts[i].pos[1] = rwyPosY + aircrafts[i].ilsDist * sin(radians(270 - aircrafts[i].ilsHeading));
				aircrafts[i].loc = true;
			} else if (aircrafts[i].landed) {
				aircrafts[i].pos[2] = aircrafts[i].ilsHeading;
				aircrafts[i].clearedPos[0] = aircrafts[i].ilsHeading;
			} else {
				if (aircrafts[i].pos[3] < 1010 && aircrafts[i].gs && !aircrafts[i].loc) {
					aircrafts[i].ilsIndex = 0;
					if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
						selectedIlsIndex = aircrafts[i].ilsIndex;
					}
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're doing a missed approach as we're not established. ";
				}
				if (aircrafts[i].loc) {
					aircrafts[i].leftChangeHdg = aircrafts[i].clearedPos[0] - aircrafts[i].pos[2];
				}
				aircrafts[i].loc = false;
			}
			
			//Glide slope
			if (aircrafts[i].ilsIndex != 0 && !aircrafts[i].landed) {
				aircrafts[i].gsAlt = egllElevation + aircrafts[i].ilsDist * tan(radians(3)) * px_to_ft;
				if (!aircrafts[i].msgArray[2] && aircrafts[i].gsAlt < (aircrafts[i].pos[3] - 20)) {
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're above the glideslope of runway " + aircrafts[i].ils[aircrafts[i].ilsIndex] + ". ";
					aircrafts[i].msgArray[2] = true;
				} else if (aircrafts[i].msgArray[2] && aircrafts[i].gsAlt >= (aircrafts[i].pos[3] - 20)) {
					for (var j = 0; j < pilotSpeech.length; j++) {
						if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", we're above the glideslope of runway ") != -1) {
							pilotSpeech.splice(j, 1);
						}
					}
					aircrafts[i].msgArray[2] = false;
				}
				if (aircrafts[i].loc && aircrafts[i].gsAlt <= (aircrafts[i].pos[3] + 20) && aircrafts[i].gsAlt >= (aircrafts[i].pos[3] - 20)) {
					aircrafts[i].clearedPos[1] = 2000;
					if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
						selectedAlt = 2000;
					}
					aircrafts[i].pos[3] = aircrafts[i].gsAlt;
					aircrafts[i].gs = true;
				} else if (aircrafts[i].gs && !aircrafts[i].loc && aircrafts[i].gsAlt <= (aircrafts[i].pos[3] + 20) && aircrafts[i].gsAlt >= (aircrafts[i].pos[3] - 20)) {
					aircrafts[i].clearedPos[1] = 2000;
					if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
						selectedAlt = 2000;
					}
					aircrafts[i].pos[3] = aircrafts[i].gsAlt;
					aircrafts[i].gs = true;
				}
			} else if (aircrafts[i].landed) {
				aircrafts[i].pos[3] = egllElevation;
			}
		} else {
			aircrafts[i].msgArray[4] = false;
			if (!aircrafts[i].goAroundState) {
				if (airportChosen == "EGLL") {
					if (!aircrafts[i].msgArray[5] && (((aircrafts[i].pos[1] - 281) / aircrafts[i].yChng < 300 && (aircrafts[i].pos[1] - 281) / aircrafts[i].yChng > 50) || ((aircrafts[i].pos[1] - 288) / aircrafts[i].yChng < 300 && (aircrafts[i].pos[1] - 288) / aircrafts[i].yChng > 50))) {
						if (activeRunways[1] == "09L" && aircrafts[i].pos[0] < 700 && aircrafts[i].pos[0] > 700 - 22 * nm_to_px) {
							if (activeRunways.length == 2) {
								pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we are crossing the localiser of runway 09L. ";
							} else if (activeRunways.length == 3) {
								pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we are crossing the localiser of runways 09L and 09R. ";
							}
							aircrafts[i].msgArray[5] = true;
						} else if (activeRunways[1] == "27R" && aircrafts[i].pos[0] < 700 + 24.1 * nm_to_px && aircrafts[i].pos[0] > 700 + 2.1 * nm_to_px) {
							if (activeRunways.length == 2) {
								pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we are crossing the localiser of runway 27L. ";
							} else if (activeRunways.length == 3) {
								pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we are crossing the localiser of runways 27L and 27R. ";
							}
							aircrafts[i].msgArray[5] = true;
						}
					} else if (aircrafts[i].msgArray[5] && !(((aircrafts[i].pos[1] - 281) / aircrafts[i].yChng < 300 && (aircrafts[i].pos[1] - 281) / aircrafts[i].yChng > 50) || ((aircrafts[i].pos[1] - 288) / aircrafts[i].yChng < 300 && (aircrafts[i].pos[1] - 288) / aircrafts[i].yChng > 50))) {
						for (var j = 0; j < pilotSpeech.length; j++) {
							if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", we are crossing the localiser of runways") != -1) {
								pilotSpeech.splice(j, 1);
							}
						}
						aircrafts[i].msgArray[5] = false;
					}
				}
			}
			if (aircrafts[i].loc) {
				aircrafts[i].clearedPos[0] = aircrafts[i].ilsHeading;
				aircrafts[i].clearedIas = 200;
				aircrafts[i].decreaseSpd[1] = false;
				aircrafts[i].decreaseSpd[2] = false;
				aircrafts[i].goAroundState = true;
				aircrafts[i].goAroundTimer++;
				aircrafts[i].manualHo = false;
				if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
					selectedHdg = aircrafts[i].clearedPos[0];
					selectedIlsIndex = aircrafts[i].ilsIndex;
					selectedSpd = aircrafts[i].clearedIas;
				}
				aircrafts[i].leftChangeHdg = aircrafts[i].clearedPos[0] - aircrafts[i].pos[2];
				console.log(i + " did a missed approach!");
			}
			aircrafts[i].loc = false;
			aircrafts[i].gs = false;
		}
		if (aircrafts[i].loc) {
			aircrafts[i].goAroundState = true;
		}
		
		if (aircrafts[i].goAroundState && aircrafts[i].goAroundTimer < 2250 && aircrafts[i].goAroundTimer > 0) {
			aircrafts[i].goAroundTimer++;
		} else {
			aircrafts[i].goAroundTimer = 0;
			aircrafts[i].goAroundState = false;
		}
		
		//Wake turbulence missed approach timer
		aircrafts[i].wakeStatus = false;
		if (aircrafts[i].loc) {
			if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09L" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27R") {
				wakeTurbTimer(i, egllRwy09Lx27R);
			} else if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
				wakeTurbTimer(i, egllRwy09Rx27L);
			}
		}
		
		if (!aircrafts[i].msgArray[3] && aircrafts[i].wakeStatus) {
			pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're experiencing wake turbulence. ";
			aircrafts[i].msgArray[3] = true;
		} else if (aircrafts[i].msgArray[3] && !aircrafts[i].wakeStatus) {
			for (var j = 0; j < pilotSpeech.length; j++) {
				if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", we're experiencing wake turbulence. ") != -1) {
					pilotSpeech.splice(j, 1);
					j--
				}
			}
			aircrafts[i].msgArray[3] = false;
		}
		
		aircrafts[i].wakeTimer -= 0.5;
		
		if (aircrafts[i].wakeTimer > 1000) {
			aircrafts[i].ilsIndex = 0;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedIlsIndex = aircrafts[i].ilsIndex;
			}
			console.log(i + " reached wake limits!");
			pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're doing a missed approach as we're encountering wake turbulence. ";
		} else if (aircrafts[i].wakeTimer < 0) {
			aircrafts[i].wakeTimer = 0;
		}
		
		//Missed approach
		if (aircrafts[i].loc && aircrafts[i].ilsDist < (4 * nm_to_px) && (!aircrafts[i].gs || aircrafts[i].ias > 180)) {
			aircrafts[i].ilsIndex = 0;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedIlsIndex = aircrafts[i].ilsIndex;
			}
			console.log(i + " did a missed approach! (too high/too fast)");
			if (!aircrafts[i].gs) {
				pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're doing a missed approach as we're too high. ";
			} else if (aircrafts[i].ias > 180) {
				pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're doing a missed approach as we're too fast. ";
			}
		}
		
		//Go around
		if (aircrafts[i].loc && aircrafts[i].gs && aircrafts[i].pos[3] < 200 + egllElevation) {
			if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09L" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27R") {
				if (egllRwy09Lx27R[0] != i) {
					aircrafts[i].ilsIndex = 0;
					if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
						selectedIlsIndex = aircrafts[i].ilsIndex;
					}
					console.log(i + " did a go around! (traffic on runway)");
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + " is going around as there is traffic on runway. ";
				}
			} else if (aircrafts[i].ils[aircrafts[i].ilsIndex] == "09R" || aircrafts[i].ils[aircrafts[i].ilsIndex] == "27L") {
				if (egllRwy09Rx27L[0] != i) {
					aircrafts[i].ilsIndex = 0;
					if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
						selectedIlsIndex = aircrafts[i].ilsIndex;
					}
					console.log(i + " did a go around! (traffic on runway)");
					pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + " is going around as there is traffic on runway. ";
				}
			}
		}
		
		if (aircrafts[i].gs) {
			aircrafts[i].altChng = 0;
		}
		
		if (!aircrafts[i].loc && aircrafts[i].msgArray[2]) {
			for (var j = 0; j < pilotSpeech.length; j++) {
				if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", we're above the glideslope of runway ") != -1) {
					pilotSpeech.splice(j, 1);
					j--;
				}
			}
			aircrafts[i].msgArray[2] = false;
		}
		
		if (aircrafts[i].ilsArray && (!aircrafts[i].loc || aircrafts[i].ilsIndex == 0)) {
			for (var j = 0; j < egllRwy09Lx27R.length; j++) {
				if (egllRwy09Lx27R[j] == i) {
					aircrafts[i].ilsArray = false;
					egllRwy09Lx27R.splice(j, 1);
					break;
				}
			}
			for (var j = 0; j < egllRwy09Rx27L.length; j++) {
				if (egllRwy09Rx27L[j] == i) {
					aircrafts[i].ilsArray = false;
					egllRwy09Rx27L.splice(j, 1);
					break;
				}
			}
		}
		
		//Update heading change variable
		if (abs(aircrafts[i].leftChangeHdg) > 0.1 || abs(aircrafts[i].hdgChng >= 0.015)) {
			if (aircrafts[i].leftChangeHdg < 0) {
				aircrafts[i].hdgChng -= 0.0002;
				if (aircrafts[i].hdgChng < aircrafts[i].leftChangeHdg / 200) {
					aircrafts[i].hdgChng = aircrafts[i].leftChangeHdg / 200;
				}
				if (aircrafts[i].hdgChng <= - 3 / 50) {
					aircrafts[i].hdgChng = - 3 / 50;
				}
			} else {
				aircrafts[i].hdgChng += 0.0002;
				if (aircrafts[i].hdgChng > aircrafts[i].leftChangeHdg / 200) {
					aircrafts[i].hdgChng = aircrafts[i].leftChangeHdg / 200;
				}
				if (aircrafts[i].hdgChng >= 3 / 50) {
					aircrafts[i].hdgChng = 3 / 50;
				}
			}
		} else {
			if (!aircrafts[i].loc) {
				aircrafts[i].hdgChng = 0;
				aircrafts[i].pos[2] = aircrafts[i].clearedPos[0];
				aircrafts[i].leftChangeHdg = 0;
			}
		}
		
		//Update altitude change variable
		if (!aircrafts[i].gs) {
			if (abs(aircrafts[i].clearedPos[1] - aircrafts[i].pos[3]) > 10 || abs(aircrafts[i].altChng) > 0.03) {
				if (aircrafts[i].clearedPos[1] < aircrafts[i].pos[3]) {
					aircrafts[i].altChng -= 0.5 / 150;
					if (aircrafts[i].altChng < (aircrafts[i].clearedPos[1] - aircrafts[i].pos[3]) / 200) {
						aircrafts[i].altChng = (aircrafts[i].clearedPos[1] - aircrafts[i].pos[3]) / 200;
					}
					if (aircrafts[i].altChng <= -0.5) {
						aircrafts[i].altChng = -0.5;
					}
				} else {
					aircrafts[i].altChng += 0.7 / 150;
					if (aircrafts[i].altChng > (aircrafts[i].clearedPos[1] - aircrafts[i].pos[3]) / 200) {
						aircrafts[i].altChng = (aircrafts[i].clearedPos[1] - aircrafts[i].pos[3]) / 200;
					}
					if (aircrafts[i].altChng >= 0.7) {
						aircrafts[i].altChng = 0.7;
					}
				}
			} else {
				aircrafts[i].altChng = 0;
				aircrafts[i].pos[3] = aircrafts[i].clearedPos[1];
			}
		}
		
		//Handover to tower
		if (aircrafts[i].control && aircrafts[i].loc && aircrafts[i].gs && aircrafts[i].radarPos[3] <= 1200) {
			aircrafts[i].control = false;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedChanged = false;
				imported = false;
			}
			for (var j = 0; j < selectedAircraftsNo; j++) {
				if (aircrafts[i].number == selectedAircrafts[j]) {
					selectedAircrafts.splice(j, 1);
					aircrafts[i].selected = false;
				}
			}
			selectedAircraftsNo = selectedAircrafts.length;
			if (!aircrafts[i].manualHandover) {
				if (score <= 12) {
					score += 0.5;
				} else if (score <= 16) {
					score += 0.3;
				} else {
					score += 0.2;
				}
			}
		}
		
		//Uncontrol "bye"
		if (!aircrafts[i].control && !aircrafts[i].msgArray[1]) {
			aircrafts[i].msgArray[1] = true;
			aircrafts[i].uncontrolTimer = 0;
			for (var j = 0; j < pilotSpeech.length; j++) {
				if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo) != -1) {
					pilotSpeech.splice(j, 1);
					j--
				}
			}
			if (aircrafts[i].msgArray[0]) {
				for (var j = 0; j < pilotSpeech.length; j++) {
					if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + " with you") != -1) {
						pilotSpeech.splice(j, 1);
						j--;
					}
				}
				pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", bye. ";
				aircrafts[i].msgArray[0] = false;
			}
		}
		
		if (aircrafts[i].msgArray[1]) {
			if (aircrafts[i].uncontrolTimer > 250) {
				for (var j = 0; j < pilotSpeech.length; j++) {
					if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", bye. ") != -1) {
						pilotSpeech.splice(j, 1);
						j--;
					}
				}
			} else {
				aircrafts[i].uncontrolTimer++;
			}
		}
		
		//About to leave airspace alert
		var leaveAirspaceBool = false;
		if (aircrafts[i].control) {
			if ((300 - aircrafts[i].pos[0]) / aircrafts[i].xChng < 1000 && (300 - aircrafts[i].pos[0]) / aircrafts[i].xChng >= 0) {
				leaveAirspaceBool = true;
			} else if ((1250 - aircrafts[i].pos[0]) / aircrafts[i].xChng < 1000 && (1250 - aircrafts[i].pos[0]) / aircrafts[i].xChng >= 0) {
				leaveAirspaceBool = true;
			} else if ((50 - aircrafts[i].pos[1]) / aircrafts[i].yChng > -1000 && (50 - aircrafts[i].pos[1]) / aircrafts[i].yChng <= 0) {
				leaveAirspaceBool = true;
			} else if ((550 - aircrafts[i].pos[1]) / aircrafts[i].yChng > -1000 && (550 - aircrafts[i].pos[1]) / aircrafts[i].yChng <= 0) {
				leaveAirspaceBool = true;
			} else {
				leaveAirspaceBool = false;
			}
		} else {
			leaveAirspaceBool = false;
		}
		
		if (!aircrafts[i].msgArray[6] && leaveAirspaceBool) {
			pilotSpeech[pilotSpeech.length] = aircrafts[i].icao + aircrafts[i].flightNo + ", we're about to leave the airspace. ";
			aircrafts[i].msgArray[6] = true;
		} else if (!leaveAirspaceBool) {
			for (var j = 0; j < pilotSpeech.length; j++) {
				if (pilotSpeech[j].indexOf(aircrafts[i].icao + aircrafts[i].flightNo + ", we're about to leave the airspace. ") != -1) {
					pilotSpeech.splice(j, 1);
					j--;
				}
			}
			aircrafts[i].msgArray[6] = false;
		}
		
		//Update speed variable
		if (sqrt(sq(aircrafts[i].pos[0] - 716) + sq(aircrafts[i].pos[1] - 300)) <= 15 * nm_to_px && !aircrafts[i].decreaseSpd[0] && aircrafts[i].clearedIas >= 220) {
			aircrafts[i].clearedIas = 220;
			aircrafts[i].decreaseSpd[0] = true;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedSpd = aircrafts[i].clearedIas;
			}
		} 
		
		if (aircrafts[i].ilsDist <= 6 * nm_to_px && aircrafts[i].loc && !aircrafts[i].decreaseSpd[1] && aircrafts[i].clearedIas >= 160) {
			aircrafts[i].clearedIas = 160;
			aircrafts[i].decreaseSpd[1] = true;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedSpd = aircrafts[i].clearedIas;
			}
		}
		
		if (aircrafts[i].ilsDist <= 4 * nm_to_px && aircrafts[i].loc && !aircrafts[i].decreaseSpd[2] && aircrafts[i].clearedIas >= aircrafts[i].finalAppSpd) {
			aircrafts[i].clearedIas = aircrafts[i].finalAppSpd;
			aircrafts[i].decreaseSpd[2] = true;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedSpd = aircrafts[i].clearedIas;
			}
		}
		
		if (sqrt(sq(aircrafts[i].pos[0] - 716) + sq(aircrafts[i].pos[1] - 300)) > 15 * nm_to_px && aircrafts[i].decreaseSpd[0]) {
			aircrafts[i].decreaseSpd[0] = false;
		}
		
		if (!aircrafts[i].loc && selectedSpd < 160 && selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
			selectedSpd = 160;
		}
		
		if (aircrafts[i].loc && !aircrafts[i].decreaseSpd[3] && aircrafts[i].clearedIas >= 200) {
			aircrafts[i].clearedIas = 200;
			aircrafts[i].decreaseSpd[3] = true;
			if (selectedAircraftsNo == 1 && selectedAircrafts[0] == i) {
				selectedSpd = aircrafts[i].clearedIas;
			}
		} else if (aircrafts[i].loc && !aircrafts[i].decreaseSpd[3] && aircrafts[i].clearedIas < 200) {
			aircrafts[i].decreaseSpd[3] = true;
		} else if (!aircrafts[i].loc && aircrafts[i].decreaseSpd[3]) {
			aircrafts[i].decreaseSpd[3] = false;
		}
		
		if (aircrafts[i].ias > 210) {
			aircrafts[i].dragFactor = 1;
		} else if (aircrafts[i].ias > 190) {
			aircrafts[i].dragFactor = 1.1;
		} else if (aircrafts[i].ias > 170) {
			aircrafts[i].dragFactor = 1.4;
		} else {
			aircrafts[i].dragFactor = 1.8;
		}
		
		if (aircrafts[i].landed) {
			if (aircrafts[i].ias > 45) {
				aircrafts[i].dragFactor = 2.2;
			} else if (aircrafts[i].ias > 3) {
				aircrafts[i].dragFactor = 1.1;
			} else {
				aircrafts[i].dragFactor = 0;
				aircrafts[i].yChng = 0;
				aircrafts[i].xChng = 0;
				aircrafts[i].ias = 0;
				aircrafts[i].tas = 0;
			}
		}
		
		if (!aircrafts[i].loc && aircrafts[i].clearedIas < 160) {
			aircrafts[i].clearedIas = 160;
		}
		
		if (!aircrafts[i].landed) {
			if (abs(aircrafts[i].clearedIas - aircrafts[i].ias) > 0.5 || abs(aircrafts[i].iasChng) > 0.0075) {
				if (aircrafts[i].clearedIas < aircrafts[i].ias) {
					aircrafts[i].iasChng -= 0.0001;
					if (aircrafts[i].iasChng < (aircrafts[i].clearedIas - aircrafts[i].ias) / 200) {
						aircrafts[i].iasChng = (aircrafts[i].clearedIas - aircrafts[i].ias) / 200;
					}
					if (aircrafts[i].iasChng <= - aircrafts[i].dragFactor / 33) {
						aircrafts[i].iasChng = - aircrafts[i].dragFactor / 33;
					}
				} else {
					aircrafts[i].iasChng += 0.0001;
					if (aircrafts[i].iasChng > (aircrafts[i].clearedIas - aircrafts[i].ias) / 200) {
						aircrafts[i].iasChng = (aircrafts[i].clearedIas - aircrafts[i].ias) / 200;
					}
					if (aircrafts[i].iasChng >= (2 - aircrafts[i].dragFactor) / 33) {
						aircrafts[i].iasChng = (2 - aircrafts[i].dragFactor) / 33;
					}
				}
			} else {
				aircrafts[i].iasChng = 0;
				aircrafts[i].ias = aircrafts[i].clearedIas;
			}
		} else {
			aircrafts[i].ias -= aircrafts[i].dragFactor / 33;
		}
		
		if (aircrafts[i].collided) {
			while (aircrafts[i].collidedHdgChng == 0 && aircrafts[i].collidedAltChng == 0) {
				aircrafts[i].collidedHdgChng = random(-0.6, 0.6);
				aircrafts[i].collidedAltChng = random(-4, -8);
			}
			aircrafts[i].hdgChng = aircrafts[i].collidedHdgChng;
			aircrafts[i].altChng = aircrafts[i].collidedAltChng;
			if (aircrafts[i].pos[3] < egllElevation) {
				aircrafts[i].selected = false;
				for (var j = 0; j < egllRwy09Lx27R.length; j++) {
					if (egllRwy09Lx27R[j] > i) {
						egllRwy09Lx27R[j]--;
					} else if (egllRwy09Lx27R[j] == i) {
						egllRwy09Lx27R.splice(j, 1);
						j--;
					}
				}
				for (var j = 0; j < egllRwy09Rx27L.length; j++) {
					if (egllRwy09Rx27L[j] > i) {
						egllRwy09Rx27L[j]--;
					} else if (egllRwy09Rx27L[j] == i) {
						egllRwy09Rx27L.splice(j, 1);
						j--;
					}
				}
				aircrafts.splice(i, 1);
				for (var j = 0; j < selectedAircraftsNo; j++) {
					if (selectedAircrafts[j] > i) {
						selectedAircrafts[j]--;
					}
				}
				i--;
				aircraftsNo = aircrafts.length;
				continue;
			}
		}
		
		//Update aircraft heading within 1 and 360
		if (aircrafts[i].pos[2] <= 0) {
			aircrafts[i].pos[2] += 360;
		} else if (aircrafts[i].pos[2] > 360) {
			aircrafts[i].pos[2] -= 360;
		}
		if (aircrafts[i].clearedPos[0] <= 0) {
			aircrafts[i].clearedPos[0] += 360;
		} else if (aircrafts[i].clearedPos[0] > 360) {
			aircrafts[i].clearedPos[0] -= 360;
		}
		aircrafts[i].pos[2] += aircrafts[i].hdgChng;
		aircrafts[i].leftChangeHdg -= aircrafts[i].hdgChng;
		aircrafts[i].degrees = 450 - aircrafts[i].pos[2];
		
		//Display future position line in 1 minute if controlled
		if (aircrafts[i].control) {
			displayFuture(i);
		}
		
		//Separation incidents & rings
		displayRings(i);
		
		//Display aircraft label
		displayLabel(i);
		
		//Display aircraft trail dots
		fill(0, 175, 0);
		stroke(0, 175, 0);
		for (var j = aircrafts[i].trailLength - 5; j < aircrafts[i].trailLength; j++) {
			ellipse(aircrafts[i].trailX[j], aircrafts[i].trailY[j], 2, 2);
		}
		if (aircrafts[i].selected && selectedAircraftsNo == 1) {
			for (var j = 0; j < aircrafts[i].trailLength - 5; j++) {
				ellipse(aircrafts[i].trailX[j], aircrafts[i].trailY[j], 2, 2);
			}
		}
		fill(0, 255, 0);
		stroke(0, 255, 0);
		
		//Display aircraft icon
		rect(aircrafts[i].radarPos[0] - 3, aircrafts[i].radarPos[1] - 3, 6, 6);
		fill(0, 0, 0);
		rect(aircrafts[i].radarPos[0] - 2, aircrafts[i].radarPos[1] - 2, 4, 4);
		
		//Update rate of change of x, y
		aircrafts[i].xChng = aircrafts[i].tas * cos(radians(aircrafts[i].degrees)) * nm_to_px / 180000;
		aircrafts[i].yChng = aircrafts[i].tas * sin(radians(aircrafts[i].degrees)) * nm_to_px / 180000;
		
		//Update aircraft position and speed
		aircrafts[i].pos[0] += aircrafts[i].xChng;
		aircrafts[i].pos[1] -= aircrafts[i].yChng;
		aircrafts[i].pos[3] += aircrafts[i].altChng;
		aircrafts[i].ias += aircrafts[i].iasChng;
		aircrafts[i].tas = aircrafts[i].ias * (1 + aircrafts[i].pos[3] / 1000 * 0.02);
		
		//Update trail length
		aircrafts[i].trailLength = aircrafts[i].trailX.length;
		
		//Display ICAO, flight number, aircraft type, altitude, cleared altitude (line 1)
		text(aircrafts[i].icao + aircrafts[i].flightNo, 10, 10 + 30 * aircrafts[i].number);
		text(aircrafts[i].type, 70, 10 + 30 * aircrafts[i].number);
		if (!aircrafts[i].gs) {
			text("ALT: " + floor(aircrafts[i].pos[3] / 100) * 100 + " TO " + aircrafts[i].clearedPos[1], 110, 10 + 30 * aircrafts[i].number);
		} else {
			text("ALT: " + floor(aircrafts[i].pos[3] / 100) * 100 + " TO G/S", 110, 10 + 30 * aircrafts[i].number);
		}
		
		//Display GS, heading, cleared heading, cleared ILS (line 2)
		text("GS: " + floor(aircrafts[i].tas) + " ", 20, 25 + 30 * aircrafts[i].number);
		if (!aircrafts[i].loc) {
			text("HDG: " + floor(aircrafts[i].pos[2]) + " TO " + aircrafts[i].clearedPos[0], 70, 25 + 30 * aircrafts[i].number);
		} else {
			text("HDG: " + floor(aircrafts[i].pos[2]) + " TO LOC", 70, 25 + 30 * aircrafts[i].number);
		}
		text("ILS" + aircrafts[i].ils[aircrafts[i].ilsIndex], 180, 25 + 30 * aircrafts[i].number);
		stroke(0, 0, 0);
		line(0, 27.5 + 30 * aircrafts[i].number, 230, 27.5 + 30 * aircrafts[i].number);
	}
	
	//Display score
	fill(255, 255, 255);	
	textSize(20);
	if (score <= 4.0) {
		score = 4.0;
	}
	text("Score: " + round(score * 10) / 10, 730, 40);
	textSize(12);
	if (score > highScore) {
		highScore = score;
	}
	text("High score: " + round(highScore * 10) / 10, 730, 20);
	//Display panels
	if (selectedAircraftsNo == 1) {
		displayAtcPanel(selectedAircrafts[0]); //If only 1 aircraft selected in 1 click
	} else if (selectedAircraftsNo > 1) {
		displayAircraftSel(); //If multiple aircrafts selected in 1 click
	}
	textSize(12);
	fill(0, 50, 255);
	pilotSpeechNo = pilotSpeech.length;
	for (var i = 0; i < pilotSpeech.length; i++) {
		displaySpeech += pilotSpeech[i];
	}
	text(displaySpeech, 260, 580);
	displaySpeech = "";
	//noLoop();
}