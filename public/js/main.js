var selectedClub = [];
var activePage = 'HomePage';
var currentTeams = [];
var currentSeasonFixtures = [];
var allLeagueFixtures = [];

var renderMainPage = function() {
  var source = $('#statColumns-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template();
  $('.statsRow').append(newHTML);
  buttonBinding();
}
var buttonBinding = function() {
  $('#mySubmit').on('click', function() {
    var teamA = $(this).siblings('#selTeamA').val();
    var teamB = $(this).siblings('#selTeamB').val();
    var fromY = $(this).siblings('#selYearFrom').val();
    var fromM = $(this).siblings('#selMonthFrom').val();
    var fromD = $(this).siblings('#selDayFrom').val();
    var toY = $(this).siblings('#selYearTo').val();
    var toM = $(this).siblings('#selMonthTo').val();
    var toD = $(this).siblings('#selDayTo').val();
    var dateFrom = fromM + "/" + fromD + "/" + fromY;
    var dateTo = toM + "/" + toD + "/" + toY;
    homepageStyling();
    fetchFixturesToCompare(teamA, teamB, dateFrom, dateTo);
  });
}
var homepageStyling = function() {
  document.getElementById("boom").classList.add('hidden');
  document.getElementById("boom").classList.remove('visible');
  document.getElementById("boom").style.display = "none";
  document.getElementById("boom1").style.display = "none";
  document.body.style.background = "url('/bck/search.jpg') no-repeat center fixed";
  document.body.style.backgroundSize = "cover";
  document.getElementById("boom2").style.width = "100%";
  document.getElementById("chartfield").style.backgroundColor = "#EAFF04";
}
var fetchTeam = function() {
  
  var clubs = [];
  $.ajax({
    url: '/epl/clubs.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      clubs = data;
      for (var i = 0; i < clubs.length; i++) {
        if (clubs[i].FDCOUK === activePage) {
          selectedClub = clubs[i];
          console.log(selectedClub);
        }
      }
      $('.teamDetails').empty();
      var source = $('#teamDetails-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(selectedClub);
      $('.teamDetails').append(newHTML);
      document.getElementById('night-life').style.background = "linear-gradient(to bottom right, " + selectedClub.color1 + ", " + selectedClub.color2 + ")";
      document.getElementById('stadium').style.background = "url('/stadiums/" + selectedClub.FDCOUK + ".jpg') no-repeat center";
      fetchSquad();
    }
  });
};
var fetchSquad = function() {
  var source = $('#teamStatColumns-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(selectedClub);
  $('.statsRow').append(newHTML);
  $.ajax({
    headers: { 'X-Auth-Token': '39d5903e73c34ce2bdcbd0d280f3765f' },
    url: 'http://api.football-data.org/v1/teams/' + selectedClub.TID + '/players',
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      var players = data.players;
      console.log(players);
      $('.players').empty();
      for (var i = 0; i < players.length; i++) {
        var source = $('#squadPlayer').html();
        var template = Handlebars.compile(source);
        var newHTML = template(players[i]);
        $('.players').append(newHTML);
      }
      trophyDrawer();
      fetchFixtures();
    }
  });
}
var fetchFixtures = function() {
  $.ajax({
    headers: { 'X-Auth-Token': '39d5903e73c34ce2bdcbd0d280f3765f' },
    url: 'http://api.football-data.org/v1/teams/' + selectedClub.TID + '/fixtures',
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      var fixtures = data.fixtures;
      console.log(fixtures);
      $('.fixtures').empty();
      for (var i = 0; i < 10; i++) {
        fixtures[i].date = fixtures[i].date.slice(0, 10);
        var source = $('#fixtures').html();
        var template = Handlebars.compile(source);
        var newHTML = template(fixtures[i]);
        $('.fixtures').append(newHTML);
      }
    }
  });
}
var trophyDrawer = function() {
  $('#epltrophies').empty();
  $('#factrophies').empty();
  $('#efltrophies').empty();
  $('#ucltrophies').empty();
  $('#ueltrophies').empty();
  for (var i = 0; i < selectedClub.EPL; i++) {
    $('#epltrophies').append('<img class="trophyIcon" src="/trophies/epl.png">');
  }
  for (var j = 0; j < selectedClub.FAC; j++) {
    $('#factrophies').append('<img class="trophyIcon" src="/trophies/fac.png">');
  }
  for (var i = 0; i < selectedClub.LC; i++) {
    $('#efltrophies').append('<img class="trophyIcon" src="/trophies/efl.png">');
  }
  for (var i = 0; i < selectedClub.UCL; i++) {
    $('#ucltrophies').append('<img class="trophyIcon" src="/trophies/ucl.png">');
  }
  for (var i = 0; i < selectedClub.UEL; i++) {
    $('#ueltrophies').append('<img class="trophyIcon" src="/trophies/uel.png">');
  }
}

var fetchAllFixtures = function(seasonRequest, leagueRequest) {

  $.ajax({
    url: '/seasons/'+seasonRequest,
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      allLeagueFixtures = data;
      var alreadyInThere = false;
      for (var i = 0; i < allLeagueFixtures.length; i++) {
          if (leagueRequest === allLeagueFixtures[i].Division) {
            currentSeasonFixtures.push(allLeagueFixtures[i]);
          }
        
      } // I have all matches from the requested season and division
      var teamPutter = {
        Name: currentSeasonFixtures[0].HomeTeam,
        Active: true,
        HomePlayed: 0,
        HomeWin: 0,
        HomeDraw: 0,
        HomeLose: 0,
        HomeGoalsScored: 0,
        HomeGoalsConceded: 0,
        HomeGoalDifference: 0,
        HomePoints: 0,
        AwayPlayed: 0,
        AwayWin: 0,
        AwayDraw: 0,
        AwayLose: 0,
        AwayGoalsScored: 0,
        AwayGoalsConceded: 0,
        AwayGoalDifference: 0,
        AwayPoints: 0,
        TotalPlayed: 0,
        TotalWin: 0,
        TotalDraw: 0,
        TotalLose: 0,
        TotalGoalsScored: 0,
        TotalGoalsConceded: 0,
        TotalGoalDifference: 0,
        TotalPoints: 0,
        Position: 0
      };
      currentTeams.push(teamPutter);


      // FIRST TEAM ADDED TO TEAMS ARRAY

      for (var i = 0; i < currentSeasonFixtures.length; i++) {
        var selMatchHomeTeam = currentSeasonFixtures[i].HomeTeam;
        var ctl = currentTeams.length;
        if (i > 0) {
          for (var j = 0; j < ctl; j++) {
            var team = currentTeams[j].Name
            if (team === selMatchHomeTeam) { alreadyInThere = true; } else if (ctl === 1 || j === ctl - 1) {
              if (!alreadyInThere) {
                var teamPutter = {
                  Name: currentSeasonFixtures[i].HomeTeam,
                  Active: true,
                  HomePlayed: 0,
                  HomeWin: 0,
                  HomeDraw: 0,
                  HomeLose: 0,
                  HomeGoalsScored: 0,
                  HomeGoalsConceded: 0,
                  HomeGoalDifference: 0,
                  HomePoints: 0,
                  AwayPlayed: 0,
                  AwayWin: 0,
                  AwayDraw: 0,
                  AwayLose: 0,
                  AwayGoalsScored: 0,
                  AwayGoalsConceded: 0,
                  AwayGoalDifference: 0,
                  AwayPoints: 0,
                  TotalPlayed: 0,
                  TotalWin: 0,
                  TotalDraw: 0,
                  TotalLose: 0,
                  TotalGoalsScored: 0,
                  TotalGoalsConceded: 0,
                  TotalGoalDifference: 0,
                  TotalPoints: 0,
                  Position: 0
                };
                currentTeams.push(teamPutter);
              }
            }
          }
          alreadyInThere = false;
        }
      }
      // I HAVE ALL TEAMS WHICH ARE NEEDED FOR THE CURRENT TABLE
      fixturesDataCalculator();
    }
  });
};

var fixturesDataCalculator = function() {
  for (var l = 0; l < currentTeams.length; l++) {
    var currentTeamOnly = currentTeams[l];
      currentTeamOnly.HomePlayed = 0;
      currentTeamOnly.HomeWin = 0;
      currentTeamOnly.HomeDraw = 0;
      currentTeamOnly.HomeLose = 0;
      currentTeamOnly.HomeGoalsScored = 0;
      currentTeamOnly.HomeGoalsConceded = 0;
      currentTeamOnly.HomeGoalDifference = 0;
      currentTeamOnly.HomePoints = 0;
      currentTeamOnly.AwayPlayed = 0;
      currentTeamOnly.AwayWin = 0;
      currentTeamOnly.AwayDraw = 0;
      currentTeamOnly.AwayLose = 0;
      currentTeamOnly.AwayGoalsScored = 0;
      currentTeamOnly.AwayGoalsConceded = 0;
      currentTeamOnly.AwayGoalDifference = 0;
      currentTeamOnly.AwayPoints = 0;
      currentTeamOnly.TotalPlayed = 0;
      currentTeamOnly.TotalWin = 0;
      currentTeamOnly.TotalDraw = 0;
      currentTeamOnly.TotalLose = 0;
      currentTeamOnly.TotalGoalsScored = 0;
      currentTeamOnly.TotalGoalsConceded = 0;
      currentTeamOnly.TotalGoalDifference = 0;
      currentTeamOnly.TotalPoints = 0;
    if (currentTeamOnly.Active === true) {
      for (var m = 0; m < currentSeasonFixtures.length; m++) {
        var currentMatch = currentSeasonFixtures[m];
        var opponent = "";
        var opponentActive = true;
        if (currentTeamOnly.Name === currentMatch.HomeTeam) {
          opponent = currentMatch.AwayTeam
        } else if (currentTeamOnly.Name === currentMatch.AwayTeam) {
          opponent = currentMatch.HomeTeam
        }
        for (var i = 0; i < currentTeams.length; i++) {
          if (currentTeams[i].Name === opponent) {
            if (currentTeams[i].Active === true) {
              opponentActive = true;
            } else if (currentTeams[i].Active === false) {
              opponentActive = false
            }
          }
        } // I KNOW IF THE OPPONENT IS ACTIVE OR NOT
        if (opponentActive === true) {
          if (currentMatch.HomeTeam === currentTeamOnly.Name) {
            currentTeamOnly.HomePlayed += 1;
            if (currentMatch.HomeGoals > currentMatch.AwayGoals) { //HOME WIN
              currentTeamOnly.HomeWin += 1;
              currentTeamOnly.HomeGoalsScored += currentMatch.HomeGoals;
              currentTeamOnly.HomeGoalsConceded += currentMatch.AwayGoals;
              if (currentMatch.Season > 1981) {
                currentTeamOnly.HomePoints += 3;
              } else if (currentMatch.Season <= 1981){
                currentTeamOnly.HomePoints += 2;
              }
            } else if (currentMatch.HomeGoals < currentMatch.AwayGoals) { //HOME LOSE
              currentTeamOnly.HomeLose += 1;
              currentTeamOnly.HomeGoalsScored += currentMatch.HomeGoals;
              currentTeamOnly.HomeGoalsConceded += currentMatch.AwayGoals;
            } else { //HOME DRAW
              currentTeamOnly.HomePoints += 1;
              currentTeamOnly.HomeDraw += 1;
              currentTeamOnly.HomeGoalsScored += currentMatch.HomeGoals;
              currentTeamOnly.HomeGoalsConceded += currentMatch.AwayGoals;
            }
          } else if (currentMatch.AwayTeam === currentTeamOnly.Name) {
            currentTeamOnly.AwayPlayed += 1;
            if (currentMatch.HomeGoals < currentMatch.AwayGoals) { //AWAY WIN
              currentTeamOnly.AwayWin += 1;
              currentTeamOnly.AwayGoalsScored += currentMatch.AwayGoals;
              currentTeamOnly.AwayGoalsConceded += currentMatch.HomeGoals;
              if (currentMatch.Season > 1981) {
                currentTeamOnly.AwayPoints += 3;
              } else if (currentMatch.Season <= 1981){
                currentTeamOnly.AwayPoints += 2;
              }
            } else if (currentMatch.HomeGoals > currentMatch.AwayGoals) { //AWAY LOSE
              currentTeamOnly.AwayLose += 1;
              currentTeamOnly.AwayGoalsScored += currentMatch.AwayGoals;
              currentTeamOnly.AwayGoalsConceded += currentMatch.HomeGoals;
            } else { //AWAY DRAW
              currentTeamOnly.AwayPoints += 1;
              currentTeamOnly.AwayDraw += 1;
              currentTeamOnly.AwayGoalsScored += currentMatch.AwayGoals;
              currentTeamOnly.AwayGoalsConceded += currentMatch.HomeGoals;
            }
          }
        }
      }
    }
    currentTeamOnly.HomeGoalDifference = currentTeamOnly.HomeGoalsScored - currentTeamOnly.HomeGoalsConceded;
    currentTeamOnly.AwayGoalDifference = currentTeamOnly.AwayGoalsScored - currentTeamOnly.AwayGoalsConceded;
    currentTeamOnly.TotalPlayed = currentTeamOnly.HomePlayed + currentTeamOnly.AwayPlayed;
    currentTeamOnly.TotalGoalsScored = currentTeamOnly.HomeGoalsScored + currentTeamOnly.AwayGoalsScored;
    currentTeamOnly.TotalGoalsConceded = currentTeamOnly.AwayGoalsScored + currentTeamOnly.AwayGoalsConceded;
    currentTeamOnly.TotalGoalDifference = currentTeamOnly.TotalGoalsScored - currentTeamOnly.TotalGoalsConceded;
    currentTeamOnly.TotalPoints = currentTeamOnly.HomePoints + currentTeamOnly.AwayPoints;
    currentTeamOnly.TotalWin = currentTeamOnly.HomeWin + currentTeamOnly.AwayWin;
    currentTeamOnly.TotalLose = currentTeamOnly.HomeLose + currentTeamOnly.AwayLose;
    currentTeamOnly.TotalDraw = currentTeamOnly.HomeDraw + currentTeamOnly.AwayDraw;
  }

  tableSortingTotal();
  addPosition();
  renderTable();

}



var tableSortingTotal = function() {
  currentTeams.sort(function (a, b) {
    return b.TotalPoints - a.TotalPoints || a.TotalGoalDifference - b.TotalGoalDifference;
  });
}

var tableSortingHome = function() {
  currentTeams.sort(function (a, b) {
  return b.HomePoints - a.HomePoints;
  });
}

var tableSortingAway = function() {
  currentTeams.sort(function (a, b) {
  return b.AwayPoints - a.AwayPoints;
  });
}

var addPosition = function() {
  for (var i = 0; i < currentTeams.length; i++) {
    currentTeams[i].Position = i+1;
  }
}

var renderTable = function() {
  $('.statsRow').empty();
  $('.teamDetails').empty();
  var source = $('#dynamicTable-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template();
  $('.teamDetails').append(newHTML);
  for (var i = 0; i < currentTeams.length; i++) {
    if (currentTeams[i].Active === true) {
      var source = $('#dynamicTableRow-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(currentTeams[i]);
      $('.teamsForTable').append(newHTML);
    } else {
      var source = $('#dynamicTableRowInactive-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(currentTeams[i]);
      $('.teamsForTableInactive').append(newHTML);
    }
  }
  activeClicker();
  tableChangingButtons();
}



var tableChangingButtons = function() {
  $('#HomeTable').on('click', function() {
    tableSortingHome();
    addPosition();
    renderTable();
    $('.Away').css('display', 'none');
    $('.Total').css('display', 'none');
    $('.Home').css('display', 'inline-block');
  })
  $('#AwayTable').on('click', function() {
    tableSortingAway();
    addPosition();
    renderTable();
    $('.Home').css('display', 'none');
    $('.Total').css('display', 'none');
    $('.Away').css('display', 'inline-block');
  })
  $('#TotalTable').on('click', function() {
    tableSortingTotal();
    addPosition();
    renderTable();
    $('.Away').css('display', 'none');
    $('.Home').css('display', 'none');
    $('.Total').css('display', 'inline-block');
  })

}

var activeClicker = function() {

  $('.clicker').on('click', ('.Name'), function() {
    var thisTeam = $(this).html();
    activator(thisTeam);
    fixturesDataCalculator();
    tableSortingTotal();
    addPosition();
    renderTable();
  });
}

var activator = function(thisTeam) {
  var teamsArray = currentTeams;
  for (var i = 0; i < teamsArray.length; i++) {
    if (teamsArray[i].Name === thisTeam) {
      if (teamsArray[i].Active === true) {
        teamsArray[i].Active = false;
      } else if (teamsArray[i].Active === false) {
        teamsArray[i].Active = true
      }
    }
  }
  console.log(teamsArray)
}

var seasonSelector = function() {
  $('#selectSeason').empty();
  for (var i = 1963; i<2017; i++) {
      var helper= {
        i:i,
        j:i+1
      };
      var source = $('#seasonSelector-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(helper);
      $('#selectSeason').append(newHTML);
      helper+=1;
  }
  $('#submitSeason').on('click', function() {
  allLeagueFixtures = [];
  currentTeams = [];
  currentSeasonFixtures = [];
  var sR = $(this).siblings('#selectSeason').val();
  var seasonRequest = parseInt(sR);
  // var leagueRequest = $(this).siblings('#selectLeague').val();
  fetchAllFixtures(seasonRequest, 1);
})
}


renderMainPage();
buttonBinding();
activeClicker();
trophyDrawer();
tableChangingButtons();
seasonSelector();

document.body.style.background = "url('/bck/" + activePage + ".jpg') no-repeat center fixed";
document.body.style.backgroundSize = "cover";

$('.teamlogos').on('click', function() {
  activePage = this.id;
  $('.statsRow').empty();
  $('.teamDetails').empty();
  fetchTeam();
  document.body.style.background = "url('/bck/" + activePage + ".jpg') no-repeat center fixed";
  document.body.style.backgroundSize = "cover";
})
