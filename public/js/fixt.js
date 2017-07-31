var selectedF = [];
var filteredData = {};

function fetchFixturesToCompare(teamA, teamB, seasonFrom, seasonTo) {
 
  $.ajax({
    // url: '/seasons/'+teamA+'/'+teamB+'/'+from+'/'+to,
    url: '/seasons/'+teamA+'/'+teamB+'/'+seasonFrom+'/'+seasonTo,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      selectedF = data;
      addResult(teamA, teamB);
    }
  })
};

function addResult(teamA, teamB) {
  for (var i = 0; i < selectedF.length; i++) {
    var sf = selectedF[i]
    if (sf.HomeGoals > sf.AwayGoals) {
      sf.result = sf.HomeTeam
    } else if (sf.HomeGoals < sf.AwayGoals) {
      sf.result = sf.AwayTeam
    } else {
      sf.result = null;
    }
  }
  fetchTeamOnly(teamA, teamB);
};



var fetchTeamOnly = function(teamA, teamB) {
  var clubs = [];
  var teamAB = {
    teamA: {},
    teamB: {}
  };
  $.ajax({
    url: '/epl/clubs.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      clubs = data;

      for (var i = 0; i < clubs.length; i++) {
        if (clubs[i].FDCOUK == teamA) {
          teamAB.teamA = clubs[i];
        } else if (clubs[i].FDCOUK == teamB) {
          teamAB.teamB = clubs[i];
        }
      }
      pieChartData(teamA, teamB, teamAB);
    }
  });

};

function pieChartData(teamA, teamB, teamAB) {
  var teamAhome = {
    teamAwins: 0,
    draws: 0,
    teamBwins: 0,
    teamAgoals: 0,
    teamBgoals: 0
  };
  var teamBhome = {
    teamBwins: 0,
    draws: 0,
    teamAwins: 0,
    teamAgoals: 0,
    teamBgoals: 0
  };
  var total = {
    teamA: 0,
    draws: 0,
    teamB: 0,
    teamAgoals: 0,
    teamBgoals: 0
  };
  var sf = selectedF;
  for (var i = 0; i < sf.length; i++) {
    if (sf[i].HomeTeam === teamA) {
      if (sf[i].result === teamA) {
        teamAhome.teamAwins++;
      } else if (sf[i].result === teamB) {
        teamAhome.teamBwins++;
      } else {
        teamAhome.draws++;
      }
      teamAhome.teamAgoals += sf[i].HomeGoals;
      teamAhome.teamBgoals += sf[i].AwayGoals;
    } else if (sf[i].HomeTeam === teamB) {
      if (sf[i].result === teamA) {
        teamBhome.teamAwins++;
      } else if (sf[i].result === teamB) {
        teamBhome.teamBwins++;
      } else {
        teamBhome.draws++;
      }
      teamBhome.teamBgoals += sf[i].HomeGoals;
      teamBhome.teamAgoals += sf[i].AwayGoals;
    }
  }
  total.teamA = teamAhome.teamAwins + teamBhome.teamAwins;
  total.draws = teamAhome.draws + teamBhome.draws;
  total.teamB = teamBhome.teamBwins + teamAhome.teamBwins;
  total.teamAgoals = teamBhome.teamAgoals + teamAhome.teamAgoals;
  total.teamBgoals = teamBhome.teamBgoals + teamAhome.teamBgoals;


  filteredData = {
    teamA: teamA,
    teamB: teamB,
    teamAhome: teamAhome,
    teamBhome: teamBhome,
    total: total,
    teamAB: teamAB,
    selectedF: selectedF
  }


  renderFixtures(filteredData);
};


function renderFixtures(filteredData) {

  $('#chartfield').empty();
  var source = $('#charts-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(filteredData);
  $('#chartfield').append(newHTML);
  teamAhomeChart(filteredData);
  teamBhomeChart(filteredData);
  myChart(filteredData);
  // renderFixturesForCharts(filteredData);
  // document.getElementById("myChart").width = 400;
  // document.getElementById("myChart").height = 400;


  // styler();

}

// function renderFixturesForCharts(filteredData){
//   var fixtures = filteredData.selectedF;
//   for (var i = 0; i < 5; i++) {
//     var source = $('#fixturesForCharts-template').html();
//     var template = Handlebars.compile(source);
//     var newHTML = template(fixtures[i]);
//     $('#fixtLine').append(newHTML);
//   }

// }

// function styler() {
//   document.getElementById("teamAhomeChart").width = 150;
//   document.getElementById("teamAhomeChart").height = 150;
// }

function myChart(data) {
  var ctx = document.getElementById("myChart");
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [data.teamB, "Draws", data.teamA],
      datasets: [{
        label: "",
        backgroundColor: [data.teamAB.teamB.color1, "#888888", data.teamAB.teamA.color1],
        data: [data.total.teamB, data.total.draws, data.total.teamA]
      }]
    },
    options: {
      title: {
        display: false,
        text: ''
      }
    }
  });
}

function teamAhomeChart(data) {
  var ctx = document.getElementById("teamAhomeChart");
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [data.teamB, "Draws", data.teamA],
      datasets: [{
        label: "",
        backgroundColor: [data.teamAB.teamB.color1, "#888888", data.teamAB.teamA.color1],
        data: [data.teamAhome.teamBwins, data.teamAhome.draws, data.teamAhome.teamAwins]
      }]
    },
    options: {
      title: {
        display: false,
        text: ''
      }
    }
  });
}

function teamBhomeChart(data) {
  var ctx = document.getElementById("teamBhomeChart");
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [data.teamB, "Draws", data.teamA],
      datasets: [{
        label: "",
        backgroundColor: [data.teamAB.teamB.color1, "#888888", data.teamAB.teamA.color1],
        data: [data.teamBhome.teamBwins, data.teamBhome.draws, data.teamBhome.teamAwins]
      }]
    },
    options: {
      title: {
        display: false,
        text: ''
      }
    }
  });
}
