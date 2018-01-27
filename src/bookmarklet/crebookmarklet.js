(function() {
  var setLocationSpecificUrlParams = function(
    userLocation,
    urlParams,
    userSublocation
  ) {
    var userQuests = user["quests"];
    if (userLocation === "Furoma Rift") {
      var chargeLevel = userQuests["QuestRiftFuroma"]["droid"]["charge_level"];
      if (chargeLevel !== "") {
        /*Replaced if-else with dictionary lookup -- less code*/
        var levels = {
          charge_level_one: 1,
          charge_level_two: 2,
          charge_level_three: 3,
          charge_level_four: 4,
          charge_level_five: 5,
          charge_level_six: 6,
          charge_level_seven: 7,
          charge_level_eight: 8,
          charge_level_nine: 9,
          charge_level_ten: 10
        };
        urlParams["battery"] = levels[chargeLevel];
      }
    } else if (userLocation === "Labyrinth") {
      if (userQuests["QuestLabyrinth"]["lantern_status"] === "active") {
        /* Set url param directly instead of using temp variable */
        urlParams["oil"] = "On";
      }
    } else if (userLocation === "Fort Rox") {
      var fort = userQuests["QuestFortRox"]["fort"];
      urlParams["ballistaLevel"] = fort["b"]["level"];
      urlParams["cannonLevel"] = fort["c"]["level"];
    } else if (userLocation === "Zugzwang's Tower") {
      urlParams["amplifier"] = user["viewing_atts"]["zzt_amplifier"];
    }
  };

  var getUserTournament = function() {
    if (document.querySelector("div.tournamentStatusHud") !== null) {
      var tourney = user["viewing_atts"]["tournament"];
      if (tourney["status"] === "active" || tourney["status"] === "pending") {
        /* Set url param directly instead of using temp variable */
        return tourney["name"];
      }
    }
  };

  var findSublocation = function(userLocation, userBase) {
    var userQuests = user["quests"];

    var userViewingAtts = user["viewing_atts"];
    if (userLocation === "Balack's Cove") {
      var tide = userViewingAtts["tide"];
      if (tide === "low") {
        return "Low Tide";
      } else if (tide === "medium") {
        return "Mid Tide";
      } else if (tide === "high") {
        return "High Tide";
      }
    } else if (userLocation === "Burroughs Rift") {
      var tier = userQuests["QuestRiftBurroughs"]["mist_tier"];
      var tierMapping = {
        tier_0: "Mist Level 0",
        tier_1: "Mist Level 1-5",
        tier_2: "Mist Level 6-18",
        tier_3: "Mist Level 19-20"
      };
      return tierMapping[tier];
    } else if (userLocation === "Fiery Warpath") {
      var wave = userViewingAtts["desert_warpath"]["wave"];
      return "Wave " + wave;
    } else if (userLocation === "Fort Rox") {
      var fortRoxQuest = userQuests["QuestFortRox"];
      var tmpPhase = fortRoxQuest["current_phase"];
      if (tmpPhase === "day") {
        return "Day";
      } else if (tmpPhase === "dawn") {
        return "Dawn";
      } else if (tmpPhase === "night") {
        var stage = fortRoxQuest["current_stage"];
        var stages = {
          stage_one: "Twilight",
          stage_two: "Midnight",
          stage_three: "Pitch",
          stage_four: "Utter Darkness",
          stage_five: "First Light"
        };
        return stages[stage];
      } else {
        return tmpPhase;
      }
    } else if (userLocation === "Gnawnian Express Station") {
      var onTrain = userQuests["QuestTrainStation"]["on_train"];
      if (onTrain) {
        var trainData = userViewingAtts["tournament"]["minigame"];
        var stageName = trainData["name"];
        if (stageName === "Supply Depot") {
          var supplyHoarder = trainData["supply_hoarder_turns"];
          if (supplyHoarder > 0) {
            return "Supply Depot (Supply Rush)";
          } else if (supplyHoarder === 0) {
            return "Supply Depot (No Supply Rush)";
          }
        } else if (
          stageName === "Raider River" ||
          stageName === "Daredevil Canyon"
        ) {
          return stageName;
        }
      }
    } else if (userLocation === "Iceberg") {
      var sublocation = userQuests["QuestIceberg"]["current_phase"];
      if (sublocation === "General") {
        return "Generals";
      }
      if (
        (sublocation === "Treacherous Tunnels" ||
          sublocation === "The Mad Depths") &&
        userBase === "Magnet Base"
      ) {
        return sublocation + " (Magnet)";
      } else if (
        sublocation === "The Mad Depths" &&
        userBase === "Hearthstone Base"
      ) {
        return sublocation + " (Hearthstone)";
      } else if (
        sublocation === "Bombing Run" &&
        userBase === "Remote Detonator Base"
      ) {
        return sublocation + " (Remote Detonator)";
      }
      return sublocation;
    } else if (userLocation === "Labyrinth") {
      var hallwayName = userQuests["QuestLabyrinth"]["hallway_name"];

      if (contains(hallwayName, "Short"))
        hallwayName = hallwayName.slice(6, hallwayName.length);
      else if (contains(hallwayName, "Medium"))
        hallwayName = hallwayName.slice(7, hallwayName.length);
      else if (contains(hallwayName, "Long"))
        hallwayName = hallwayName.slice(5, hallwayName.length);
      hallwayName = hallwayName.slice(0, hallwayName.indexOf(" Hallway"));
      return hallwayName;
    } else if (userLocation === "Living Garden") {
      if (
        userQuests["QuestLivingGarden"]["minigame"]["bucket_state"] === "dumped"
      ) {
        return "Poured";
      }
    } else if (userLocation === "Moussu Picchu") {
      var UP_DIRECTION = "up";
      var LEVEL_KEY = "level";
      var DIRECTION_KEY = "direction";
      var RAIN_KEY = "rain";
      var WIND_KEY = "wind";

      var elements = userQuests["QuestMoussuPicchu"]["elements"];
      var stormLevel = elements["storm"][LEVEL_KEY];

      if (stormLevel !== "none") {
        return "Storm " + stormLevel;
      } else if (elements[RAIN_KEY][DIRECTION_KEY] === UP_DIRECTION) {
        return "Rain " + elements[RAIN_KEY][LEVEL_KEY];
      } else if (elements[WIND_KEY][DIRECTION_KEY] === UP_DIRECTION) {
        return "Wind " + elements[WIND_KEY][LEVEL_KEY];
      }
    } else if (userLocation === "Twisted Garden") {
      if (
        userQuests["QuestLivingGarden"]["minigame"]["vials_state"] === "dumped"
      ) {
        return "Poured";
      }
    } else if (userLocation === "Lost City") {
      if (userQuests["QuestLostCity"]["minigame"]["is_cursed"] === 1) {
        return "Cursed";
      }
    } else if (userLocation === "Cursed City") {
      if (userQuests["QuestLostCity"]["minigame"]["is_cursed"]) {
        return "Cursed";
      }
    } else if (userLocation === "Sand Dunes") {
      if (userQuests["QuestSandDunes"]["minigame"]["has_stampede"]) {
        return "Stampede";
      }
    } else if (userLocation === "Seasonal Garden") {
      var season = userViewingAtts["season"];
      var seasonMapping = {
        fl: "Fall",
        wr: "Winter",
        sg: "Spring",
        sr: "Summer"
      };
      return seasonMapping[season];
    } else if (userLocation === "Sunken City") {
      sublocation = userQuests["QuestSunkenCity"]["zone_name"];
      if (sublocation === "Sunken City") {
        sublocation = "Docked";
      }
      return sublocation;
    } else if (userLocation === "Toxic Spill") {
      var pollutionQuest = userQuests["QuestPollutionOutbreak"];
      var titles = pollutionQuest["titles"];

      var spillSublocationMap = {
        archduke_archduchess: "Archduke/Archduchess",
        grand_duke: "Grand Duke/Grand Duchess",
        duke_dutchess: "Duke/Duchess",
        count_countess: "Count/Countess",
        baron_baroness: "Baron/Baroness",
        lord_lady: "Lord/Lady",
        hero: "Hero",
        knight: "Knight"
      };

      //TODO: Investigate possibility of using nextStatus and rising/falling to determine this instead of looping over titles
      for (var key in titles) {
        if (titles.hasOwnProperty(key) && titles[key].active) {
          sublocation = spillSublocationMap[key];
        }
      }
      return sublocation;
    } else if (userLocation === "Whisker Woods Rift") {
      var zones = userQuests["QuestRiftWhiskerWoods"]["zones"];
      var clearing = zones["clearing"]["status"];
      var tree = zones["tree"]["status"];
      var lagoon = zones["lagoon"]["status"];
      var state = "";
      state += clearing + "/" + tree + "/" + lagoon;
      state = state.replace(/low/g, "Low");
      state = state.replace(/high/g, "Medium");
      state = state.replace(/boss/g, "High");
      return state;
    } else if (userLocation === "Zokor") {
      var quest = userQuests["QuestAncientCity"];

      var districtname = quest.district_name;
      var district_type = quest.clue_name;
      var district_tier = quest.district_tier;

      //TODO: Check cluename/cluetype of Lair to improve this
      if (contains(districtname, "Minotaur")) {
        return "Lair of the Minotaur";
      } else {
        var districts = {
          Tech: ["Tech Foundry Outskirts", "Tech Research Center", "Manaforge"],
          Scholar: [
            "Neophyte Scholar Study",
            "Master Scholar Auditorium",
            "Dark Library"
          ],
          Fealty: [
            "Outer Fealty Shrine",
            "Inner Fealty Temple",
            "Templar's Sanctum"
          ],
          Treasury: ["Treasure Room", "Treasure Vault"],
          Farming: ["Farming Garden", "Overgrown Farmhouse"]
        };

        return districts[district_type][district_tier - 1];
      }
    } else if (userLocation === "Furoma Rift") {
      if (userQuests["QuestRiftFuroma"]["droid"]["charge_level"]) {
        return "Pagoda";
      } else {
        return "Training Grounds";
      }
    } else if (userLocation === "Bristle Woods Rift") {
      return userQuests["QuestRiftBristleWoods"]["chamber_name"];
    } else if (userLocation === "Zugzwang's Tower") {
      var mystic = userViewingAtts["zzt_mage_progress"];
      var tech = userViewingAtts["zzt_tech_progress"];
      if (mystic >= tech) {
        if (mystic >= 0 && mystic < 8) {
          return "Mystic Pawn Pincher";
        } else if (mystic >= 8 && mystic < 10) {
          return "Mystic Knights";
        } else if (mystic >= 10 && mystic < 12) {
          return "Mystic Bishops";
        } else if (mystic >= 12 && mystic < 14) {
          return "Mystic Rooks";
        } else if (mystic === 14) {
          return "Mystic Queen";
        } else if (mystic === 15) {
          return "Mystic King";
        } else if (mystic >= 16) {
          return "Chess Master";
        }
      } else {
        if (tech >= 0 && tech < 8) {
          return "Technic Pawn Pincher";
        } else if (tech >= 8 && tech < 10) {
          return "Technic Knights";
        } else if (tech >= 10 && tech < 12) {
          return "Technic Bishops";
        } else if (tech >= 12 && tech < 14) {
          return "Technic Rooks";
        } else if (tech === 14) {
          return "Technic Queen";
        } else if (tech === 15) {
          return "Technic King";
        } else if (tech >= 16) {
          return "Chess Master";
        }
      }
    }
    return "N/A";
  };

  function contains(collection, searchElement) {
    return collection.indexOf(searchElement) > -1;
  }

  /**
   * Normalize user rank (i.e. Archduke/Archduchess -> archduke)
   * @returns {string}
   */
  function findUserRank() {
    var userRank = user["title_name"];
    if (userRank === "Archduke" || userRank === "Archduchess")
      return "archduke";
    if (userRank === "Grand Duke" || userRank === "Grand Duchess")
      return "grandduke";
    if (userRank === "Duke" || userRank === "Duchess") return "duke";
    if (userRank === "Count" || userRank === "Countess") return "count";
    if (userRank === "Baron" || userRank === "Baroness") return "baron";
    if (userRank === "Lord" || userRank === "Lady") return "lord";
    if (userRank === "Journeyman" || userRank === "Journeywoman")
      return "journeyman";
    return userRank.toLowerCase();
  }

  if (location.href.indexOf("mousehuntgame.com") < 0) {
    alert("You are not on mousehuntgame.com! Please try again.");
    return;
  }

  if (!user) {
    /* Handles null and undefined */
    alert("User object not found.");
    return;
  }

  /**
   * Controls the names and values placed in URL
   */
  var urlParams = {};

  var userLocation = user["location"];
  var userBase = user["base_name"];

  urlParams["location"] = userLocation;
  urlParams["weapon"] = user["weapon_name"];
  urlParams["base"] = userBase;
  urlParams["charm"] = user["trinket_name"];
  urlParams["tourney"] = getUserTournament();
  urlParams["rank"] = findUserRank();

  if (!user["has_shield"]) {
    urlParams["gs"] = "No";
  }
  var luck_element = document.querySelector(
    ".campPage-trap-trapStat.luck > .value"
  );
  urlParams["totalluck"] =
    luck_element && luck_element.textContent
      ? Number(luck_element.textContent)
      : user["trap_luck"];

  var userSublocation = findSublocation(userLocation, userBase);
  setLocationSpecificUrlParams(userLocation, urlParams, userSublocation);

  // Cheese edge cases
  var userCheese = user["bait_name"];
  if (userCheese) {
    if (contains(userCheese, "Toxic")) {
      userCheese = userCheese.slice(6, userCheese.length);
      urlParams["toxic"] = "Yes";
    }

    if (userCheese.indexOf("SUPER|brie+") >= 0) {
      userCheese = "SB+";
    } else if (userCheese.indexOf(" Cheese") >= 0) {
      if (contains(userCheese, "Gauntlet")) {
        userCheese = userCheese.slice(16, userCheese.length);
        userSublocation = userCheese;
      } else {
        userCheese = userCheese.slice(0, userCheese.indexOf(" Cheese"));
      }
    }
    urlParams["cheese"] = userCheese;
  }

  if (userSublocation !== "N/A") {
    urlParams["phase"] = userSublocation;
  }

  sendData(urlParams);

  function sendData(parameters) {
    var url = "https://tsitu.github.io/MH-Tools/cre.html?";
    //url = "http://localhost:63342/MH-Tools/cre.html?";

    for (var key in parameters) {
      var value = encodeURIComponent(parameters[key]);
      url += key + "=" + value + "&";
    }

    var newWindow = window.open("", "mhcre");
    newWindow.location = url;
  }
})();
